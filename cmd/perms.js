//<@329052785113038859>
exports.run = (client, message, args) => {
    //message.channel.send(":ping_pong: Pong! " + message.author).catch(console.error);
	//console.log(args);
	var permss=require("../perms.json");
  var perms=JSON.parse(JSON.stringify(permss));
	var fs=require("fs");
	var msg=""+message.author+"\n";
	var isowner=false;
	var ismanager=false;
	
	function isping(m){
    console.log(m)
		if(m.slice(0,2)=="<@"&&m.slice(-1)==">"&&m.length<30){
			var n=m.slice(2,-1);
      if (n[0]=="!"){
        n=n.slice(1);
      }
			for(var i in n){
				if("1234567890".indexOf(n[i])==-1){
					return false;
				}
			}
			return n;
		}else{
			return false;
		}
	}
				
	
	//Does the message sender have "owner" or "manager" perm?
	var authorid=message.author.id;
	if(typeof(perms.userperms[authorid])!=="undefined"){
		var authorperms=perms.userperms[authorid];
		if(authorperms.indexOf("owner")!=-1){
			isowner=true;
		}
		if(authorperms.indexOf("manager")!=-1){
			ismanager=true;
		}
	}
	//if the sender doesn't have the either perm at all...
	if(!isowner && !ismanager){
		msg+="You need \"owner\" or \"manager\" perms to edit others' perms. In addition if you want to edit someone's \"manager\" perm, you need to have \"owner\" perm (which you can't have; it's exclusive).";
		message.channel.send(msg).catch(console.error);
		return;
	}
	//are args correct?
	if(args.length<2){
		msg+="You need 2 or 3 parameters: an action (add|remove|view), a ping, <a perm>.\n(kind reminder, you need owner or manager perm to edit others' perms)";
		message.channel.send(msg).catch(console.error);
		return;
	}
	if(args[0]=="add"||args[0]=="grant"){
		if(args.length<3){
			msg+="You need 3 parameters: an action (add), a ping, a perm.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		var ping=isping(args[1]);
		if(!ping){
			msg+="The 2nd param has to be a valid ping. Also, ping a user, not a role.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		if(perms.validperms.indexOf(args[2])==-1){
			msg+="The perm that you want to edit is not an accepted perm.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		if(args[2]=="manager"&&!isowner){
			msg+="You need owner perm (which you can't have) to edit manager perm.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		if(args[2]=="owner"){
			msg+="Owner perm cannot be edited by this command.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		
		if(typeof(perms.userperms[ping])==="undefined"){
			perms.userperms[ping]=[];
		}
		var userperms=perms.userperms[ping];
		if(userperms.indexOf(args[2])!=-1){
			msg+="This user already has this perm.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		
		perms.userperms[ping].push(args[2]);
		fs.writeFile("perms.json",JSON.stringify(perms),function(err,fd){
			if(err){
				console.log(err);
				msg+="An error occurred when saving this change. Bot author pinged: <@329052785113038859>";
				message.channel.send(msg).catch(console.error);
				return;
			}
			else {
				console.log("wrote into that file");
				msg+="Successfully granted <@"+ping+"> with the perm \""+args[2]+"\".";
				message.channel.send(msg).catch(console.error);
				return;
			}
		});
	}else if(args[0]=="remove"||args[0]=="revoke"){
		if(args.length<3){
			msg+="You need 3 parameters: an action (remove), a ping, a perm.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		var ping=isping(args[1]);
		if(!ping){
			msg+="The 2nd param has to be a valid ping. Also, ping a user, not a role.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		if(perms.validperms.indexOf(args[2])==-1){
			msg+="The perm that you want to edit is not an accepted perm.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		if(args[2]=="manager"&&!isowner){
			msg+="You need owner perm (which you can't have) to edit manager perm.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		if(args[2]=="owner"){
			msg+="Owner perm cannot be edited by this command.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		
		if(typeof(perms.userperms[ping])==="undefined"){
			perms.userperms[ping]=[];
		}
		var userperms=perms.userperms[ping];
		if(userperms.indexOf(args[2])==-1){
			msg+="This user doesn't have this perm.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		//a.splice(a.indexOf(3),1)
		perms.userperms[ping].splice(perms.userperms[ping].indexOf(args[2]),1);
		fs.writeFile("perms.json",JSON.stringify(perms),function(err,fd){
			if(err){
				console.log(err);
				msg+="An error occurred when saving this change. Bot author pinged: <@329052785113038859>";
				message.channel.send(msg).catch(console.error);
				return;
			}
			else {
				console.log("wrote into that file");
				msg+="Successfully revoked <@"+ping+"> with the perm \""+args[2]+"\".";
				message.channel.send(msg).catch(console.error);
				return;
			}
		});
	}else if(args[0]=="view"){
		var ping=isping(args[1]);
		if(!ping){
			msg+="The 2nd param has to be a valid ping. Also, ping a user, not a role.";
			message.channel.send(msg).catch(console.error);
			return;
		}
		if(typeof(perms.userperms[ping])==="undefined"){
			perms.userperms[ping]=[];
		}
		var userperms=perms.userperms[ping];
		if(userperms.length==0){
			msg+="This user has no perms.";
			message.channel.send(msg).catch(console.error);
			return;
		}else{
			msg+="Here are his/her perms:\n```\n"+userperms.toString()+"```";
			message.channel.send(msg).catch(console.error);
			return;
		}
	}else{
		msg+="The first param has to be one of the following: add/grant, remove/revoke, view.";
		message.channel.send(msg).catch(console.error);
		return;
	}
		
}