import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import UrlSchema from "../../data/urls";
import fetch from "../../client/fetch";


export default class UptimeCommand extends BaseCommand {
  constructor() {
    super("uptime", "monitor", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    try {
      let user = await UrlSchema.findOne({ userId: message.author.id });
    if (!args[0]) {
      return message.reply({ content: `**Please Send The Url**` });
    }
    // if (!args[0].includes("https://") || !args[0].includes("http://")) {
    //   return message.reply({
    //     content: `**Please Send A Valid Url**`,
    //   });
    // }
    let url: urlschema = await UrlSchema.findOne({ url: args[0] });
    if (url?.url) {
      return message.reply({
        content: `❌ **This Url Already Exists**`,
      });
    }
    try {
      var fetched = await fetch.get(args[0]);
    } catch (error) {
      return message.reply({
        content: `❌ **Failed to fetch this url**`,
        embeds: [
          { 
            title: `Check You Add This Code To Your Project ❌`,
            timestamp: new Date(),
            author: {
              name: `${message.author.username}`,
              iconURL: `${message.author.avatarURL({dynamic:true})}`,
            },
            color: 'RED',
            fields: [
              { 
                name: 'Javascript',
                value:`\`\`\`js\nconst express = require('express');\nconst PORT = 3000; //Your PORT\n\nconst app = express();\n\napp.get('/',(req,res)=>{\nres.status(200);\nres.send(new Date());\n});\n\napp.listen(PORT,()=>{\nconsole.log('listening on port ' + PORT);\n});\`\`\``
              },
              { 
                name: 'TypeScript',
                value:`\`\`\`ts\nimport express,{Express} from "express";\nconst PORT = 3000; //Your PORT\nconst app = Express();\napp.get('/', (req:express.Request, res:express.Response) => {\nres.status(200);\nres.send(new Date());\n});\`\`\``
              }
            ],
          }
        ]
      });
    }
    UrlSchema.create({
      url: args[0],
      userId: message.author.id,
      status: fetched.status,
      statusText: fetched.statusText
    }).then(function (response) {
      message.delete();
      message.channel.send({
        content: `<@!${message.author.id}>**, Uptimed Successfully!**`,
      });
    }).catch(function (error) {
      message.reply({ 
        content: `**Uptimed Error: ${error.message ?? error}`
      });
      console.log(error);
    });
    } catch (error) {
      console.error(error);
    }
  }
}

interface urlschema {
  url?: string;
  userId: string;
  status?: string;
}
