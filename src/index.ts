import { config as conf } from "dotenv";
import { registerCommands, registerEvents } from "./utils/registry";
import DiscordClient from "./client/client";
import { Intents } from "discord.js";
const client = new DiscordClient({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
import mongoose from "mongoose";
import UrlSchema from "./data/urls";
import axios from "axios";
// import { promises as fs } from "fs";
const ms = require("ms");

// fs.readFile('.env').catch(Error=>{
//   fs.writeFile('.env',`IntervalTime=\nMongoDB_URL=`,{encoding:'utf-8'})
// });

conf();
mongoose.connect(`${process.env.MongoDB_URL}`, (error) => {
  if (error) {
    console.error("Error connecting to MongoDB: " + error);
  } else console.log("Connected to MongoDB");
});

(async () => {
  client.prefix = process.env.prefix || client.prefix;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await client.login(process.env.token);
})();

setInterval(async () => {
  let urls = await UrlSchema.find();
  if (!urls || urls.length === 0) {
    return;
  }
  urls.forEach(async (url: { url: string; userId: string; status: string }) => {
    axios
      .get(url.url)
      .then((response) => {
        UrlSchema.findOneAndUpdate(
          { url: url.url },
          {
            status: response.status,
            statusText: response.statusText,
          }
        );
      })
      .catch((error) => {
        UrlSchema.findOneAndUpdate(
          { url: url.url },
          {
            status: "404",
            statusText: "Not Good!",
          }
        );
      });
  });
}, ms(`${process.env.IntervalTime || 10000}`));
