const Discord = require("discord.js");
const client = new Discord.Client();
const token = process.env.TOKEN;
let prefix = "u!";

var emoteTable={"419292147574112270":"501065145728892938",//PuchiCord
                "348452395967184897":"468949946872365056" //U6T (retro ruby neso emote :-/)
               }
var acceptableChannels=["463702006863757313", //U6T -> bot-commands
                        "419295845956059137"  //Puchicord -> bot-commands
                       ]


//client.on & other events
client.on("ready", () => {
  console.log("I am ready!");
});

function recordmessage(msg){
  console.log(encodeURIComponent(msg));
  
  if(msg.indexOf("Event Tier List")==-1){
    //this is probs not event tier list
    return;
  }
  
  var http = require('http');
	var querystring = require('querystring');
	var contents = querystring.stringify({
		puchi: msg
	});
	var options = {
		host: process.env.REQUEST_HOST,
		path: process.env.REQUEST_PATH+"?cutoff="+encodeURIComponent(msg),
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': contents.length
		}
	}
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(data) {
			//console.log("data:", data);
		});
  });
	req.write(contents);
	req.end;
}

client.on("message", (message) => { // split command message into base (cmd) and arguments (args) separated by space
  
  client.user.setActivity("No longer maintained | prefix u!")
  //console.log(message.channel.id);
  //console.log(encodeURIComponent(message.content));
  if(message.author.id=="499576711319650304"){
  //if(message.author.id=="329052785113038859"){
    //
    //
    recordmessage(message.content)
    return;
  }
  if (message.author.bot) return;
  if (message.content.indexOf("?say ")===0){
    message.channel.send(message.author.username+" triggered this `?say` command.")
    return;
  }
  if (message.content.toLowerCase().trim()==="?tag robot overlord"){
    message.channel.send(message.author.username+" triggered this `?tag robot overlord` command.")
    return;
  }
  if(message.content.toLowerCase().slice(0,5)==="pigii"){
    try{
      message.react(emoteTable[message.guild.id]).catch(function(){});
      
      // was 419297832424701974
      //message.react("468949946872365056").catch(function(){});
    }catch(err){}
    return;
  }
  
  
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  
  if (message.content.indexOf(prefix) !== 0) return;
  if(acceptableChannels.indexOf(message.channel.id)==-1){
    /*if(message.author.id=="329052785113038859"&&cmd=="debug"){
      void(0);
    }else{
      return;
    }*/
    return;
  }
  
  
  // command handler
  
   try {
    let cmdFile = require(`./cmd/${cmd}.js`);
    cmdFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
  
});

client.login(token);

//console.log(client.user)

var express = require('express');
var app = express();

app.get("/", function (request, response) {
  response.sendStatus(200);
});

app.get("/cutoff", function (request, response) {
  var cutoff=require("./tmp/cutoff.json");
  response.jsonp(cutoff);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});