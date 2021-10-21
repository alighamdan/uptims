import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import UrlSchema from "../../data/urls";
import fetch from "../../client/fetch";

export default class ProjectsCommand extends BaseCommand {
  constructor() {
    super("projects", "monitor", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    let user = await UrlSchema.findOne({ userId: message.author.id });
    let urls: Array<{ url: string; status: string; userId: string,statusText:String }> =
      await UrlSchema.find({ userId: message.author.id });
    if (!urls) {
      return message.channel.send({
        content: `<@!${message.author.id}>**, You Dont Have Any Urls**`,
      });
    }
    let number = 1;
    let url = urls
      .map((ur) => {
        return `${number++} - ${ur?.url} ${
          ur.status
            ? `**(Status: ${ur.statusText.toLowerCase()})**`
            : ""
        }`;
      })
      .join("\n");
    sendAll(message, url).catch(console.error);
  }
}

function sendAll(message: Message, urlsmap: string): Promise<any> {
  let arr: Array<string> = [];
  for (var i = 0; i < urlsmap.length; i += 2000) {
    let element = urlsmap.substring(i, 2000);
    arr.push(element);
  }
  return message.channel.send({ content: `**See Your DM**` }).then((msg) => {
    let num = 1;
    arr.forEach(function (str: string) {
      message.author.send({
        embeds: [
          {
            author: {
              name: `Page: ${num++} From ${arr.length}`,
            },
            description: str,
            timestamp: new Date(),
          },
        ],
      });
    });
  });
}
