const { Client , Collection} = require('discord.js');
const Discord = require("discord.js")
const client = new Discord.Client();
const MessageButton = require('discord-buttons');
const db = require("quick.db")
MessageButton(client);
const config = require("./config.js")
const fs = require("fs");
require('./util/Loader.js')(client);     

client.commands = new Discord.Collection(); 
client.aliases = new Discord.Collection();  
fs.readdir('./commands/', (err, files) => { 
  if (err) console.error(err);               
  console.log(`${files.length} Komut Yüklenecek.`);
  files.forEach(f => {                       
    let props = require(`./commands/${f}`);   
    console.log(`${props.config.name} komutu yüklendi`);  
    client.commands.set(props.config.name, props); 
    props.config.aliases.forEach(alias => {          
      client.aliases.set(alias, props.config.name);  
    });
  });
})

client.on('ready', async () => {
  client.appInfo = await client.fetchApplication();
 setInterval( async () => {
   client.appInfo = await client.fetchApplication();
 }, 600);
 
 client.user.setPresence({ activity: { type:"PLAYING" ,name: `${config.botdurum}` }, status: "dnd" })//idle(boşta),online(aktif),dnd(rahatsız etme)

 console.log("Dc: xenkw#0001")
});

client.login(config.token)




client.on('ready', () => {
  client.guilds.cache.forEach(guild => {
  guild.members.cache.forEach(async member => {
  const fetch = await db.fetch(member.user.id);
  if(!fetch) return;
  if((Date.now() <= fetch.end) || fetch) {
  let kalan = fetch.end - Date.now();
  
  let logChannel = await guild.channels.cache.get(config.logs.mutelog);
  setTimeout(() => {
  const embed = new Discord.MessageEmbed()
  .setAuthor(fetch.moderatorUsername, fetch.moderatorAvatarURL);
  return member.roles.remove(config.roles.muted).then(() => db.delete(member.user.id) && logChannel.send(embed.setColor('GREEN').setTimestamp().setFooter(config.embed.embedFooter).setDescription(`<@!${member.user.id}> Adlı kullanıcıya atılan mute sona erdi. ${fetch.reason}`)));
  }, kalan);
  };
  });
  });
  });



  client.on("message", async message => {
    message.guild.members.cache.forEach(xen => {
      if(message.content.includes("<@" + xen.id + ">") || message.content.includes("<@!" + xen.id + ">")) {
      let kontrol = db.fetch(`afk.${xen.id}.${message.guild.id}`)
    let sebep = db.fetch(`sebep.${xen.id}.${message.guild.id}`)
    if(!kontrol) return;
      if(kontrol) {
        let embed = new Discord.MessageEmbed()
        .setDescription("<@" + xen + ">" + ", **" + sebep + "** nedeniyle AFK")
  .setColor(`RANDOM`)
      message.channel.send(embed)
       }
      }
     })
    });
  
  client.on("message", message => {
  if(message.content.startsWith(`${config.prefix}afk`)) return
  if(db.fetch(`xen_${message.author.id}`) === 1) {
   message.reply("Kişisi artık AFK değil.")
    let data = db.fetch(`isim.${message.author.id}.${message.guild.id}`)
  message.guild.members.cache.get(message.author.id).setNickname(data).catch(err => console.log(`${message.guild.name} sunucusunda afkdan çıkarken bir hata oluştu hata: ${err}`));
  db.delete(`xen_${message.author.id}`)
  db.delete(`afk.${message.author.id}.${message.guild.id}`)
  db.delete(`isim.${message.author.id}.${message.guild.id}`)
  db.delete(`sebep.${message.author.id}.${message.guild.id}`)
  }
  })
       
    
