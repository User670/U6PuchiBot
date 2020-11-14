exports.run = (client, message, args) => {
  
  
  
  var fs=require("fs");
  function send(content,original){
    original.channel.send(content).catch(console.err);
  }
  
  if(message.author.id=="329052785113038859"){
    var t=args.join(" ");
    eval(t);
  }else{
    send("Only User670#9501 can do this.",message);
  }
  //fs.writeFile("../tmp/cutoff.json","{1:2}");
}