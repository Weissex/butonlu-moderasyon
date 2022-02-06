const Discord = require('discord.js')
const { MessageButton } = require('discord-buttons')
const config = require('../config.js')
module.exports.run = async(client, message, args) => {
if (!message.member.hasPermission('MANAGE_MESSAGES'));
try {
const buton1 = new MessageButton()
.setStyle('grey')
.setLabel('10')
.setID('1')

const buton2 = new MessageButton()
.setStyle('grey')
.setLabel('20')
.setID('2')

const buton3 = new MessageButton()
.setStyle('grey')
.setLabel('50')
.setID('3')

const buton4 = new MessageButton()
.setStyle('grey')
.setLabel('100')
.setID('4')
const oldembed = new Discord.MessageEmbed().setColor('#2277dd').setDescription('Aşağıdaki butonlardan kaç adet mesaj silmek istediğinizi seçiniz.')
const newEmbeds = new Discord.MessageEmbed().setColor('GREEN').setDescription(`${config.emojis.yes} 10 adet mesaj silindi.`)
const newEmbeds2 = new Discord.MessageEmbed().setColor('GREEN').setDescription(`${config.emojis.yes} 20 adet mesaj silindi.`)
const newEmbeds3 = new Discord.MessageEmbed().setColor('GREEN').setDescription(`${config.emojis.yes} 50 adet mesaj silindi.`)
const newEmbeds4 = new Discord.MessageEmbed().setColor('GREEN').setDescription(`${config.emojis.yes} 100 adet mesaj silindi.`)

let oldMsg = await message.channel.send(oldembed, {
    buttons: [buton1, buton2, buton3, buton4]
})
var filter = (button) => button.clicker.user.id === message.author.id;

let collector = await oldMsg.createButtonCollector(filter, { time: 9999999 })

collector.on("collect", async (button) => {

    if (button.id === '1') {
        if (message.member.id != button.clicker.member.id && !user.id) return button.reply.send(`Komutu sadece ${message.author} yani komutu kullanan kişi kullanabilir.`, true)
        await button.reply.defer()
        message.react(config.emojis.yes)
        message.channel.bulkDelete(10).catch(err => console.log(`${button.guild.name} sunucusunda mesaj silerken hata oluştu. ${err}`)); 
        if (oldMsg) await oldMsg.edit({
            embed: newEmbeds,
            buttons: null
        })
    }
})

collector.on("collect", async (button) => {

    if (button.id === '2') {
        if (message.member.id != button.clicker.member.id && !user.id) return button.reply.send(`Komutu sadece ${message.author} yani komutu kullanan kişi kullanabilir.`, true)
        await button.reply.defer()
        message.react(config.emojis.yes)
        message.channel.bulkDelete(20).catch(err => console.log(`${button.guild.name} sunucusunda mesaj silerken hata oluştu. ${err}`)); 
        if (oldMsg) await oldMsg.edit({
            embed: newEmbeds2,
            buttons: null
        })
    }
})

collector.on("collect", async (button) => {

    if (button.id === '3') {
        if (message.member.id != button.clicker.member.id && !user.id) return button.reply.send(`Komutu sadece ${message.author} yani komutu kullanan kişi kullanabilir.`, true)
        await button.reply.defer()
        message.react(config.emojis.yes)
        message.channel.bulkDelete(50).catch(err => console.log(`${button.guild.name} sunucusunda mesaj silerken hata oluştu. ${err}`)); 
        if (oldMsg) await oldMsg.edit({
            embed: newEmbeds3,
            buttons: null
        })
    }
})

collector.on("collect", async (button) => {

    if (button.id === '4') {
        if (message.member.id != button.clicker.member.id && !user.id) return button.reply.send(`Komutu sadece ${message.author} yani komutu kullanan kişi kullanabilir.`, true)
        await button.reply.defer()
        message.react(config.emojis.yes)
        message.channel.bulkDelete(100).catch(err => console.log(`${button.guild.name} sunucusunda mesaj silerken hata oluştu. ${err}`)); 
        if (oldMsg) await oldMsg.edit({
            embed: newEmbeds4,
            buttons: null
        })
    }
})

} catch (error) {
    message.reply(`Bir hata oluştu`)
    console.log(error)}

}

exports.config = {
    name: "sil",
    guildOnly: true,
    aliases: []
}