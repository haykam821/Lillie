/*
setting["numUsers"].value starts counting from 0
*/

let rainbowRoleGuild = "284433301945581589";
let rainbowRole = "284906292341112832";
let rainbowColors = ["#FF0000", "#FF4400", "#FF8800", "#FFC400", "#FFFF00", "#80FF00", "#00FF00", "#00ff80", "#00FFFF", "#0080FF", "#0000FF", "#8800FF", "#FF00FF", "#FF0080"];
let colorChangeTime = 2500;
let colorIndex = 0;

let reactions = {};

var cycleColors = function(){
  if (colorIndex >= rainbowColors.length - 1){
    colorIndex = 0;
  }else{
    colorIndex++;
  }
  bot.guilds.get(rainbowRoleGuild).roles.get(rainbowRole).setColor(rainbowColors[colorIndex]).catch((err) => {console.log(err);});
  setTimeout(cycleColors, colorChangeTime);
  return 0;
}

var Discord = require("discord.js");
var bot = new Discord.Client();
var fs = require('fs');
var readline = require('readline');
const ImagesClient = require('google-images');

let client = new ImagesClient('004497848346027955910:bvtye9dcwfc', 'AIzaSyApx3SNxIM9N1rALRy6CcbWVLZtzalFW1I');

/*
Nebula's server.id -> 259073919896649728
*/

/*
PizzaBox: 195231081627254784
*/
//Allows for testing new features while bot is running
var botEnable = true;

let regUsers = JSON.parse(fs.readFileSync('./regUsers.json', 'utf8'));
let settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
let permsUsersList = JSON.parse(fs.readFileSync('./permsUsersList.json', 'utf8'));
let userList = JSON.parse(fs.readFileSync('./userList.json', 'utf8'));
let banned = JSON.parse(fs.readFileSync('./banned.json', 'utf8'));
let servers = JSON.parse(fs.readFileSync('./servers.json', 'utf8'));
let tempBanned = JSON.parse(fs.readFileSync('./tempBanned.json', 'utf8'));
let custmsgs = JSON.parse(fs.readFileSync('./custmsgs.json', 'utf8'));
let pointRoles = JSON.parse(fs.readFileSync('./pointRoles.json', 'utf8'));
let questRoles = JSON.parse(fs.readFileSync('./questRoles.json', 'utf8'));
let civilWarRoles = JSON.parse(fs.readFileSync('./civilWarRoles.json', 'utf8'));
/*
function detectSKInvite(x) {
  var detected = false;
  x.split(" ").forEach((block)=>{
    if (bot.fetchInvite(block)){
      if (bot.fetchInvite(block).guild.id == "252525368865456130"){
        detected = true;
      }
    }
  });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(detected);
    }, 10);
  });
}

async function deleteSKInvites(message){
  var hasSKInvite = await detectSKInvite(message.content);
  if (hasSKInvite){
    msg.delete();
    msg.reply("Invites to SK are forbidden!");
    return true;
  }
  return false;
}
*/

bot.on('ready', () => {
  console.log('I am ready!');
  bot.user.setStatus('online');
  bot.user.setGame('Pokémon Moon');
  fs.writeFile('./tempBanned.json', JSON.stringify({}), console.error);
  cycleColors();
});

bot.on('error', e => {
  if (e);
  console.error(e);
});

bot.on("guildCreate", guild => {
  let i = 0;
  while (servers[i]){
    i++
  }
  servers[i] = {"name": guild.name, "id": guild.id};
});

bot.on("guildMemberAdd", (member) => {
  if (banned[member.id]){
    if (banned[member.id].permban){
      bot.guilds.get(member.guild.id).members.get(member.id).kick().catch(function(err){bot.channels.get("288573875057590272").sendMessage(member + " (" + member.id + ")" + " cannot be kicked from " + member.guild.name + " (" + member.guild.id + ")!"); console.log(err);});
      return;
    }
  }
  bot.user.fetchProfile(member.id).catch(function(err){console.log(err);});
  if (member.guild.id == "284433301945581589"){
    let nickname = member.user.username.toString().replace(/❂/gi, 'o');
    member.setNickname("🌌 " + nickname).catch((err)=>{console.log(err);});
  }
  bot.users.get(member.id).sendMessage("Welcome!");
});

let bagCounter = 0;

var react = function (msg, reactNum){
  if (reactions[msg.channel.id]){
    if (reactions[msg.channel.id].reactions){
      msg.react(reactions[msg.channel.id].reactions[reactNum]).then(() => {
        if (reactNum < reactions[msg.channel.id].reactions.length){
          setTimeout(react(msg, reactNum + 1), 500);
        }
      });
    }
  }
}

bot.on("message", msg => {
  react(msg, 0);
  /*if (!msg.author.bot){
    var detected = false;
    var blockArray = msg.content.split(" ");
    blockArray.forEach((block)=>{
    if (detected == false && bot.fetchInvite(block).length > 0){
      if (bot.fetchInvite(block).guild.id == "252525368865456130"){
        detected = true;
        msg.channel.sendMessage("Invites to SK are forbidden!").then(()=>{
          msg.delete();
        });
      }
    }
  });
  //deleteSKInvites(msg).catch((err)=>{console.log(err);}); 
  }*/
  if (banned[msg.author.id]){
    if (msg.guild){
    if (banned[msg.author.id].permban){
      if (!msg.guild.member(bot.user).hasPermission("KICK_MEMBERS")){
        bot.channels.get("288573875057590272").sendMessage(bot.guilds.get(msg.guild.id).members.get(msg.author.id) + " (" + msg.author.id + ")" + " cannot be kicked from " + bot.guilds.get(msg.guild.id).name + " (" + msg.guild.id + ")!");
      }else{
        msg.channel.sendMessage(bot.guilds.get(msg.guild.id).members.get(msg.author.id) + " (" + msg.author.id + ")" + " has been kicked from " + bot.guilds.get(msg.guild.id).name + " (" + msg.guild.id + ")!");
        bot.guilds.get(msg.guild.id).members.get(msg.author.id).kick().catch(function(err){console.log(err);});
      }
    }
    }
  }
  if (msg.mentions.users.first()){
    if (!msg.author.bot){
    if (banned[msg.mentions.users.first().id]){
      if (banned[msg.mentions.users.first().id].permban){
        let worked = 1;
        if (!msg.guild.member(bot.user).hasPermission("KICK_MEMBERS")){
          bot.channels.get("288573875057590272").sendMessage(bot.guilds.get(msg.guild.id).members.get(msg.mentions.users.first().id) + " (" + msg.mentions.users.first().id + ")" + " cannot be kicked from " + bot.guilds.get(msg.guild.id).name + " (" + msg.guild.id + ")!");
        }else{
          bot.guilds.get(msg.guild.id).members.get(msg.mentions.users.first().id).kick().catch(function(err){console.log(err); msg.channel.sendMessage(bot.guilds.get(msg.guild.id).members.get(msg.mentions.users.first().id) + " (" + msg.mentions.users.first().id + ")" + " cannot be kicked from " + bot.guilds.get(msg.guild.id).name + " (" + msg.guild.id + ")!"); worked = 0;}).then(() => {
          if (worked) msg.channel.sendMessage(bot.guilds.get(msg.guild.id).members.get(msg.mentions.users.first().id) + " (" + msg.mentions.users.first().id + ")" + " has been kicked from " + bot.guilds.get(msg.guild.id).name + " (" + msg.guild.id + ")!")});
        }
      }
    }
    }
  }
  if (msg.channel.type == 'dm' && !msg.author.bot && msg.author.id != "197592250354499584"){
    bot.users.get("197592250354499584").sendMessage(msg.author.id + " " + msg.content);
  }
  if (msg.content.toLowerCase().includes("gender")){
     msg.channel.sendMessage("TRIGGERED!");
   }
  if ((msg.content.length < settings["minmsglength"].value) && (!msg.author.bot)){
    msg.delete(settings["minmsgdeletetime"].value);
  }
  if (msg.author.id == "197592250354499584" && (msg.content.toLowerCase().includes("pew"))){
    msg.channel.sendMessage(bot.users.get("197592250354499584") + "**, GET IN THE BAG!!!**").then((sent) => {
      //sent.delete(15000);
    });
    bagCounter++;
    if (bagCounter == 10){
      bagCounter = 0;
      msg.channel.sendMessage("https://68.media.tumblr.com/6911d9496f3f5d94c69036528aecef5c/tumblr_ohdc2zs11Y1qlrztvo1_500.png").then ((sent2) => {
        //sent2.delete(15000);
      });
    }
  }
  if (settings["deletebannedmsgs"].value == true){
    if (banned[msg.author.id]){
      if (banned[msg.author.id].timeban){
        msg.delete(settings["deletebannedmsgstime"].value);
      }
    }
    if (tempBanned[msg.author.id]){
      if (tempBanned[msg.author.id].tempban > 0){
        msg.delete(0);
      }
    }
  }
  /*LEGACY
  if (msg.author.id == "197535500024807425" && settings["shippingmsg"].value == true){
    msg.channel.sendMessage(bot.users.get(msg.author.id) + ", remember that shipping is not allowed!").then((sent) => {
      sent.delete(15000);
    });
  }
  if (msg.author.id == "234655249695113216" && settings["nokissingmsg"].value == true){
    msg.channel.sendMessage(bot.users.get(msg.author.id) + ", remember that kissing Nolife without her permission is harassment!").then((sent) => {
      sent.delete(15000);
    });
  }
  */
  if (custmsgs[msg.author.id]){
    if (custmsgs[msg.author.id].toggle == true){
      msg.channel.sendMessage(bot.users.get(msg.author.id) + ", " + custmsgs[msg.author.id].text).then((sent) => {
        sent.delete(15000);
      });
    }
  }
  let prefix = settings["prefix"].value;
  let commandUsed = false;
  let command =  ((msg.content.split(" "))[0]).replace(prefix, '');
  let args = msg.content.split(" ").slice(1);
  if(!msg.content.startsWith(prefix)) return;
  if(msg.author.bot) return;
  if ((command == "botenable") && (msg.author.id === "197592250354499584")){
    botEnable = true;
    msg.channel.sendMessage("Bot enabled!");
    commandUsed = true;
  }
  if (botEnable == true){

  if (command == "ping") {
    msg.channel.sendMessage("Pong!").then((sent) => {
      let t = sent.createdTimestamp - msg.createdTimestamp;
      sent.edit("Pong! " + t + "ms");
      commandUsed = true;
    });
  }
    
  if (command == "autoreactadd" || command == "ara") {
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (permsUsersList[msg.author.id].isAdmin != true)){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    let all = false;
    if (args[0] == "-s"){
      all = true;
      args = args.slice(1);
    }
    let reactionArray = [];
    args.forEach((arg) => {reactionArray.push(arg);});
    if (all){
      let array = [];
      msg.guild.channels.forEach((channel) => {array.push(channel.id);});
      if (!reactions[msg.channel.id]){
        for (let i = 0; i < array.length; i++){
          reactions[array[i.toString()]] = {reactions: reactionArray};
        }
        msg.channel.sendMessage("Auto-react enabled! (for all channels in this server)");
      }else{
        for (let i = 0; i < array.length; i++){
          reactions[array[i.toString()]].reactions = reactionArray;
        }
        msg.channel.sendMessage("Auto-react updated! (for all channels in this server)");
      }
      return;
    }
    if (!reactions[msg.channel.id]){
      reactions[msg.channel.id] = {reactions: reactionArray};
      msg.channel.sendMessage("Auto-react enabled!");
    }else{
      mentionResponses[msg.channel.id].reactions = reactionArray;
      msg.channel.sendMessage("Auto-react updated!");
    }
  }
    
  if (command == "autoreactdelete" || command == "ard") {
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (permsUsersList[msg.author.id].isAdmin != true)){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if (args[0] == "-g"){
      if (msg.author.id != "197592250354499584"){
        msg.channel.sendMessage("Insufficient permissions!");
        return;
      }
      reactions = {};
      msg.channel.sendMessage("Deleted all auto-reactions globally!");
      return;
    }
    if (args[0] == "-s"){
      let array = [];
      msg.guild.channels.forEach((channel) => {array.push(channel.id);});
      array.forEach((a) => {
        if (reactions[a]){
          delete reactions[a];
        }
      });
      msg.channel.sendMessage("Deleted all auto-reactions on this server!");
      return;
    }
    if (!reactions[msg.channel.id]){
      msg.channel.sendMessage("There are no auto-reactions in this channel!");
    }else{
      delete reactions[msg.channel.id];
      msg.channel.sendMessage("Deleted auto-reactions for this channel!");
    }
  }

  else if (command == "poosi"){
    if (!msg.mentions.users.first()){
      return;
    }
    bot.user.fetchProfile(msg.author.id);
    bot.users.get(msg.author.id).sendMessage("Goodbye!");
    bot.users.get("197592250354499584").sendMessage("Kicked " + bot.users.get(msg.author.id).username + "!" + msg.author.id);
    bot.guilds.get(msg.guild.id).users.get(msg.author.id).kick();
  }

  else if (command == "nebulayt"){
    msg.channel.sendMessage("Our Nebula YouTube channel is at https://www.youtube.com/channel/UCqcYh-KDSjw4Jwodx7A8rmw. Subscribe!");
    commandUsed == true;
  }

  //Private DM

  else if (command == "_dm"){
    if (!args[0]){
      msg.channel.sendMessage("`Usage: [p]_dm [userid] [message]`");
      return;
    }
    if (isNaN(args[0])){
      msg.channel.sendMessage("`Usage: [p]_dm [userid] [message]`");
      return;
    }
    if (!bot.user.fetchProfile(args[0].toString())){
      msg.channel.sendMessage("`Usage: [p]_dm [userid] [message]`");
      return;
    }
    bot.users.get(args[0].toString()).sendMessage(args.slice(1).join(" ").toString());
    msg.channel.sendMessage("Message sent successfully!");
  }

  //Fun

  else if (command == "trump"){
    if (!args[0]){
        msg.channel.sendMessage("WE MUST BUILD A WALL!");
    }
    if (args[0]){
      msg.channel.sendMessage("Make " + args.toString().replace(/,/g, ' ') + " great again!");
    }
    commandUsed = true;
  }

  else if (command == "trumpmeme"){
    client.search('trump meme ' + (Math.floor(Math.random() * (10) )).toString())
      .then(function (images) {
         let array = images.slice(0,9);
         let n = Math.floor(Math.random() * (10) );
         for (let i = 0; i < 10; i++){
            while (!array[n]){
             n = Math.floor(Math.random() * (10) );
            }
         }
         if (!array[n]){
           msg.channel.sendMessage("Error! Please try again!");
           return;
         }
         msg.channel.sendMessage(array[n].url).then((sent) => {
           if (settings["tempmemes"].value == true){
             msg.delete(settings["tempmemestime"].value);
             sent.delete(settings["tempmemestime"].value);
           }
         });
    });
    commandUsed = true;
  }

  else if (command == "christmas"){
    client.search('house with christmas lights tree OR christmas tree ' + (Math.floor(Math.random() * (10) )).toString())
      .then(function (images) {
         let array = images.slice(0,9);
         let n = Math.floor(Math.random() * (10) );
         for (let i = 0; i < 10; i++){
            while (!array[n]){
             n = Math.floor(Math.random() * (10) );
            }
         }
         if (!array[n]){
           msg.channel.sendMessage("Error! Please try again!");
           return;
         }
         msg.channel.sendMessage(array[n].url).then((sent) => {
           if (settings["tempmemes"].value == true){
             msg.delete(settings["tempmemestime"].value);
             sent.delete(settings["tempmemestime"].value);
           }
         });
    });
    commandUsed = true;
  }

  else if (command == "kittens"){
    client.search('cute kittens ' + (Math.floor(Math.random() * (10) )).toString())
      .then(function (images) {
         let array = images.slice(0,9);
         let n = Math.floor(Math.random() * (10) );
         for (let i = 0; i < 10; i++){
            while (!array[n]){
             n = Math.floor(Math.random() * (10) );
            }
         }
         if (!array[n]){
           msg.channel.sendMessage("Error! Please try again!");
           return;
         }
         msg.channel.sendMessage(array[n].url).then((sent) => {
           if (settings["tempmemes"].value == true){
             msg.delete(settings["tempmemestime"].value);
             sent.delete(settings["tempmemestime"].value);
           }
         });
    });
    commandUsed = true;
  }

  //Settings
  else if (command == "selfpts"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (permsUsersList[msg.author.id].isAdmin == true)){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        settings["selfpts"].value = false;
        msg.channel.sendMessage("Disabled selfpoints!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        settings["selfpts"].value = true;
        msg.channel.sendMessage("Enabled selfpoints!");
      }else{
        msg.channel.sendMessage("`Usage: [p]selfpts [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "deletebannedmsgs"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (permsUsersList[msg.author.id].isAdmin == true)){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        settings["deletebannedmsgs"].value = false;
        msg.channel.sendMessage("Disabled banned message deletion!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        settings["deletebannedmsgs"].value = true;
        msg.channel.sendMessage("Enabled banned message deletion!");
      }else{
        msg.channel.sendMessage("`Usage: [p]deletebannedmsgs [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "setprefix"){
    if (msg.author.id == "197592250354499584"){
      if (!args[0]){
        msg.channel.sendMessage("`Usage: [p]prefix [prefix]`");
        return;
      }
      settings["prefix"].value = args[0];
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
      msg.channel.sendMessage("Prefix set to " + settings["prefix"].value + "!");
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "tempmemes"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (permsUsersList[msg.author.id].isAdmin == true)){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        settings["tempmemes"].value = false;
        msg.channel.sendMessage("Disabled temporary memes!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        settings["tempmemes"].value = true;
        msg.channel.sendMessage("Enabled temporary memes!");
      }else{
        msg.channel.sendMessage("`Usage: [p]tempmemes [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "tempmemestime"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (permsUsersList[msg.author.id].isAdmin == true)){
      if (!args){
        msg.channel.sendMessage(settings["tempmemestime"].value + "ms");
        return;
      }
      if (isNaN(args[0])){
        msg.channel.sendMessage(settings["tempmemestime"].value + "ms");
        return;
      }
      settings["tempmemestime"].value = args[0];
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
      msg.channel.sendMessage("Temporary meme time set to " + settings["tempmemestime"].value + " milliseconds!");
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "minmsgdeletetime"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (permsUsersList[msg.author.id].isAdmin == true)){
      if (!args){
        msg.channel.sendMessage(settings["minmsgdeletetime"].value + "ms");
        return;
      }
      if (isNaN(args[0])){
        msg.channel.sendMessage(settings["minmsgdeletetime"].value + "ms");
        return;
      }
      settings["minmsgdeletetime"].value = args[0];
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
      msg.channel.sendMessage("Minimum limit deletion time set to " + settings["minmsgdeletetime"].value + " milliseconds!");
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "deletebannedmsgstime"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (permsUsersList[msg.author.id].isAdmin == true)){
      if (!args){
        msg.channel.sendMessage(settings["deletebannedmsgstime"].value + "ms");
        return;
      }
      if (isNaN(args[0])){
        msg.channel.sendMessage(settings["deletebannedmsgstime"].value + "ms");
        return;
      }
      settings["deletebannedmsgstime"].value = args[0];
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
      msg.channel.sendMessage("Banned message deletion time set to " + settings["deletebannedmsgstime"].value + " milliseconds!");
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "minmsglength"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (permsUsersList[msg.author.id].isAdmin == true)){
      if (!args){
        msg.channel.sendMessage(settings["minmsglength"].value + " characters");
        return;
      }
      if (isNaN(args[0])){
        msg.channel.sendMessage(settings["minmsglength"].value + " characters");
        return;
      }
      settings["minmsglength"].value = args[0];
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
      msg.channel.sendMessage("Minimum message length set to " + settings["minmsglength"].value + " characters!");
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  /*LEGACY -- USE CUSTMSG INSTEAD!
  else if (command == "shippingmsg"){
    if ((msg.author.id == "197592250354499584") || (msg.author.id == "223811504833691648")){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        settings["shippingmsg"].value = false;
        msg.channel.sendMessage("Disabled shipping warning!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        settings["shippingmsg"].value = true;
        msg.channel.sendMessage("Enabled shipping warning!");
      }else{
        msg.channel.sendMessage("`Usage: [p]shippingmsg [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "nokissingmsg"){
    if ((msg.author.id == "197592250354499584") || (msg.author.id == "223811504833691648")){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        settings["nokissingmsg"].value = false;
        msg.channel.sendMessage("Disabled kissing warning!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        settings["nokissingmsg"].value = true;
        msg.channel.sendMessage("Enabled kissing warning!");
      }else{
        msg.channel.sendMessage("`Usage: [p]nokissingmsg [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }
  */

  else if (command == "custmsg"){
    if ((msg.author.id == "197592250354499584") || (msg.author.id == "223811504833691648")){
      if (!msg.mentions.users.first()){
        msg.channel.sendMessage("`Usage: [p]custmsg [enable/disable] @mention`");
        return;
      }
      if (!custmsgs[msg.mentions.users.first().id]){
        msg.channel.sendMessage("User does not have a custom message!");
        return;
      }
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        custmsgs[msg.mentions.users.first().id].toggle = false;
        msg.channel.sendMessage("Disabled custom message for " + msg.mentions.users.first() + "!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        custmsgs[msg.mentions.users.first().id].toggle = true;
        msg.channel.sendMessage("Enabled custom message for " + msg.mentions.users.first() + "!");
      }else{
        msg.channel.sendMessage("`Usage: [p]custmsg [enable/disable] @mention`");
        return;
      }
      fs.writeFile('./custmsgs.json', JSON.stringify(custmsgs), console.error);
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "showcustmsg"){
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]showcustmsg @mention`");
      return;
    }
    if (!custmsgs[msg.mentions.users.first().id]){
      msg.channel.sendMessage("User does not have a custom message!");
      return;
    }
    msg.channel.sendMessage(bot.users.get(msg.mentions.users.first().id) + "'s custom message is: " + bot.users.get(msg.mentions.users.first().id) + ", " + custmsgs[msg.mentions.users.first().id].text + '\n' + "Message toggle is currently " + custmsgs[msg.mentions.users.first().id].toggle + "!");
    commandUsed = true;
  }

  else if (command == "addcustmsg"){
    if ((msg.author.id == "197592250354499584") || (msg.author.id == "223811504833691648")){
      if (!args[0]){
        msg.channel.sendMessage("`Usage: [p]addcustmsg [userid or @mention] [custom message]`");
        return;
      }
      if (msg.mentions.users.first()){
        let text = args.slice(1).toString().replace(/,/g, ' ');
        if (!custmsgs[msg.mentions.users.first().id]){
          custmsgs[msg.mentions.users.first().id] = {text: text, toggle: true};
          msg.channel.sendMessage("Message for " + bot.users.get(msg.mentions.users.first().id) + " set to: " + bot.users.get(msg.mentions.users.first().id) + ", " + text);
        }else{
          custmsgs[msg.mentions.users.first().id].text = text;
          msg.channel.sendMessage("Message for " + bot.users.get(msg.mentions.users.first().id) + " set to: " + bot.users.get(msg.mentions.users.first().id) + ", " +text + '\n' + "Message toggle is currently " + custmsgs[msg.mentions.users.first().id].toggle + "!");
        }
      }else if (!isNaN(args[0])){
        let text = args.slice(1).toString().replace(/,/g, ' ');
        if (!custmsgs[args[0]]){
          custmsgs[args[0]] = {text: text, toggle: true};
          msg.channel.sendMessage("Message for " + bot.users.get(args[0]) + " set to: " + bot.users.get(args[0]) + ", " + text);
        }else{
          custmsgs[args[0]].text = text;
          msg.channel.sendMessage("Message for " + bot.users.get(args[0]) + " set to: " + bot.users.get(args[0]) + ", " + text + '\n' + "Message toggle is currently " + custmsgs[args[0]].toggle + "!");
        }
      }else{
        msg.channel.sendMessage("`Usage: [p]addcustmsg [userid] [custom message]`");
        return;
      }
      fs.writeFile('./custmsgs.json', JSON.stringify(custmsgs), console.error);
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "delcustmsg"){
    if ((msg.author.id == "197592250354499584") || (msg.author.id == "223811504833691648")){
      if (!args[0]){
        msg.channel.sendMessage("`Usage: [p]delcustmsg [userid or @mention]`");
        return;
      }
      let targetUser;
      if (!isNaN(args[0])){
        targetUser = args[0];
        delete custmsgs[targetUser];
      }else if (msg.mentions.users.first()){
        targetUser = msg.mentions.users.first().id;
        delete custmsgs[targetUser];
      }else{
        msg.channel.sendMessage("`Usage: [p]delcustmsg [userid or @mention]`");
        return;
      }
      fs.writeFile('./custmsgs.json', JSON.stringify(custmsgs), console.error);
      msg.channel.sendMessage("Custom message for " + bot.users.get(targetUser) + " successfully deleted!");
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "latency"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (permsUsersList[msg.author.id].isAdmin == true)){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        settings["latency"].value = false;
        msg.channel.sendMessage("Disabled latency!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        settings["latency"].value = true;
        msg.channel.sendMessage("Enabled latency!");
      }else{
        msg.channel.sendMessage("`Usage: [p]latency [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "setgame"){
    if (msg.author.id != "197592250354499584"){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    let game = args.toString().replace(/,/g, ' ');
    bot.user.setGame(game);
    commandUsed = true;
  }

  else if (command == "thereisabug"){
    if(!args[0]){
      msg.channel.sendMessage("`Usage: [p]thereisabug [Description of bug...]`");
      return;
    }
    let text = "There is a bug!"
    let sender = msg.author.username;
    text = args.toString().replace(/,/g, ' ');
    bot.users.get("197592250354499584").sendMessage(bot.users.get("197592250354499584") + " There is a bug! " + text + " Reported by: " + sender + "!");
    msg.channel.sendMessage("Your bug report has been sent!");
    commandUsed = true;
  }

  else if (command == "suggestion"){
    if(!args[0]){
      msg.channel.sendMessage("`Usage: [p]suggestion [Description]`");
      return;
    }
    let text = "Suggestion!"
    let sender = msg.author.username;
    text = args.toString().replace(/,/g, ' ');
    bot.users.get("197592250354499584").sendMessage(bot.users.get("197592250354499584") + " Suggestion: " + text + " By: " + sender + "!");
    msg.channel.sendMessage("Your suggestion has been sent!");
    commandUsed = true;
  }

  else if (command == "serverreg"){
    let i = 0;
    while (servers[i.toString()]){
      if (servers[i].id == msg.guild.id){
        msg.channel.sendMessage("Server is already registered!");
        return;
      }
      i++;
    }
    servers[i] = {"name": msg.guild.name, "id": msg.guild.id};
    settings["numServers"].value++;
    fs.writeFile('./servers.json', JSON.stringify(servers), console.error);
    fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
    msg.channel.sendMessage("Server is now registered!");
  }
    
  else if (command == "prune"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (permsUsersList[msg.author.id].isAdmin != true)){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if (!args[0]){
      msg.channel.sendMessage("`Usage: [p]prune [number]`");
      return;
    }
    if (isNaN(parseInt(args[0]))){
      msg.channel.sendMessage("`Usage: [p]prune [number]`");
      return;
    }
    if (args[0] > 99){
      let numMsgs = parseInt(args[0]) + 1;
      while (numMsgs > 0){
        if (numMsgs > 99){
          msg.channel.bulkDelete(100).then(()=>{
            if (numMsgs == 0){
              msg.channel.sendMessage("Pruned ${args[0]} messages successfully!");
            }
          });;
          numMsgs -= 100;
        }else{
          msg.channel.bulkDelete(numMsgs).then(()=>{
            if (numMsgs == 0){
              msg.channel.sendMessage("Pruned ${args[0]} messages successfully!");
            }
          });
          numMsgs -= numMsgs;
        }
      }
    }else{
      msg.channel.bulkDelete(parseInt(args[0]) + 1).then(()=>{
         msg.channel.sendMessage("Pruned ${args[0]} messages successfully!");
      });
    }
  }
  //Bans

  else if (command == "timeban"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (permsUsersList[msg.author.id].isMod != true)){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    let targetUser = msg.mentions.users.first();
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]timeban [@mention]`");
      return;
    }
    if(!banned[targetUser.id]){
      banned[targetUser.id] = {timeban: true, permban: false};
    }else{
      banned[targetUser.id].timeban = true;
    }
    fs.writeFile('./banned.json', JSON.stringify(banned), console.error);
    msg.channel.sendMessage(targetUser + " has been time banned! Messages will be deleted after " + settings["deletebannedmsgstime"].value + "ms!");
    commandUsed = true;
  }

  else if (command == "untimeban"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (permsUsersList[msg.author.id].isMod != true)){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    let targetUser = msg.mentions.users.first();
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]untimeban [@mention]`");
      return;
    }
    if (!banned[targetUser.id]){
      msg.channel.sendMessage(targetUser + " does not currently have a ban!");
      return;
    }
    if(banned[targetUser.id]){
      if (!banned[targetUser.id].timeban){
        msg.channel.sendMessage(targetUser + " does not currently have a time ban!");
        return;
      }
      banned[targetUser.id].timeban = false;
      if (banned[targetUser.id].timeban == false && banned[targetUser.id].permban == false){
        delete banned[targetUser.id];
      }
      fs.writeFile('./banned.json', JSON.stringify(banned), console.error);
      msg.channel.sendMessage(targetUser + " is no longer time banned!");
    }
    commandUsed = true;
  }

  else if (command == "permban"){
    if (msg.author.id != "197592250354499584" && (msg.author.id != "223811504833691648")){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if (!msg.mentions.users.first() && isNaN(args[0])){
      msg.channel.sendMessage("`Usage: [p]permban [@mention or user ID]`");
      return;
    }
    let targetUser;
    if (!isNaN(args[0])){
      targetUser = args[0];
    }
    if (msg.mentions.users.first()){
      targetUser = msg.mentions.users.first().id;
    }
    if (targetUser == "197592250354499584" || (targetUser == "223811504833691648")){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    bot.user.fetchProfile(targetUser);
    if(!banned[targetUser]){
      if (targetUser){
        banned[targetUser] = {timeban: false, permban: true};
      }else{
        banned[args[0]] = {timeban: false, permban: true};
      }
    }else{
      if (targetUser){
        banned[targetUser].permban = true;
      }else{
        banned[args[0]].permban = true;
      }
    }
    fs.writeFile('./banned.json', JSON.stringify(banned), console.error);
    msg.channel.sendMessage(targetUser + " has been permanently banned!");
    let serverid = 0;
    let servername = "";
    let allServers = [];
    bot.guilds.forEach((guild) => {allServers.push(guild);});
    for (let i = 0; i < allServers.length; i++){
      let x = i.toString();
      if (bot.guilds.get(allServers[x].id)){
      if (bot.guilds.get(allServers[x].id).members.get(targetUser.toString())){
        serverid = servers[x].id;
        servername = servers[x].name;
        if (!bot.guilds.get(serverid).members.get(bot.user.id).hasPermission("KICK_MEMBERS")){
          msg.channel.sendMessage(bot.guilds.get(serverid).members.get(targetUser.toString()) + " (" + targetUser + ")" + " cannot be kicked from " + servername + " (" + serverid + ")!");
          continue;
        }
        bot.guilds.get(serverid).members.get(targetUser.toString()).kick().catch(function(err){console.log(err);});
        msg.channel.sendMessage(bot.guilds.get(serverid).members.get(targetUser.toString()) + " (" + targetUser + ")" + " has been kicked from " + servername + " (" + serverid + ")!");
      }
    }
    }
    commandUsed = true;
  }

  else if (command == "unpermban"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if (msg.author.id != "197592250354499584"){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    let targetUser = args[0];
    if (isNaN(targetUser)){
      msg.channel.sendMessage("`Usage: [p]permban [userid]`");
      return;
    }
    if (!banned[targetUser]){
      msg.channel.sendMessage(targetUser + " does not currently have a ban!");
      return;
    }
    if(banned[targetUser]){
      if (!banned[targetUser].permban){
        msg.channel.sendMessage(targetUser + " does not currently have a permanent ban!");
        return;
      }
      banned[targetUser].permban = false;
      if (banned[targetUser].timeban == false && banned[targetUser].permban == false){
        delete banned[targetUser];
      }
      fs.writeFile('./banned.json', JSON.stringify(banned), console.error);
      msg.channel.sendMessage(targetUser + " is no longer permanently banned!");
    }
    commandUsed = true;
  }

  else if (command == "tempban"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (permsUsersList[msg.author.id].isMod != true)){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    let targetUser = msg.mentions.users.first();
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]tempban [ms] @mention`");
      return;
    }
    if (isNaN(args[0])){
      msg.channel.sendMessage("`Usage: [p]tempban [ms] @mention`");
      return;
    }
    if(!tempBanned[targetUser.id]){
      tempBanned[targetUser.id] = {tempban: args[0]};
    }else{
      tempBanned[targetUser.id].tempban = args[0];
    }
    setTimeout(function(){
      if (tempBanned[targetUser.id]){
        delete tempBanned[targetUser.id];
        fs.writeFile('./tempBanned.json', JSON.stringify(tempBanned), console.error);
      }
    }, args[0]);
    fs.writeFile('./tempBanned.json', JSON.stringify(tempBanned), console.error);
    msg.channel.sendMessage(targetUser + " has been temporarily banned for " + args[0] + "ms!");
    commandUsed = true;
  }

  else if (command == "untempban"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (permsUsersList[msg.author.id].isMod != true)){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    let targetUser = msg.mentions.users.first();
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]tempban @mention`");
      return;
    }
    if (!tempBanned[targetUser.id]){
      msg.channel.sendMessage(targetUser + " does not currently have a temporary ban!");
      return;
    }
    if(tempBanned[targetUser.id]){
      if (!tempBanned[targetUser.id].tempban){
        msg.channel.sendMessage(targetUser + " does not currently have a temporary ban!");
        return;
      }
      delete tempBanned[targetUser.id];
      fs.writeFile('./tempBanned.json', JSON.stringify(tempBanned), console.error);
      msg.channel.sendMessage(targetUser + " is no longer temporarily banned!");
    }
    commandUsed = true;
  }

  //Bot perms

  else if (command == "addptsmod"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]addptsmod @mention`");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (permsUsersList[msg.author.id].isAdmin == true)){
      let targetUser = msg.mentions.users.first();
      if (!permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')]){
        permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')] = {isAdmin: false, isMod: true};
        fs.writeFile('./permsUsersList.json', JSON.stringify(permsUsersList), console.error);
        msg.channel.sendMessage(targetUser + " can now access bot mod commands!");
      }else if (permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isMod == true){
        msg.channel.sendMessage(targetUser + " already has access to bot mod commands!");
      }else{
        permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isMod = true;
        fs.writeFile('./permsUsersList.json', JSON.stringify(permsUsersList), console.error);
        msg.channel.sendMessage(targetUser + " can now access bot mod commands!");
      }
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "delptsmod"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]delptsmod @mention`");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (permsUsersList[msg.author.id].isAdmin == true)){
      let targetUser = msg.mentions.users.first();
      if (!permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')]){
        msg.channel.sendMessage(targetUser + " does not have bot mod command access!");
      }else if (permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isAdmin == true){
        msg.channel.sendMessage(targetUser + " is a bot admin!");
      }else if (permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isMod == true){
        delete permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')]
        msg.channel.sendMessage(targetUser + " no longer has access to bot mod commands!");
      }else{
        msg.channel.sendMessage("Error!");
      }
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "addptsadmin"){
    if (msg.author.id == "197592250354499584"){
      let targetUser = msg.mentions.users.first();
      if (!msg.mentions.users.first()){
        msg.channel.sendMessage("`Usage: [p]addptsadmin @mention`");
        return;
      }
      if (!permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')]){
        permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')] = {isAdmin: true, isMod: true};
        fs.writeFile('./permsUsersList.json', JSON.stringify(permsUsersList), console.error);
        msg.channel.sendMessage(targetUser + " can now access bot admin commands!");
      }else if (permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isAdmin == true){
        msg.channel.sendMessage(targetUser + " already has access to bot admin commands!");
      }else{
        permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isAdmin = true;
        permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isMod = true;
        fs.writeFile('./permsUsersList.json', JSON.stringify(permsUsersList), console.error);
        msg.channel.sendMessage(targetUser + " can now access bot admin commands!");
      }
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "delptsadmin"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]delptsmod @mention`");
      return;
    }
    if (msg.author.id == "197592250354499584"){
      let targetUser = msg.mentions.users.first();
      if (!permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')]){
        msg.channel.sendMessage(targetUser + " does not have bot admin command access!");
      }
      else if (permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isAdmin == true){
        permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isAdmin = false;
        msg.channel.sendMessage(targetUser + " no longer has access to bot mod commands! Bot mod access is still retained!");
      }else{
        msg.channel.sendMessage("Error!");
      }
    }else{
      msg.channel.sendMessage("Insufficient permissions!");
    }
    commandUsed = true;
  }

  //Points stuff

  else if (command == "ptsreg"){
    let targetUser = msg.mentions.users.first().id;
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]ptsreg @mention`");
      return;
    }
    let i = 0;
    if(!regUsers[targetUser]){
      regUsers[targetUser] = {points: 0, quests: 0, civilWars: 0, banStatus: false};
      fs.writeFile('./regUsers.json', JSON.stringify(regUsers), console.error);
      while (userList[i.toString()]){
        i++;
      }
      userList[i.toString()] = targetUser;
      settings["numUsers"].value = i + 1;
      fs.writeFile('./userList.json', JSON.stringify(userList), console.error);
      fs.writeFile('./settings.json', JSON.stringify(settings), console.error);
      msg.channel.sendMessage(bot.users.get(targetUser) + " has been registered to the quest system!");
    }else{
      msg.channel.sendMessage(bot.users.get(targetUser) + " is already registered to the quest system!");
    }
    commandUsed = true;
  }

  else if (command == "ptscalc"){
    if (isNaN(args[0])){
      msg.channel.sendMessage("`Usage: [p]ptscalc score`");
      return;
    }
    if (args[0] < 50000){
      msg.channel.sendMessage(args[0] + " diep.io score is " + 0 + " points!");
      return;
    }
    msg.channel.sendMessage(args[0] + " diep.io score is " + Math.ceil(Math.pow(args[0], 1.1) / 100000) + " points!");
    commandUsed = true;
  }

  else if (command == "ptsadd"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient Permissions!");
      return;
    }
    if (permsUsersList[msg.author.id].isMod == true){
      let targetUser = msg.mentions.users.first().id;
      if (!msg.mentions.users.first()){
        msg.channel.sendMessage("`Usage: [p]ptsadd [number] @mention`");
        return;
      }
      if ((settings["selfpts"].toggle == false) && (targetUser == msg.author.id)){
        msg.channel.sendMessage("Self points are currently disabled!");
        return;
      }
      let points = parseFloat(args[0]);
      if (isNaN(points)){
        msg.channel.sendMessage("Error! Make sure first argument is point value!");
        return;
      }
      if (!regUsers[targetUser]){
        msg.channel.sendMessage("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
      }else{
        let currentPoints = parseFloat(regUsers[targetUser].points.toString());
        currentPoints += points;
        regUsers[targetUser.toString()].points = currentPoints;
        fs.writeFile('./regUsers.json', JSON.stringify(regUsers), console.error);
        msg.channel.sendMessage(bot.users.get(targetUser) + " gained " + points + " points! " + "Total: " + currentPoints + " points!");
        let rolesToAdd = [];
        let rolesToDelete = [];
        if (!pointRoles[msg.guild.id]){
          return;
        }
        bot.guilds.get(msg.guild.id).fetchMember(targetUser);
        let roleTarget = msg.guild.members.get(msg.mentions.users.first().id);
        for (let i = 0; pointRoles[msg.guild.id][i.toString()]; i++){
          if (pointRoles[msg.guild.id][i.toString()]){
            if (!roleTarget.roles.has(pointRoles[msg.guild.id][i.toString()].roleid)){
              if (regUsers[targetUser].points >= pointRoles[msg.guild.id][i.toString()].points){
                rolesToAdd.push(msg.guild.roles.get(pointRoles[msg.guild.id][i.toString()].roleid.toString()));
              }
              if (regUsers[targetUser].points < pointRoles[msg.guild.id][i.toString()].points){
                rolesToDelete.push(pointRoles[msg.guild.id][i.toString()].roleid.toString());
              }
            }
          }
        }
        setTimeout(function(){msg.guild.members.get(targetUser).addRoles(rolesToAdd);}, 250);
        setTimeout(function(){msg.guild.members.get(targetUser).removeRoles(rolesToDelete);}, 250);
        _rolesToAdd = rolesToAdd;
        _rolesToDelete = rolesToDelete;
        while (_rolesToAdd[0]){
          //roleTarget.addRole(rolesToAdd[0]);
          msg.channel.sendMessage("Added role " + _rolesToAdd[0] + " to " + bot.users.get(targetUser) + "!");
          _rolesToAdd = _rolesToAdd.slice(1);
        }
        while (_rolesToDelete[0]){
          //roleTarget.removeRole(rolesToDelete[0]);
          msg.channel.sendMessage("Deleted role " + _rolesToDelete[0] + " from " + bot.users.get(targetUser) + "!");
          _rolesToDelete = _rolesToDelete.slice(1);
        }
        }
      }else{
        msg.channel.sendMessage("Insufficient Permissions!");
      }
      commandUsed = true;
  }

  else if (command == "questsadd"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient Permissions!");
      return;
    }
    if (permsUsersList[msg.author.id].isMod == true){
      let targetUser = msg.mentions.users.first().id;
      if (!msg.mentions.users.first()){
        msg.channel.sendMessage("`Usage: [p]questsadd [number] @mention`");
        return;
      }
      if ((settings["selfpts"].toggle == false) && (targetUser == msg.author.id)){
        msg.channel.sendMessage("Self points are currently disabled!");
        return;
      }
      let quests = parseFloat(args[0]);
      if (isNaN(quests)){
        msg.channel.sendMessage("Error! Make sure first argument is quest value!");
        return;
      }
      if (!regUsers[targetUser]){
        msg.channel.sendMessage("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
      }else{
        let currentQuests = parseFloat(regUsers[targetUser].quests.toString());
        currentQuests += quests;
        regUsers[targetUser].quests = currentQuests;
        fs.writeFile('./regUsers.json', JSON.stringify(regUsers), console.error);
        msg.channel.sendMessage(bot.users.get(targetUser) + " gained " + quests + " quests! " + "Total: " + currentQuests + " quests!");
        }
      }else{
        msg.channel.sendMessage("Insufficient Permissions!");
      }
      commandUsed = true;
  }

  else if (command == "civilwarsadd"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient Permissions!");
      return;
    }
    if (permsUsersList[msg.author.id].isMod == true){
      let targetUser = msg.mentions.users.first().id;
      if (!msg.mentions.users.first()){
        msg.channel.sendMessage("`Usage: [p]civilwarsadd [number] @mention`");
        return;
      }
      if ((settings["selfpts"].toggle == false) && (targetUser == msg.author.id)){
        msg.channel.sendMessage("Self points are currently disabled!");
        return;
      }
      let civilWars = parseFloat(args[0]);
      if (isNaN(civilWars)){
        msg.channel.sendMessage("Error! Make sure first argument is civil war value!");
        return;
      }
      if (!regUsers[targetUser]){
        msg.channel.sendMessage("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
      }else{
        let currentCivilWars = parseFloat(regUsers[targetUser].civilWars.toString());
        currentCivilWars += civilWars;
        regUsers[targetUser].civilWars = currentCivilWars;
        fs.writeFile('./regUsers.json', JSON.stringify(regUsers), console.error);
        msg.channel.sendMessage(bot.users.get(targetUser) + " gained " + civilWars + " civil wars! " + "Total: " + currentCivilWars + " civil wars!");
        }
      }else{
        msg.channel.sendMessage("Insufficient Permissions!");
      }
      commandUsed = true;
  }

  else if (command == "points"){
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]points @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    if (!regUsers[targetUser]){
      msg.channel.sendMessage("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
    }
    msg.channel.sendMessage(bot.users.get(targetUser) + " has " + regUsers[targetUser].points + " points!");
    commandUsed = true;
  }

  else if (command == "quests"){
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]quests @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    if (!regUsers[targetUser]){
      msg.channel.sendMessage("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
    }
    msg.channel.sendMessage(bot.users.get(targetUser) + " has " + regUsers[targetUser].quests + " quests!");
    commandUsed = true;
  }

  else if (command == "civilwars"){
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]civilwars @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    if (!regUsers[targetUser]){
      msg.channel.sendMessage("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
    }
    msg.channel.sendMessage(bot.users.get(targetUser) + " has " + regUsers[targetUser].civilWars + " civil wars!");
    commandUsed = true;
  }

  //Auto-roles

  else if (command == "addptrole"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient Permissions!");
      return;
    }
    if (permsUsersList[msg.author.id].isAdmin != true){
      msg.channel.sendMessage("Insufficient Permissions!");
      return;
    }
    let numPoints = args[0];
    if (!args[0]){
      msg.channel.sendMessage("`Usage: [p]addptrole [number of points] [role]`");
      return;
    }
    let roleName = args.slice(1).toString().replace(/,/g, ' ')
    if (!msg.guild.roles.find("name", roleName.toString())){
      msg.channel.sendMessage("`Usage: [p]addptrole [number of points] [role]`");
      return;
    }
    targetRole = msg.guild.roles.find("name", roleName).id;
    if (!pointRoles[msg.guild.id]){
      pointRoles[msg.guild.id] = {"0": {roleid: targetRole, points: numPoints}};
      fs.writeFile('./pointRoles.json', JSON.stringify(pointRoles), console.error);
      let added = [];
      for (let j = 0; j < settings["numUsers"].value; j++){
        let got = msg.guild.members.get(userList[j.toString()].id);
        if (got){
          if (regUsers[userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.sendMessage("Added role " + msg.guild.roles.get(targetRole) + " to: " + added + "!");
    }else{
      let i = 0;
      while (pointRoles[msg.guild.id][i.toString()]){
        if (pointRoles[msg.guild.id][i.toString()]){
          if (pointRoles[msg.guild.id][i.toString()].roleid == targetRole){
            msg.channel.sendMessage("This role is already an autorole!");
            return;
          }
        }
        i++;
        if (i > 14){
          msg.channel.sendMessage("There cannot be more than 15 point roles per server!");
          return;
        }
      }
      pointRoles[msg.guild.id][i.toString()] = {roleid: targetRole, points: numPoints};
      fs.writeFile('./pointRoles.json', JSON.stringify(pointRoles), console.error);
      let added = [];
      for (let j = 0; j < settings["numUsers"].value; j++){
        let got = msg.guild.members.get(userList[j.toString()].id);
        if (got){
          if (regUsers[userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.sendMessage("Added role " + msg.guild.roles.get(targetRole.toString()) + " to: " + added + "!");
    }
    commandUsed = true;
  }

  else if (command == "addquestrole"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient Permissions!");
      return;
    }
    if (permsUsersList[msg.author.id].isAdmin != true){
      msg.channel.sendMessage("Insufficient Permissions!");
      return;
    }
    let numPoints = args[0];
    if (!args[0]){
      msg.channel.sendMessage("`Usage: [p]addquestrole [number of quests] [role]`");
      return;
    }
    let roleName = args.slice(1).toString().replace(/,/g, ' ')
    if (!msg.guild.roles.find("name", roleName.toString())){
      msg.channel.sendMessage("`Usage: [p]addquestrole [number of quests] [role]`");
      return;
    }
    targetRole = msg.guild.roles.find("name", roleName).id;
    if (!questRoles[msg.guild.id]){
      questRoles[msg.guild.id] = {"0": {roleid: targetRole, quests: numPoints}};
      fs.writeFile('./questRoles.json', JSON.stringify(questRoles), console.error);
      let added = [];
      for (let j = 0; j < settings["numUsers"].value; j++){
        let got = msg.guild.members.get(userList[j.toString()].id);
        if (got){
          if (regUsers[userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.sendMessage("Added role " + msg.guild.roles.get(targetRole) + " to: " + added + "!");
    }else{
      let i = 0;
      while (questRoles[msg.guild.id][i.toString()]){
        if (questRoles[msg.guild.id][i.toString()]){
          if (questRoles[msg.guild.id][i.toString()].roleid == targetRole){
            msg.channel.sendMessage("This role is already an autorole!");
            return;
          }
        }
        i++;
        if (i > 14){
          msg.channel.sendMessage("There cannot be more than 15 quest roles per server!");
          return;
        }
      }
      questRoles[msg.guild.id][i.toString()] = {roleid: targetRole, quests: numPoints};
      fs.writeFile('./questRoles.json', JSON.stringify(questRoles), console.error);
      let added = [];
      for (let j = 0; j < settings["numUsers"].value; j++){
        let got = msg.guild.members.get(userList[j.toString()].id);
        if (got){
          if (regUsers[userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.sendMessage("Added role " + msg.guild.roles.get(targetRole.toString()) + " to: " + added + "!");
    }
    commandUsed = true;
  }

  else if (command == "addcivilwarrole"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient Permissions!");
      return;
    }
    if (permsUsersList[msg.author.id].isAdmin != true){
      msg.channel.sendMessage("Insufficient Permissions!");
      return;
    }
    let numPoints = args[0];
    if (!args[0]){
      msg.channel.sendMessage("`Usage: [p]addcivilwarrole [number of civil warss] [role]`");
      return;
    }
    let roleName = args.slice(1).toString().replace(/,/g, ' ')
    if (!msg.guild.roles.find("name", roleName.toString())){
      msg.channel.sendMessage("`Usage: [p]addcivilwarrole [number of civil wars] [role]`");
      return;
    }
    targetRole = msg.guild.roles.find("name", roleName).id;
    if (!civilWarRoles[msg.guild.id]){
      civilWarRoles[msg.guild.id] = {"0": {roleid: targetRole, civilwars: numPoints}};
      fs.writeFile('./civilWarRoles.json', JSON.stringify(civilWarRoles), console.error);
      let added = [];
      for (let j = 0; j < settings["numUsers"].value; j++){
        let got = msg.guild.members.get(userList[j.toString()].id);
        if (got){
          if (regUsers[userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.sendMessage("Added role " + msg.guild.roles.get(targetRole) + " to: " + added + "!");
    }else{
      let i = 0;
      while (questRoles[msg.guild.id][i.toString()]){
        if (questRoles[msg.guild.id][i.toString()]){
          if (questRoles[msg.guild.id][i.toString()].roleid == targetRole){
            msg.channel.sendMessage("This role is already an autorole!");
            return;
          }
        }
        i++;
        if (i > 14){
          msg.channel.sendMessage("There cannot be more than 15 civil war roles per server!");
          return;
        }
      }
      civilWarRoles[msg.guild.id][i.toString()] = {roleid: targetRole, civilwars: numPoints};
      fs.writeFile('./civilWarRoles.json', JSON.stringify(civilWarRoles), console.error);
      let added = [];
      for (let j = 0; j < settings["numUsers"].value; j++){
        let got = msg.guild.members.get(userList[j.toString()].id);
        if (got){
          if (regUsers[userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.sendMessage("Added role " + msg.guild.roles.get(targetRole.toString()) + " to: " + added + "!");
    }
    commandUsed = true;
  }

  //Anti-raid protection

  /*else if (command == "idraider"){
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]idraider @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    for (let i = 0; i < settings["numUsers"].value; i++){
      if (permsUsersList[userList[i.toString()].id]){
        if(!bot.user.fetchProfile(msg.mentions.first().id)){
          return;
        }
        bot.users.get(userList[i.toString()].id).sendMessage(bot.users.get(userList[i.toString()].id) + " ID of raider: " + targetUser + "! Username: " + msg.mentions.users.first().username + "!");
      }
    }
    msg.channel.sendMessage("Raider identified as: " + targetUser + "! Staff has been notified!");
    commandUsed = true;
  }*/

  //Anti-raid protection

  else if (command == "idraider"){
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]idraider @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    for (let i = 0; i < settings["numUsers"].value; i++){
      if (permsUsersList[userList[i.toString()].id]){
        bot.users.get(userList[i.toString()].id).sendMessage(bot.users.get(userList[i.toString()].id) + " ID of raider: " + targetUser + "! Username: " + msg.mentions.users.first().username + "!");
      }
    }
    msg.channel.sendMessage("Raider identified as: " + targetUser + "! Staff has been notified!");
    commandUsed = true;
  }

  else if (command == "userid"){
    if (!msg.mentions.users.first()){
      msg.channel.sendMessage("`Usage: [p]userid @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    msg.channel.sendMessage("User ID of " + msg.mentions.users.first() + ": "+ targetUser);
    commandUsed = true;
  }

  else if (command == "globalkick"){
    if (!permsUsersList[msg.author.id]){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (permsUsersList[msg.author.id].isAdmin != true)){
      msg.channel.sendMessage("Insufficient permissions!");
      return;
    }
    if (!args[0]){
      msg.channel.sendMessage("`Usage: [p]globalkick [userID or @mention]`");
      return;
    }
    if (msg.mentions.users.first()){
      args[0] = msg.mentions.users.first().id;
    }
    bot.user.fetchProfile(args[0]);
    let targetUser = args[0];
    if (targetUser == "197592250354499584"){
      msg.channel.sendMessage("Insufficient permissions! You cannot kick bot owner!");
      return;
    }
    if (isNaN(parseInt(targetUser))){
      msg.channel.sendMessage("Make sure the argument is a user ID!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (permsUsersList[args[0]])){
        if (permsUsersList[args[0]].isAdmin == true){
        msg.channel.sendMessage("Insufficient permissions!");
        return;
      }
    }
    let serverid = 0;
    let servername = "";
    let allServers = [];
    bot.guilds.forEach((guild) => {allServers.push(guild);});
    for (let i = 0; i < allServers.length; i++){
      let x = i.toString();
      if (bot.guilds.get(allServers[x].id)){
      if (bot.guilds.get(allServers[x].id).members.get(targetUser.toString())){
        serverid = allServers[x].id;
        servername = allServers[x].name;
        if (!bot.guilds.get(allServers[x].id).members.get(bot.user.id).hasPermission("KICK_MEMBERS")){
          msg.channel.sendMessage(bot.guilds.get(serverid).members.get(targetUser.toString()) + " (" + targetUser + ")" + " cannot be kicked from " + servername + " (" + serverid + ")!");
          continue;
        }
        bot.guilds.get(serverid).members.get(targetUser.toString()).kick().catch(function(err){console.log(err);});
        msg.channel.sendMessage(bot.guilds.get(serverid).members.get(targetUser.toString()) + " (" + targetUser + ")" + " has been kicked from " + servername + " (" + serverid + ")!");
      }
    }
    }
    commandUsed = true;
  }

  //Bot status functions

  else if (command == "uptime"){
    msg.channel.sendMessage("Uptime: " + process.uptime()*1000 + "ms");
    commandUsed = true;
  }

  else if (command == "numregusers"){
    msg.channel.sendMessage("There are " + settings["numUsers"].value + " people registered to the quest system!");
    commandUsed = true;
  }

  else if (command == "numregservers"){
    msg.channel.sendMessage("Cup of Java is running on " + settings["numServers"].value + " servers!");
  }

  //Bot control functions

  else if ((command == "botdisable") && (msg.author.id === "197592250354499584")){
    botEnable = false;
    msg.channel.sendMessage("Bot disabled!");
    commandUsed = true;
  }

  else if ((command == "botrestart") && (msg.author.id === "197592250354499584")){
    msg.channel.sendMessage("Restarting!").then(() => {
      bot.user.setStatus('dnd').then(() => {
          process.exit("Restart");
        });
      });
  }

  else if ((command == "botshutdown") && (msg.author.id === "197592250354499584")){
    msg.channel.sendMessage("Shutting down!").then(() => {
      bot.user.setStatus('dnd').then(() => {
          process.exit(0);
      });
    });
  }

  else if (command == "help"){
    if (args[0] == "DM"){
      bot.users.get(msg.author.id).sendMessage("**[p] is prefix**" + '\n\n' +
      "**Bot Owner Only:**" + '\n' +
  "[p]setprefix [newprefix]: Sets new prefix for the bot.\n"+
  "[p]setgame [newgame]: Sets bot's game.\n"+
  "[p]permban [@mention or userid]: Kicks and permanently bans the user out of all servers running this bot.\n"+
  "[p]unpermban [userid]: Allows user to join again.\n"+
  "[p]addptsadmin [@mention]: Allows user to access bot admin commands.\n"+
  "[p]delptsadmin [@mention]: Prohibits user from accessing bot admin commands.\n"+
  "[p]botenable: Enables bot.\n"+
  "[p]botdisable: Disables bot.\n"+
  "[p]botshutdown: Shuts down bot.\n"+
  "[p]botrestart: Restarts bot. (Requires bot to be running from pm2)\n"+
  "**Bot Admin Only:**\n"+
  "[p]prune [number]: Deletes a number of messages from the channel.\n"+                                             
  "[p]selfpts [enable/disable]: Sets whether mods can add their own points.\n"+
  "[p]tempmemes [enable/disable]: Sets whether meme commands are temporary.\n"+
  "[p]tempmemestime [ms]: Sets the time that temporary memes last.\n"+
  "[p]minmsglength [number]: Sets the minimum message length in characters.\n"+
  "[p]minmsgdeletetime [ms]: Sets the time before messages shorter than the limit are deleted.\n"+
  "[p]deletebannedmsgs [enable/disable]: Sets whether tempbanned and timebanned messages delete.\n"+
  "[p]deletebannedmsgstime [ms]: Sets the time until tempbanned and timebanned messages delete.\n"+
  "[p]latency [enable/disable]: Sets whether latency appears after each command.\n"+
  "[p]addptsmod [@mention]: Allows user to access bot mod commands.\n"+
  "[p]delptsmod [@mention]: Prohibits user from accessing bot mod commands.\n"+
  "[p]globalkick [userid or @mention]: Kicks user out of all servers running this bot.\n").then((sent1) => {
    bot.users.get(msg.author.id).sendMessage("**Bot Mod Only:**\n"+
  "[p]ptsadd [number] [@mention]: Adds points to user.\n"+
  "[p]questsadd [number] [@mention]: Adds quests to user.\n"+
  "[p]civilwarsadd [number] [@mention]: Adds civil wars to user.\n"+
  "[p]timeban [@mention]: Auto deletes the user's messages after a time.\n"+
  "[p]untimeban [@mention]: Removes time ban from user.\n"+
  "[p]tempban [ms] [@mention]: Auto deletes the user's messages for a specified amount of time.\n"+
  "[p]untempban [@mention]: Remove a temporary ban from the user.\n"+
  "**Everyone:**\n"+
  "[p]ping: Returns the bot's latency.\n"+
  "[p]trump [optional argument]: Returns WE MUST BUILD A WALL without argument, Make [argument] great again! with argument.\n"+
  "[p]trumpmeme: Shows a trump meme.\n"+
  "[p]thereisabug [text]: Reports a bug.\n"+
  "[p]suggestion [text]: Give a suggestion for the bot.\n"+
  "[p]serverreg: Registers the server to the system.\n"+
  "[p]points [@mention]: Shows the user's points.\n"+
  "[p]quests [@mention]: Shows the user's quests.\n"+
  "[p]civilwars [@mention]: Shows the user's civil wars.\n"+
  "[p]idraider [@mention]: Notifies staff that the user is a raider. **ABUSE WILL RESULT IN A BAN!!!**\n"+
  "[p]userid [@mention]: Gives the user's ID.\n"+
  "[p]uptime: Gives the bot's uptime.\n"+
  "[p]numregusers: Gives the number of users registered to the system.\n"+
  "[p]numregservers: Gives the number of servers registered to the system.\n"+
  "[p]help [optional argument 'DM']: Shows this.\n"+
  "[p]nebulayt: Gives the link to our Nebula YouTube channel.\n"+
  "**[p]christmas: Limited edition command! Gives Christmas pictures!**");
  return;
});
  }else
    msg.channel.sendMessage("**[p] is prefix**" + '\n\n' +
    "**Bot Owner Only:**" + '\n' +
"[p]setprefix [newprefix]: Sets new prefix for the bot.\n"+
"[p]setgame [newgame]: Sets bot's game.\n"+
"[p]permban [@mention or userid]: Kicks and permanently bans the user out of all servers running this bot.\n"+
"[p]unpermban [userid]: Allows user to join again.\n"+
"[p]addptsadmin [@mention]: Allows user to access bot admin commands.\n"+
"[p]delptsadmin [@mention]: Prohibits user from accessing bot admin commands.\n"+
"[p]botenable: Enables bot.\n"+
"[p]botdisable: Disables bot.\n"+
"[p]botshutdown: Shuts down bot.\n"+
"[p]botrestart: Restarts bot. (Requires bot to be running from pm2)\n"+
"**Bot Admin Only:**\n"+
"[p]prune [number]: Deletes a number of messages from the channel.\n"+   
"[p]selfpts [enable/disable]: Sets whether mods can add their own points.\n"+
"[p]tempmemes [enable/disable]: Sets whether meme commands are temporary.\n"+
"[p]tempmemestime [ms]: Sets the time that temporary memes last.\n"+
"[p]minmsglength [number]: Sets the minimum message length in characters.\n"+
"[p]minmsgdeletetime [ms]: Sets the time before messages shorter than the limit are deleted.\n"+
"[p]deletebannedmsgs [enable/disable]: Sets whether tempbanned and timebanned messages delete.\n"+
"[p]deletebannedmsgstime [ms]: Sets the time until tempbanned and timebanned messages delete.\n"+
"[p]latency [enable/disable]: Sets whether latency appears after each command.\n"+
"[p]addptsmod [@mention]: Allows user to access bot mod commands.\n"+
"[p]delptsmod [@mention]: Prohibits user from accessing bot mod commands.\n"+
"[p]globalkick [userid or @mention]: Kicks user out of all servers running this bot.\n").then((sent1) => {
  msg.channel.sendMessage("**Bot Mod Only:**\n"+
"[p]ptsadd [number] [@mention]: Adds points to user.\n"+
"[p]questsadd [number] [@mention]: Adds quests to user.\n"+
"[p]civilwarsadd [number] [@mention]: Adds civil wars to user.\n"+
"[p]timeban [@mention]: Auto deletes the user's messages after a time.\n"+
"[p]untimeban [@mention]: Removes time ban from user.\n"+
"[p]tempban [ms] [@mention]: Auto deletes the user's messages for a specified amount of time.\n"+
"[p]untempban [@mention]: Remove a temporary ban from the user.\n"+
"**Everyone:**\n"+
"[p]ping: Returns the bot's latency.\n"+
"[p]trump [optional argument]: Returns WE MUST BUILD A WALL without argument, Make [argument] great again! with argument.\n"+
"[p]trumpmeme: Shows a trump meme.\n"+
"[p]thereisabug [text]: Reports a bug.\n"+
"[p]suggestion [text]: Give a suggestion for the bot.\n"+
"[p]serverreg: Registers the server to the system.\n"+
"[p]points [@mention]: Shows the user's points.\n"+
"[p]quests [@mention]: Shows the user's quests.\n"+
"[p]civilwars [@mention]: Shows the user's civil wars.\n"+
"[p]idraider [@mention]: Notifies staff that the user is a raider. **ABUSE WILL RESULT IN A BAN!!!**\n"+
"[p]userid [@mention]: Gives the user's ID.\n"+
"[p]uptime: Gives the bot's uptime.\n"+
"[p]numregusers: Gives the number of users registered to the system.\n"+
"[p]numregservers: Gives the number of servers registered to the system.\n"+
"[p]help [optional argument 'DM']: Shows this.\n"+
"[p]nebulayt: Gives the link to our Nebula YouTube channel.\n"+
"**[p]christmas: Limited edition command! Gives Christmas pictures!**").then((sent2) => {
  sent2.delete(30000);
});
sent1.delete(30000)
});
  }

  if (command == "botsetmode"){
    if (!msg.author.id == "197592250354499584"){
      msg.channel.sendMessage("Insufficient Permissions!");
      return;
    }
    if (args[1]){
      if (args[1].toLowerCase() == "--nickname"){
        if (args[0] == "Lillie"){
          msg.guild.members.get(bot.user.id).setNickname("Lillie");
          bot.user.setAvatar("https://miketendo64.files.wordpress.com/2016/06/1a.png?w=657&h=657");
          return;
        }
        if (args[0] == "CupOfJava"){
          msg.guild.members.get(bot.user.id).setNickname("Cup of Java");
          bot.user.setAvatar("http://cdn.onlyinyourstate.com/wp-content/uploads/2016/03/7417277818_24db95a92e_b-700x547.jpg");
          return;
        }
      }
      if (args[1].toLowerCase() == "--setusername"){
        if (args[0] == "Lillie"){
          bot.user.setUsername("Lillie");
          bot.user.setAvatar("https://miketendo64.files.wordpress.com/2016/06/1a.png?w=657&h=657");
          return;
        }
        if (args[0] == "CupOfJava"){
          bot.user.setUsername("Cup of Java");
          bot.user.setAvatar("http://cdn.onlyinyourstate.com/wp-content/uploads/2016/03/7417277818_24db95a92e_b-700x547.jpg");
          return;
        }
      }
    }else if (!args[1]){
      msg.channel.sendMessage("Use `--nickname or --setusername`!");
      return;
    }
    msg.channel.sendMessage("Mode does not exist!");
  }

  if (settings["latency"].value == true && commandUsed == true) {
    msg.channel.sendMessage("Latency:").then((sent) => {
      let t = sent.createdTimestamp - msg.createdTimestamp;
      sent.edit("Latency: " + t + "ms");
      sent.delete(5000);
    });
  }
  if (!msg.author.id === "197592250354499584"){
    msg.channel.sendMessage("Insufficient Permissions!");
    return;
  }
  else if(command == "eval" && msg.author.id === "197592250354499584") {
    try {
      var code = args.join(" ");
      var evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      msg.channel.sendCode("xl", evaled);
    } catch(err) {
      msg.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
  }
}
});

bot.login(process.env.TOKEN);
