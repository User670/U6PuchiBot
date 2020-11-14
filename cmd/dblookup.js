exports.run = (client, message, args) => {
	var db=require("../db.json");
	var msg=message.author+"\n";
	
	function trimtext(t){
		if(typeof(t)=="number")return t;
		if(typeof(t)!="string")t=t.toString();
		var r="";
		var rl=0;
		for(var i in t){
			r+=t[i];
			if(t.charCodeAt(i)<=127){
				rl+=1;
			}else{
				rl+=2;
			}
			if(rl>=14){
				if(i!=t.length-1){
					r+="...";
				}
				break;
			}
		}
		return r;
	}	
	
	
	function find(tablename,action,params){
		//console.log(table,action,params)
		var table={};
		var tablefound=false;
		var result=new Object();
		var temp={};
		for(var i in db.objects){
			//console.log(db.objects[i].name,db.objects[i].name==tablename)
			if(db.objects[i].name==tablename){
				table=db.objects[i];
				tablefound=true;
				break;
			}
		}
		
		if(!tablefound){
			return {success:false,err:"notable"};
		}
		
		if(action=="row"){
			//params:
			//  - row: number
			
			//whether there is such a row...
			if(params.row>=table.rows.length||params.row<0){
				return {success:false,err:"rowindex",numrow:table.rows.length}
			}else{
				result.success=true;
				result.numrow=table.rows.length;
				var str="";
				for(var i in table.columns){
					//content...
					str+=table.columns[i].name;
					str+=": ";
					if(typeof(table.rows[params.row][i])=="string"){
						str+="\"";
					}
					str+=table.rows[params.row][i];
					if(typeof(table.rows[params.row][i])=="string"){
						str+="\"";
					}
					
					//expand content: timestamp...
					if(table.columns[i].type=="bigint"&&table.rows[params.row][i]>600000000000000000){
						str+=" (";
						str+=new Date(table.rows[row][i]/10000-62135625600000).toGMTString();
						str+=")";
					}
					
					//expand content: item...
					if(table.columns[i].name=="itemMstId"){
						var t=find("ItemMst","value",{indexrow:"itemMstId",index:table.rows[row][i],value:"itemName"});
						if(t.success){
							str+=" ("+t.value+")";
						}
					}
					
					//expand content: reward...
					if(["rewardMstId","rewardId1","rewardId2","rewardId3","rewardId"].indexOf(table.columns[i].name)!=-1){
						var ti=find("RewardMst","value",{indexrow:"rewardId",index:table.rows[row][i],value:"itemMstId"});
						var tm=find("RewardMst","value",{indexrow:"rewardId",index:table.rows[row][i],value:"memberMstId"});
						var tn=find("RewardMst","value",{indexrow:"rewardId",index:table.rows[row][i],value:"num"});
						if(ti.success&&tm.success&&tn.success){
							if(tm.value==0){
								var tnm=find("ItemMst","value",{indexrow:"itemMstId",index:ti.value,value:"itemName"});
								if(tnm.success){
									str+=" ("+tnm.value+" x"+tn.value+")";
								}
							}else{
								var mc=find("CostumeMst","value",{indexrow:"costumeMstId",index:Math.floor(tm.value/1000),value:"costumeName"});
								var mp=find("PersonalMst","value",{indexrow:"personalMstId",index:tm.value%1000,value:"personalName"});
								if(mc.success&&mp.success){
									str+="("+mc.value+" "+mp.value+")";
								}
							}
						}
					}
					
					//expand content: member...
					if(table.columns[i].name=="memberMstId"){
						var mc=find("CostumeMst","value",{indexrow:"costumeMstId",index:Math.floor(table.rows[row][i]/1000),value:"costumeName"});
						var mp=find("PersonalMst","value",{indexrow:"personalMstId",index:table.rows[row][i]%1000,value:"personalName"});
						if(mc.success&&mp.success){
							str+="("+mc.value+" "+mp.value+")";
						}
					}
					//the linebreak
					str+="\n"
				}
				result.str=str;
				return result;
			}
		}else if(action=="overview"){
			//params:
			//  row: number
			
			if(params.row>=table.rows.length||params.row<0){
				return {success:false,err:"rowindex",numrow:table.rows.length}
			}else{
				result.success=true;
				result.numrow=table.rows.length;
				result.str="";
				var str="";
				
				//the title row
				str+="row | ";
				var collimit=Math.min(7,table.columns.length);
				for(var i=0;i<collimit;i++){
					str+=table.columns[i].name;
					if(i!=collimit-1)str+=" | ";
				}
				str+="\n";
				var rowlimit=Math.min(params.row+10,table.rows.length);
				var j;
				for(j=params.row;j<rowlimit;j++){
					str+=j+" | ";
					for(var i=0;i<collimit;i++){
						str+=trimtext(table.rows[j][i]);
						if(i!=collimit-1)str+=" | ";
					}
					str+="\n";
				}
				result.str=str;
				result.endrow=j-1;
				return result;
				
			}
		}else if(action=="value"){
			//params:
			//  indexrow
			//  index
			//  value
			
			var idxidx=-1;
			var validx=-1;
			for(var i in table.columns){
				if(params.indexrow==table.columns[i].name){
					idxidx=i;
					break;
				}
			}
			for(var i in table.columns){
				if(params.value==table.columns[i].name){
					validx=i;
					break;
				}
			}
			if(idxidx==-1||validx==-1){
				return {success:false,err:"nocol"};
			}else{
				for(var i in table.rows){
					if(table.rows[i][idxidx]==params.index){
						return {success:true,value:table.rows[i][validx]};
					}
				}
				return {success:false,err:"norow"};
			}
		}else if(action=="find"){
			//params:
			//  column
			//  value
			//  page
			var idxidx=-1;
			for(var i in table.columns){
				if(params.column==table.columns[i].name){
					idxidx=i;
					break;
				}
			}
			if(idxidx==-1){
				return {success:false,err:"nocol"};
			}else{
				var rowsfound=0;
				var skipnum=(params.page-1)*10;
				var str="";
				var collimit=Math.min(7,table.columns.length);
				for(var i in table.rows){
					if(table.rows[i][idxidx]==params.value){
						if(skipnum){
							skipnum--;
							continue;
						}
						if(rowsfound==0){
							str+="row | ";
							for(var j=0;j<collimit;j++){
								str+=table.columns[j].name;
								if(j!=collimit-1)str+=" | ";
							}
							str+="\n"
						}
						if(rowsfound<10){
							str+=i+" | ";
							for(var j=0;j<collimit;j++){
								str+=trimtext(table.rows[i][j]);
								if(j!=collimit-1)str+=" | ";
							}
							str+="\n";
						}
						rowsfound++;
						if(rowsfound>=11){
							break;
						}
						
					}
				}
				result.str=str;
				result.success=true;
				result.empty=(rowsfound==0)?true:false;
				result.more=(rowsfound>=11)?true:false;
				return result;
				
			}
		}else{
			return {success:false,err:"nomethod"};
		}
		return {success:false,err:"unexpected"};
	}
			
	
	
	
	
	
	
	/*
	var itemMstIndex=13;
	var rewardMstIndex=24;
	
	function getitem(id){
		for(var j in db.objects[itemMstIndex].rows){
			if(db.objects[itemMstIndex].rows[j][0]==id){
				return db.objects[itemMstIndex].rows[j][2];
			}
		}
		return "";
	}
	
	
	function getreward(id){
		for(var i in db.objects[rewardMstIndex].rows}{
			if(db.objects[rewardMstIndex].rows[i][1]==id){
				if(db.objects[rewardMstIndex].rows[i][3]==0){
					return ""+getitem(db.objects[rewardMstIndex].rows[i][2])+" x"+db.objects[rewardMstIndex].rows[i][4];
				}else{
					return 
	*/
	
	if(args[0]=="list"){
		var pg=parseInt(args[1])||1;
		if(pg<1)pg=1;
		var pagesize=10;
		var tn=db.objects.length;
		var tp=Math.ceil(tn/pagesize);
		if(pg>tp){
			msg+="Page number too large. There are "+tp+" pages."
			message.channel.send(msg).catch(console.err);
			return;
		}
		var lowerb=(pg-1)*10;
		var upperb=Math.min(pg*10-1,tn-1);
		msg+="page "+pg+" of "+tp+"```\n";
		for(var i=lowerb;i<=upperb;i++){
			//console.log(i,db.objects[i].name);
			msg+=db.objects[i].name;
			if(i!=upperb)msg+="\n";
		}
		msg+="```type `u!dblookup list [pageNumber]` to view other pages.";
		message.channel.send(msg).catch(console.err);
		return;
	}else if(typeof(args[0])!="undefined"){
		var validtable=false;
		var tableindex=-1;
		for(var i in db.objects){
			if(db.objects[i].name==args[0]){
				validtable=true;
				tableindex=i;
				break;
			}
		}
		if(validtable){
			if(args[0]=="ServerMemberData"||args[0]=="ServerTeamData"){
				msg+="Sorry, but this isn't a table you are supposed to access. (it should contain a player's, in this case, my dummy account's, team or puchi data, which is pointless anyway.)";
				message.channel.send(msg).catch(console.err);
				return;
			}			
			var table=db.objects[tableindex]
			var tablename=args[0];
			if(typeof(args[1])!="undefined"){
				if(!isNaN(parseInt(args[1]))){
					var row=parseInt(args[1]);
					if(row>=table.rows.length||row<0){
						msg+="Invalid row number. This table has "+table.rows.length+" rows, which means the row number should be between 0 and "+(table.rows.length-1)+"."
						message.channel.send(msg).catch(console.err);
						return;
					}else{
						var t=find(tablename,"row",{row:row})
						if(t.success){
							msg+="Row "+row+" of [0.."+(table.rows.length-1)+"] from table "+args[0]+":\n```yaml\n";
							msg+=t.str;
							msg+="```";
						}else{
							msg+="An error happened when attempting to find info in the database (\""+t.err+"\"). Ping User670#9501.";
						}
						message.channel.send(msg).catch(console.err);
						return;
					}
				}else if(args[1]=="info"){
					msg+="Table name: "+table.name+"\n";
					msg+="# rows: "+table.rows.length+" (index from 0 to "+(table.rows.length-1)+")\n";
					msg+="Columns:```\n";
					for(var i in table.columns){
						msg+=table.columns[i].name+": "+table.columns[i].type+"\n";
					}
					msg+="```";
					message.channel.send(msg).catch(console.err);
					return;
				}else if(args[1]=="overview"){
					var row=parseInt(args[2])||0;
					if(row<0)row=0;
					var t=find(tablename,"overview",{row:row});
					if(t.success){
						msg+="Overview of rows "+row+"-"+t.endrow+" of [0.."+(t.numrow-1)+"] from table "+tablename+":\n```\n";
						msg+=t.str;
						msg+="```";
						if(t.endrow==t.numrow-1){
							msg+="This is the end of the table.";
						}else{
							msg+="Type `u!dblookup "+tablename+" overview "+(t.endrow+1)+"` for the next few rows.";
						}
					}else{
						msg+="An error happened when attempting to find info in the database (\""+t.err+"\"). Ping User670#9501.";
					}
					message.channel.send(msg).catch(console.err);
					return;
				}else if(args[1]=="find"){
					//args   1        2       3     4
					//     find   personal  Honk    2
					if(args.length<4){
						msg+="`u!dblookup <tableName> find <column> <value> [pageNumber]`. Seems that you are missing the column and/or value. (I know it's awkward to use...)";
						message.channel.send(msg).catch(console.err);
						return;
					}
					var pg=parseInt(args[4])||1;
					var t=find(tablename,"find",{column:args[2],value:args[3],page:pg});
					if(t.success){
						if(t.empty){
							if(pg==1){
								msg+="Searched but find no matches. Try again, or if you believe it's a mistake, ping User670#9501. Searching is case-sensitive, and only searches exact matches.";
							}else{
								msg+="Page number too high and we cannot find any results for this page. Try search without a page number, and if still no results, then there are no matches in the table at all.";
							}
						}else{
							msg+="Search results: \n```\n";
							msg+=t.str;
							msg+="```";
							if(t.more){
								msg+="There are more search results; type `u!dblookup "+tablename+" find "+args[2]+" "+args[3]+" "+(pg+1)+"` to see.";
							}else{
								msg+="This is the end of the search result.";
							}
						}
						message.channel.send(msg).catch(console.err);
						return;
					}else{
						if(t.err=="nocol"){
							msg+="The column you specified is not in the table. Try `u!dblookup "+tablename+" info` to see what columns are there, or simply lookup a random row in it.";
						}else{
							msg+="An error happened when attempting to find info in the database (\""+t.err+"\"). Ping User670#9501.";
						}
						message.channel.send(msg).catch(console.err);
						return;
					}
							
				}else{
					msg+="This method is not supported. Type `u!dblookup` without any parameters to see a list of possible actions.";
					message.channel.send(msg).catch(console.err);
					return;
				}
			}else{
				msg+="Just a table name is not enough, I need to know what you want. Type `u!dblookup` without any parameters to see a list of possible actions."
				message.channel.send(msg).catch(console.err);
				return;
			}
		}else{
			msg+="There is no such table in the database. Type `u!dblookup list` for a list of tables.";
			message.channel.send(msg).catch(console.err);
			return;
		}
	}else{
		msg+="```";
		msg+="u!dblookup list [pageNumber]\n";
		msg+="u!dblookup <tableName> <rowIndex>\n";
		msg+="u!dblookup <tableName> info\n";
		msg+="  -- general information of the table.\n";
		msg+="u!dblookup <tableName> overview [startingRowIndex]\n";
		msg+="  -- an overview of part of the table with up to 10 rows, some columns omitted, long text trimmed.\n";
		msg+="u!dblookup <tableName> find <column> <value> [pageNumber]\n";
		msg+="  -- search the table. I know it's bad, don't judge."
		msg+="```\n";
		msg+="I'm done with adding features to this command. If you think there should be any additional methods or other improvements, let me know.";
		message.channel.send(msg).catch(console.err);
		return;
	}
};