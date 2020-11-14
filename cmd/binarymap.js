exports.run = (client, message, args) => {


function binmap(str){
	var t=""
	var count=0;
	for(var i in str){
		switch (str[i]){
			case "0":
				t+="--------";
				count+=0;
				break;
			case "1":
				t+="------XX";
				count+=1;
				break;
			case "2":
				t+="----XX--";
				count+=1;
				break;
			case "3":
				t+="----XXXX";
				count+=2;
				break;
			case "4":
				t+="--XX----";
				count+=1;
				break;
			case "5":
				t+="--XX--XX";
				count+=2;
				break;
			case "6":
				t+="--XXXX--";
				count+=2;
				break;
			case "7":
				t+="--XXXXXX";
				count+=3;
				break;
			case "8":
				t+="XX------";
				count+=1;
				break;
			case "9":
				t+="XX----XX";
				count+=2;
				break;
			case "A":
				t+="XX--XX--";
				count+=2;
				break;
			case "B":
				t+="XX--XXXX";
				count+=3;
				break;
			case "C":
				t+="XXXX----";
				count+=2;
				break;
			case "D":
				t+="XXXX--XX";
				count+=3;
				break;
			case "E":
				t+="XXXXXX--";
				count+=3;
				break;
			case "F":
				t+="XXXXXXXX";
				count+=4;
				break;
		}
		if(i%4==3){
			t+="\n";
		}
	}
	t+="region size: "+count;
	//document.getElementById("dummy").innerHTML="<pre>"+t+"</pre>";
	return t;
}
  
  message.channel.send(message.author+"\n```\n"+binmap(args[0])+"```")
  
}