exports.run = (client, message, args) => {

    var memberexp = [0, 130, 320, 550, 850, 1200, 1600, 2100, 2600, 3200, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 10000, 10600, 11200, 11800, 12400, 13000, 13600, 14200, 14800, 15400, 19000, 19800, 20600, 21400, 22200, 23000, 23800, 24600, 25400, 26200, 30000, 31000, 32000, 33000, 34000, 35000, 36000, 37000, 38000, 39000]
    var memberidlzcoin = [5000, 10000, 15000, 20000, 20000]
    var candyvalue = 2000

    var begin = parseInt(args[0]) || 1
    var end = 0
    var mode = ""
    //var end=parseInt(args[1])||50
    if(args[1][args[1].length - 1] == "C" || args[1][args[1].length - 1] == "c") {
        mode = "candy"
        end = parseInt(args[1].slice(0, -1)) || 0
    } else {
        mode = "level"
        if("1234567890".indexOf(args[1][args[1].length - 1]) == -1) {
            end = parseInt(args[1].slice(0, -1)) || 50
        } else {
            end = parseInt(args[1]) || 50
        }
    }
    var until = parseInt(args[2]) || 0

    if(begin < 1) begin = 1
    if(begin > 50) begin = 50
    if(mode == "level") {
        if(end < 1) end = 1
        if(end > 50) end = 50
    } else {
        if(end < 0) end = 0
        if(until < 0) until = 0
	}

	var savercandies = 0
	var saverremaining = 0
	var saverlevel = 0
	var manualexp = 0
	var quickcandies = 0
	var quickremaining = 0
	var quicklevel = 0
	var coins = 0
	var savercoins = 0
	var quickcoins = 0
	var accum = 0
	var t = ""
	if(mode == "level") {
		for(var i = begin + 1; i <= end; i++) {
			if(i == begin + 1 && until != 0) accum += until;
			else accum += memberexp[i - 1];

			if(i % 10 == 0 || i == end) {
				savercandies += Math.floor(accum / candyvalue);
				quickcandies += Math.ceil(accum / candyvalue);
				manualexp += accum - Math.floor(accum / candyvalue) * candyvalue;
				if(i % 10 == 0) coins += memberidlzcoin[i / 10 - 1];
				accum = 0;
			}
		}
		if(quickcandies == 0 && coins == 0) {
			t = "You are already there! (or your input is somewhat invalid? If you believe it is a bug please contact User670#9501.)"
		} else {
			t = "Using a candy-saving method, you need " + savercandies + " candies, and you need to manually grind a total of " + manualexp + " EXP.\nUsing a quick feed method, you need " + quickcandies + " candies.";
			if(coins != 0) t += "\nYou also need " + coins + " coins."
		}
	} else {
		savercandies = end
		quickcandies = end
		for(var i = begin + 1; i <= 50; i++) {
			if(i == begin + 1 && until != 0) accum += until;
			else accum += memberexp[i - 1];

			if(i % 10 != 0) {
				var thislevelcandies = Math.ceil(accum / candyvalue)
				if(saverlevel == 0) {
					if(savercandies < thislevelcandies) {
						saverremaining = accum - (savercandies * candyvalue)
						saverlevel = i - 1
					} else {
						savercandies -= thislevelcandies
					}
				}
				if(quicklevel == 0) {
					if(quickcandies < thislevelcandies) {
						quickremaining = accum - (savercandies * candyvalue)
						quicklevel = i - 1
					} else {
						quickcandies -= thislevelcandies
					}
				}
				accum -= thislevelcandies * candyvalue
			} else {
				var thislevelcandies = Math.floor(accum / candyvalue)
				if(saverlevel == 0) {
					if(savercandies < thislevelcandies) {
						saverremaining = accum - (savercandies * candyvalue)
						saverlevel = i - 1
					} else {
						savercandies -= thislevelcandies
						manualexp += accum - thislevelcandies * candyvalue
						savercoins += memberidlzcoin[i / 10 - 1]
					}
				}
				thislevelcandies = Math.ceil(accum / candyvalue)
				if(quicklevel == 0) {
					if(quickcandies < thislevelcandies) {
						quickremaining = accum - (savercandies * candyvalue)
						if(quickremaining < 0) quickremaining = 0
						quicklevel = i - 1
					} else {
						quickcandies -= thislevelcandies
						quickcoins += memberidlzcoin[i / 10 - 1]
					}
				}
				accum = 0
			}
		}

		t += "Using a candy-saving method, you can level up to " + (saverlevel == 0 ? ("50 using " + (end - savercandies) + " of your candies") : saverlevel) + ".";
		if(manualexp != 0) {
			t += " You'll need to manually grind " + manualexp + " EXP.";
		}
		if(savercoins != 0) {
			t += " You'll also need " + savercoins + " coins.";
		}
		t += "\n";
		t += "Using a quick feed method, you can level up to " + (quicklevel == 0 ? ("50 using " + (end - quickcandies) + " of your candies") : quicklevel) + ".";
		if(quickcoins != 0) {
			t += " You'll also need " + quickcoins + " coins.";
		}



	}
	message.channel.send(message.author + "\n" + t).catch(console.error);

}
