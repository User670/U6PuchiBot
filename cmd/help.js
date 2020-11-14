exports.run = (client, message, args) => {
	var commands={
		"candy":{
			"type":"functional",
			"text":"Usage:\n`u!candy <currentLevel> <targetLevel> <XPtillNextLevel>` - Calculates how many candies you need to level up a neso to a desired level.\n`u!candy <currentLevel> <numCandy>C <XPtillNextLevel>` - Calculates what level you can reach with a certain number of candies. Note the 2nd parameter needs a letter C (case doesn't matter) after the number, eg. `20C`.\n\nAll parameters are optional (unless you want to use the 2nd mode). Default values are 1, 50 (targetLevel), 0 (the XP bar is empty)."
		},
		"dblookup":{
			"type":"functional",
			"text":"This is a complicated command; if you have trouble using it, feel free to ask User670#9501.\n\nUsage: ```\nu!dblookup list [pageNumber]\nu!dblookup <tableName> <rowIndex>\nu!dblookup <tableName> info\nu!dblookup <tableName> overview [startingRowIndex]\nu!dblookup <tableName> find <column> <value> [pageNumber]```Look up information in the database. Puchi and card active skills may have a \"binaryMap\" attribute; you can use the value in `u!binarymap` to get a visual of it."
		},
		"binarymap":{
			"type":"functional",
			"text":"Usage: `u!binarymap <binarymap>`"
		},
		"rate":{
			"type":"functional",
			"text":"Rate something from a scale of 0 thru 10, except the outcome is consistent with same inputs.\n\nUsage:\n`u!rate something you want to rate (can have space in the text)`\n`u!rate something $salt$ theNewSalt` - Add some salt to your input... in addition to the salt I already added. \*salt intensifies\*\n`u!rate something $scale$ <number>` - rate on a scale of 0 thru your number, rather than the default 0 thru 10. The number has to be an integer between 1 and 65535."
		},
		"ping":{
			"type":"debug",
			"text":"Do `u!ping`, and it should `Pong!` you back."
		},
		"debug":{
			"type":"debug",
			"text":"This command can only be used by User670#9501. Runs arbitrary code for debug purposes."
		},
		"triggers":{
			"type":"hidden",
			"text":"Currently active non-command triggers:\nmessages sent by \"iebot\" (499576711319650304) that includes substring `Event Tier List`, any server, any channel - message will be recorded and displayed on an external web page\nmessages that begin with `?say` or are equal to `?tag robot overlord`, any server, any channel -  responds in the channel of occurrence of such message.\nmessages that begin with `pigii` (case insensitive), server(s) U6Test and /r/Puchiguru, any channel - react to the message."
		}
	}
	
	
	
	
	
    var msg=message.author+"\n";
	if(typeof(args[0])!="undefined"){
		
		if(typeof(commands[args[0]])=="undefined"){
			msg+="Not a valid command. Type `u!help` for a list of commands.";
		}else{
			msg+=commands[args[0]]["text"];
		}
	}else{
		msg+="List of functional commands: `candy` `dblookup` `binarymap` `rate`\n\nList of debug commands: `ping` `debug`\n\nType `u!help [command]` for information on that command. Type `u!help triggers` for a list of active non-command triggers.";
	}
	message.channel.send(msg).catch(console.err);
	return;
}