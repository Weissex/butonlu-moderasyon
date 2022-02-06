const Discord = require('discord.js');
const db = require('quick.db');
const { MessageButton } = require('discord-buttons');
const config = require('../config.js');
exports.run = async (client, message, args) => {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    let sebep;
    if (!args[0]) sebep = 'Sebep girilmemiş';
    if (args[0]) sebep = args.slice(0).join(' ');
    let isim = message.guild.members.cache.get(message.author.id).displayName;
    db.set(`isim.${message.author.id}.${message.guild.id}`, isim)
    db.set(`afk.${message.author.id}.${message.guild.id}`, `AFK'sın.`)
    db.set(`sebep.${message.author.id}.${message.guild.id}`, sebep)
   

        const buton1 = new MessageButton()
        .setStyle('green')
        .setLabel('Evet')
        .setID('1')
  
      const buton2 = new MessageButton()
        .setStyle('red')
        .setLabel('Hayır')
        .setID('2')




    const a = new Discord.MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.embed.embedFooter).setColor('GREEN').setDescription(`${message.author} Adlı kullanıcı **${sebep}** sebebi ile afk moduna giriş yaptı.`);
    const oldembed = new Discord.MessageEmbed().setColor('RED').setDescription(`${message.author} Afk moduna girmek istediğinize eminmisiniz?`)
    const newEmbeds = new Discord.MessageEmbed().setColor('GREEN').setDescription(`${config.emojis.yes} ${message.author} Başarıyla **${sebep}** sebebi ile afk moduna giriş yaptın.`)
    let oldMsg = await message.channel.send(oldembed, {
        buttons: [buton1, buton2]
    })
    var filter = (button) => button.clicker.user.id === message.author.id;

    let collector = await oldMsg.createButtonCollector(filter, { time: 9999999 })

    collector.on("collect", async (button) => {

        if (button.id === '1') {
            if (message.member.id != button.clicker.member.id) return button.reply.send(`Komutu sadece ${message.author} yani komutu kullanan kişi kullanabilir.`, true)
            await button.reply.defer()
            message.react(config.emojis.yes)
            message.guild.members.cache.get(message.author.id).setNickname(`[AFK] ${isim}`).catch(err => console.log(`${button.guild.name} sunucusunda afk ya girerken bir hata oluştu hata: ${err}`));
            db.set(`xen_${message.author.id}`, 1)
            if (oldMsg) oldMsg.delete({ timeout: 5000 });
            if (oldMsg) await oldMsg.edit({
                embed: newEmbeds,
                buttons: null
            })
        }
    })

    const hayir = new Discord.MessageEmbed().setColor('RED').setDescription(`${config.emojis.no} ${message.author} afk moduna giriş yapmayi reddetti.`)
    collector.on("collect", async (button) => {
        if (button.id === '2') {
            if (message.member.id != button.clicker.member.id) return button.reply.send(`Komutu sadece ${message.author} yani komutu kullanan kişi kullanabilir`, true)
            await button.reply.defer()
            message.react(config.emojis.no)
            if (oldMsg) oldMsg.delete({ timeout: 5000 });
            if (oldMsg) await oldMsg.edit({
                embed: hayir,
                buttons: null
            })
        }
    })
};

exports.config = {
    name: "afk",
    guildOnly: true,
    aliases: [],
};