import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import axios from "axios";
const safe = require("safe-browse-url-lookup")({
  apiKey: "AIzaSyAmdZcPvL7Mc09iDRkQKoaf50UiF6-mJkE",
});

export default class CheckCommand extends BaseCommand {
  constructor() {
    super("check", "monitor", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0]) {
      return message.channel.send({
        content: `❌ **Please Send A Url To Check it**`,
      });
    }
    try {
      var fetched = await axios.get(args[0]);
    } catch (error) {
      return message.channel.send({
        content: `❌ **Url Not Valid: ${args[0]}**`,
      })
    }
    let isVirus = await safe.checkSingle(args[0]);
    let Embed = new MessageEmbed()
    .setAuthor(`Url Is: ${isVirus ? 'Virus (Danger Dont Enter it)' : 'Safe'}`)
    .setColor(isVirus ? `#ff0000`:`#00ff00`)
    .setDescription(`Url Status: (${fetched.status} : ${fetched.statusText.toLowerCase()})`)
    message.channel.send({embeds:[Embed]})
  }
}
