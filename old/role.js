exports.run = (client, message, args) => {
const Discord = require("discord.js");
const roles = require("./../roles.json");
const roleinfo = require("./../roleinfo.json");
  
  
      if (roles.shortlist.includes(args[0])) { // check if role is shorthand: if yes then set to full name
        args[0] = roles.alias[args[0]];
      }
      if (roles.rolelist.includes(args[0])) { // check if role is in the rolelist
        
        let roleget = roleinfo[args[0]];
        
        if (roles.town.includes(args[0])) { // set embed color
          var embedcolor = '#32cd32';
          var rolegetgoal = 'Lynch every criminal and evil-doer.';
        } else if (roles.mafia.includes(args[0])) {
          var embedcolor = '#b22222';
          var rolegetgoal = 'Kill everyone who opposes the Mafia.';
        } else {
          var embedcolor = '#888888';
          var rolegetgoal = roleget.goal;
        }
        if (args[1] != null && roleget.sub.includes(args[1])) { // subtext display for second argument
          let sub = roleget.subtext[args[1]]; // defines "sub" as title (0) and content (1)
          
          const embed = new Discord.RichEmbed() // embed of subtext
          .setColor(embedcolor)
          .addField(sub[0], sub[1])
          message.channel.send({embed});
          
        } else {
          
          if (args[1] != null) { // unindentified subtext
          message.channel.send(":mag_right: *That subtext doesn't seem to exist.*")
          }
          
          const embed = new Discord.RichEmbed() // embed of main text
          .setColor(embedcolor)
          .addField("**" + roleget.name + "**", "*" + roleget.alignment + "*\n\n**Ability:** " + roleget.ability + "\n**Attribute:** " + roleget.attribute + "\n\n**Goal:** " + rolegetgoal)
          message.channel.send({embed});
          if (roleget.extra != null) {
            message.channel.send(roleget.extra);
          }
        }
      } else if (args[0] != null && args[0] != "help") {
          message.channel.send(":warning: That role doesn't seem to exist.");
      } else {
        message.channel.send("`.role` will instantly fetch basic information of a certain role. Shorthand names are permitted. Do not include spaces for roles whose names are 2 words or longer.\n\n**Usage:** `.role <role name>`\n**Alias:** `.r`");
      }
  
}