import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import UrlSchema from "../../data/urls";

export default class DeleteCommand extends BaseCommand {
  constructor() {
    super("delete", "monitor", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0]) {
      return message.channel.send({
        content: `❌ **You Must Send The Url You Want To Delete it!**`,
      });
    }
    let url = await UrlSchema.findOne({
      url: args[0],
      userId: message.author.id,
    });
    if (!url || url.userId != message.author.id) {
      return message.channel.send({
        content: `❌ **This Url Has Not Found**`,
      });
    }
    await UrlSchema.findOneAndDelete(
      { userId: message.author.id, url: args[0] },
      {}
    )
      .then(async (a) => {
        message.channel.send({
          content: `**Url Deleted Successfully**`,
        });
      })
      .catch(async (Error) => {
        let l = await UrlSchema.findOne({
          userId: message.author.id,
          url: args[0],
        });
        if (!l) {
          message.delete();
          return message.channel.send({
            content: `**Url Deleted Successfully**`,
          });
        }else message.channel.send({content:`❌ **Url Can't Be Deleted!**`})
      });
  }
}
