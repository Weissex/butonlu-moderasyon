const Discord = require('discord.js');
const discord = require('discord.js')
const db = require('quick.db');
const ms = require('ms');
const moment = require('moment');
const { MessageButton } = require('discord-buttons');
moment.locale('tr');
const config = require("../config.js")

exports.run = async (client, message, args) => {

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    const xen1 = new discord.MessageEmbed().setDescription(`${message.author} Bu komutu kullanabilmek için yetkin yok.`).setColor('RANDOM').setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı).setTimestamp()
    const xen2 = new Discord.MessageEmbed().setDescription('Bir kullanıcı etiketlemelisiniz.').setColor('RANDOM').setTimestamp().setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı)
    const xen3 = new Discord.MessageEmbed().setDescription('Etiketlediğin kullanıcı sunucuda yok yada bulamıyorum.').setColor('RANDOM').setTimestamp().setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı)
    const xen4 = new Discord.MessageEmbed().setDescription('Etiketlediğin kullanıcı sunucuda yok yada bulamıyorum').setColor('RANDOM').setTimestamp().setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı)
    const xen5 = new Discord.MessageEmbed().setDescription('Lütfen bir süre belirt.').setColor('RANDOM').setTimestamp().setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı)
    const xen6 = new Discord.MessageEmbed().setDescription('Geçerli bir zaman belirtmelisiniz.').setColor('RANDOM').setTimestamp().setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı)
    const xen7 = new Discord.MessageEmbed().setDescription('Lütfen bir süre belirt.').setColor('RANDOM').setTimestamp().setFooter(config.embed.embedFooter).setAuthor(config.embed.sunucuAdı)

    if (!message.member.roles.cache.has(config.staffs.muteStaff) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(xen1);
    if (!args[0]) return message.channel.send(xen2);
    if (!message.mentions.members.first()) return message.channel.send(xen3);
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(xen4);
    let süre = ['saniye', 'dakika', 'saat', 'gün', 'm', 'h', 'd', 's'];
    if (!args[1]) return message.channel.send(xen5);
    if (!args[2]) return message.channel.send(xen6);
    if (!süre.includes(args[2])) return message.channel.send(xen7);

    let reason = 'Bir sebep girilmemiş.';
    if (args[3]) reason = args.slice(3).join('');
    let end = Date.now()+''+ms(args[1] + args[2].replace('dakika', 'm').replace('saat', 'h').replace('saniye', 's').replace('gün', 'd'));


    db.set(member.user.id, {
        end: end,
        start: Date.now(),
        moderatorUsername: message.author.username,
        moderatorID: message.author.id,
        moderatorAvatarURL: message.author.displayAvatarURL({ dynamic: true }),
        reason: reason
    });
    const buton1 = new MessageButton()
        .setStyle('green')
        .setLabel('Evet')
        .setID('1')
    const buton2 = new MessageButton()
        .setStyle('red')
        .setLabel('Hayır')
        .setID('2')

try{
        const istek = new Discord.MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.embed.embedFooter).setColor('RED').setDescription(`<@!${user.id}> Adlı kullanıcıya ${message.author} tarafından mute atılacaktı fakat reddedildi.`);
        const logChannel = await message.guild.channels.cache.get(config.logs.jaillog);
        const a = new Discord.MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.embed.embedFooter).setColor('GREEN').setDescription(`${config.emojis.yes} <@!${user.id}> Adlı kullanıcıya ${message.author} tarafından **${reason}** sebebi ile mute atıldı.`);
        const oldembed = new Discord.MessageEmbed().setColor('RED').setDescription(`${user} Adlı kullanıcıyı **${reason}** sebebi ile mute atmak istediğinize eminmisiniz?`)
        const newEmbeds = new Discord.MessageEmbed().setColor('GREEN').setDescription(`${config.emojis.yes} ${user} Adlı kullanıcıya <@!${message.author.id}> tarafından **${reason}** sebebi ile mute atıldı.`)
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
            user.roles.add(config.roles.muted)
            if (oldMsg) oldMsg.delete({ timeout: 5000 });
            if (oldMsg) await oldMsg.edit({
              embed: newEmbeds,
              buttons: null
            })
          }
        })
    
        const hayir = new Discord.MessageEmbed().setColor('RED').setDescription(`${config.emojis.no} ${user} Adlı kullanıcıyı muteleme reddedildi.`)
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
    



    let log = await message.guild.channels.cache.get(config.logs.mutelog);
    const xen9 = new Discord.MessageEmbed().setColor('GREEN').setTitle('Susturulması açıldı.').setDescription(`<@!${member.user.id}> Adlı kullanıcıya ${message.author} tarafından **${reason}** sebebi ile atılan mute sona erdi.`)

    setTimeout(() => {
        return member.roles.remove(config.roles.muted).then(() => db.delete(member.user.id) && log.send(xen9));
    }, ms(args[1]+''+args[2].replace('dakika', 'm').replace('saat', 'h').replace('saniye', 's').replace('gün', 'd')));
  } catch (error) {
    message.reply(`Bir hata oluştu`)
    console.log(error)}
};
exports.config = {
    name: "mute",
    guildOnly: true,
    aliases: [],
    description: "<prefix> @xen/ID 10 <süre> <varsa sebep>",
};