const discord = require("discord.js");
const Discord = require("discord.js")
const { MessageButton } = require('discord-buttons');
const config = require("../config.js")

module.exports.run = async (client, message, args, embed) => {
    var guild = message.guild;
    var banlayan = message.author.tag;
    const user = args[0];
    var sebeb = args.slice(1).join(" ");

    const xen1 = new discord.MessageEmbed().setDescription("Bu işlemi gerçekleştirebilmek için `BAN_MEMBERS` yetkisine sahip olmalıyım").setColor("RED").setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()
    const xen2 = new discord.MessageEmbed().setDescription(`${message.author} Bu komutu kullanabilmek için yetkin yok.`).setColor('RANDOM').setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()
    const xen3 = new discord.MessageEmbed().setDescription("Lütfen geçerli birini etiketleyiniz.").setColor("RED").setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()
    const xen4 = new discord.MessageEmbed().setDescription(`${message.author} Banlamak istediğin kişi senden üst yada aynı pozisyonda.`).setColor("RANDOM").setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()
    const xen5 = new discord.MessageEmbed().setDescription(`${message.author} sunucu sahibini banlayamazsın`).setColor("RANDOM").setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()

    if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send(xen1);
    if (!message.member.roles.cache.has(config.staffs.kickstaff) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(xen2);
    if (!user) return message.channel.send(xen3);
    if (!message.author.id !== message.guild.ownerID) {
    if (!message.member.hasPermission('ADMINISTRATOR') && member && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(xen4)}
    if (user.id == message.guild.ownerID) return message.channel.send(xen5);

  const buton1 = new MessageButton()
    .setStyle('green')
    .setLabel('Evet')
    .setID('1')
  const buton2 = new MessageButton()
    .setStyle('red')
    .setLabel('Hayır')
    .setID('2')

try {
  const istek = new Discord.MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.embed.embedFooter).setColor('RED').setDescription(`<@!${user}> Adlı kullanıcı ${message.author} tarafından sunucudan yasaklanması açılacaktı fakat reddedildi.`);
  const logChannel = await message.guild.channels.cache.get(config.logs.kicklog);
  const a = new Discord.MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.embed.embedFooter).setColor('GREEN').setDescription(`${config.emojis.yes} <@!${user}> Adlı kullanıcı <@!${message.author.id}> tarafından sunucudan yasaklanması açıldı.`);
  const oldembed = new Discord.MessageEmbed().setColor('RED').setDescription(`${message.author}, <@!${user}> Adlı kullanıcıyı sunucudan yasağını açmak istediğinize eminmisiniz?`)
  const newEmbeds = new Discord.MessageEmbed().setColor('GREEN').setDescription(`${config.emojis.yes} <@!${user}> Adlı kullanıcı <@!${message.author.id}> tarafından sunucudan yasağı açıldı.`)
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
      message.guild.members.unban(user)
      if (oldMsg) oldMsg.delete({ timeout: 5000 });
      if (oldMsg) await oldMsg.edit({
        embed: newEmbeds,
        buttons: null
      })
    }
  })

  const hayir = new Discord.MessageEmbed().setColor('RED').setDescription(`${config.emojis.no} <@!${user}> Adlı kullanıcının ${message.author} yasaklanmasının açılmasını reddetti. `)
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
  name: "unban",
  guildOnly: true,
  aliases: [],
};