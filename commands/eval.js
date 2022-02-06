const Discord = require("discord.js")
const config = require('../config.js')
module.exports.run = async(client, message, args, embed) => {
    if(!config.ownerID.includes(message.author.id)) return
    const content = message.content.split(" ").slice(1).join(" ");
    const result = new Promise((resolve, reject) => resolve(eval(content)));

    return result.then(async(output) => {
        if (typeof output !== "string") {
            output = require("util").inspect(output, {
                depth: 0
            });
        }
        if (output.includes(message.client.token)) {
            output = output.replace(message.client.token, "alirsin knk");
        }
       await message.channel.send(output, {
            code: "js"
        });
    }).catch(async(err) => {
        err = err.toString();
        if (err.includes(message.client.token)) {
            err = err.replace(message.client.token, "alirsin knk");
        }
       await message.channel.send(err, {
            code: "js"
        });
    })
}
exports.config = {
    name: "eval",
    guildOnly: true,
    aliases: [],
  };