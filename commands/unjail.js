const discord = require("discord.js");
const Discord = require("discord.js")
const { MessageButton } = require('discord-buttons');
const db = require("quick.db")
const config = require("../config.js")

module.exports.run = async (client, message, args, embed) => {
  const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let rol = await db.get(`roles.${user.id}`);
  let nick = await db.get(`nick.${user.id}`)

  const xen1 = new discord.MessageEmbed().setDescription("Bu işlemi gerçekleştirebilmek için `MANAGE_ROLES` yetkisine sahip olmalıyım").setColor("RED").setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()
  const xen2 = new discord.MessageEmbed().setDescription(`${message.author} Bu komutu kullanabilmek için yetkin yok.`).setColor('RANDOM').setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()
  const xen3 = new discord.MessageEmbed().setDescription("Lütfen geçerli birini etiketleyiniz.").setColor("RED").setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()
  const xen4 = new discord.MessageEmbed().setDescription(`${message.author} jaile atmak istediğin kişi senden üst yada aynı pozisyonda.`).setColor("RANDOM").setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()
  const xen5 = new discord.MessageEmbed().setDescription(`${message.author} sunucu sahibini jaile atamazsın`).setColor("RANDOM").setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()

  if (!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send(xen1);
  if (!message.member.roles.cache.has(config.staffs.jailstaff) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(xen2);
  if (!user) return message.channel.send(xen3);
  if (!message.author.id !== message.guild.ownerID) {
  if (!message.member.hasPermission(8) && member && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(xen4)};
  if (user.id == message.guild.ownerID) return message.channel.send(xen5);

  const buton1 = new MessageButton()
    .setStyle('green')
    .setLabel('Evet')
    .setID('1')
  const buton2 = new MessageButton()
    .setStyle('red')
    .setLabel('Hayır')
    .setID('2')

try{
  const istek = new Discord.MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.embed.embedFooter).setColor('RED').setDescription(`<@!${user.id}> Adlı kullanıcı ${message.author} tarafından jailden çıkarılacaktı fakat reddedildi.`);
  const logChannel = await message.guild.channels.cache.get(config.logs.jaillog);
  const a = new Discord.MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.embed.embedFooter).setColor('GREEN').setDescription(`${config.emojis.yes} <@!${user.id}> Adlı kullanıcı <@!${message.author.id}> tarafından jailden çıkarıldı`);
  const oldembed = new Discord.MessageEmbed().setColor('RED').setDescription(`${user} Adlı kullanıcıyı jailden çıkarmak istediğinize eminmisiniz?`)
  const newEmbeds = new Discord.MessageEmbed().setColor('GREEN').setDescription(`${config.emojis.yes} ${user} Adlı kullanıcı <@!${message.author.id}> tarafından jailden çıkarıldı.`)
  let oldMsg = await message.channel.send(oldembed, {
    buttons: [buton1, buton2]
  })
  var filter = (button) => button.clicker.user.id === message.author.id;

  let collector = await oldMsg.createButtonCollector(filter, { time: 9999999 })

  collector.on("collect", async (button) => {

    if (button.id === '1') {
      logChannel.send(a)
      if (message.member.id != button.clicker.member.id) return button.reply.send(`Komutu sadece ${message.author} yani komutu kullanan kişi kullanabilir.`, true)
      await button.reply.defer()
      message.react(config.emojis.yes)
      user.roles.set(rol).catch(e => { });
      user.setNickname(nick)
      db.delete(`oldroles.${user.id}`);
      db.delete(`nick.${user.id}`);
      if (oldMsg) oldMsg.delete({ timeout: 5000 });
      if (oldMsg) await oldMsg.edit({
        embed: newEmbeds,
        buttons: null
      })
    }
  })

  const hayir = new Discord.MessageEmbed().setColor('RED').setDescription(`${config.emojis.no} ${user} Adlı kullanıcıyı ${message.author} tarafından jailden çıkarma reddedildi.`)
  collector.on("collect", async (button) => {
    if (button.id === '2') {
      if (message.member.id != button.clicker.member.id) return button.reply.send(`Komutu sadece ${message.author} yani komutu kullanan kişi kullanabilir.`, true)
      await button.reply.defer()
      message.react(config.emojis.no)
      logChannel.send(istek)
      if (oldMsg) oldMsg.delete({ timeout: 5000 });
      if (oldMsg) await oldMsg.edit({
        embed: hayir,
        buttons: null
      })
    }
  })
} catch (error) {
  message.reply(`Bir hata oluştu`)
  console.log(error)}

}

exports.config = {
  name: "unjail",
  guildOnly: true,
  aliases: [],
};