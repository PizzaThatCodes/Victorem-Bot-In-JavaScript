const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch')
const fs = require('fs');

var VERIFICATIONGUILD = "Victorem";


module.exports = {
	name: 'verify',
	description: "gives you all the roles you qualify for",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	options: [
        {
            name: "ign",
            description: "The ign you want to verify with.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
		{
            name: "optional_bypasskey",
            description: "A bypass key for /verify!",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
	run: async (client, interaction) => {
		var { options, member } = interaction;
        

		var unixtime = Math.round(new Date().getTime()/1000 * 1000)
		var PLAYERUUID = await fetch(`https://api.mojang.com/users/profiles/minecraft/${options.getString('ign')}?at=${unixtime}`)
		.then(res => res.json())

		let themember = await fetch(`https://api.hypixel.net/player?uuid=${PLAYERUUID.id}&key=4e3f3e85-971a-4414-b3a3-c8bc0096295c`)
		.then(res => res.json());

		console.log(themember['player']['socialMedia']['links']['DISCORD']);
		if(themember['player']['socialMedia']['links']['DISCORD'] != `${member.user.name}#${member.user.discriminator}`) {
            var BYPASSLINK = fs.readFileSync('./bypasskeys.json');

            if(!BYPASSLINK.contains(member.id) && (BYPASSLINK[member.id].name !== options.getString('ign').toLowerCase()) && (BYPASSLINK[member.id].key !== options.getString('optional_bypasskey'))) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Issue with verify you!")
                        .setDescription(`Please link your Minecraft account with your Discord account to verify.
                        Use /link for help!`)
                        .setColor('Purple')
                    ]
                })
                return;
            }
			
		}


        // await args["util"]['hypixelapi'].skyblockProfiles(res['player']['uuid'], skyblockProfilesReceived, args={"message": args["message"], "util": args["util"], "player": res})

        // if(PLAYERUUID )

        // if uuid in skyblockprofilescache.keys() and unix - skyblockprofilescache[uuid]['timestamp'] < 300:
        //     await then(skyblockprofilescache[uuid]['content'], args)
        //     return


	}
};



var skyblockSkillXpRequirements = {
    1: 50,
    2: 125,
    3: 200,
    4: 300,
    5: 500,
    6: 750,
    7: 1000,
    8: 1500,
    9: 2000,
    10: 3500,
    11: 5000,
    12: 7500,
    13: 10000,
    14: 15000,
    15: 20000,
    16: 30000,
    17: 50000,
    18: 75000,
    19: 100000,
    20: 200000,
    21: 300000,
    22: 400000,
    23: 500000,
    24: 600000,
    25: 700000,
    26: 800000,
    27: 900000,
    28: 1000000,
    29: 1100000,
    30: 1200000,
    31: 1300000,
    32: 1400000,
    33: 1500000,
    34: 1600000,
    35: 1700000,
    36: 1800000,
    37: 1900000,
    38: 2000000,
    39: 2100000,
    40: 2200000,
    41: 2300000,
    42: 2400000,
    43: 2500000,
    44: 2600000,
    45: 2750000,
    46: 2900000,
    47: 3100000,
    48: 3400000,
    49: 3700000,
    50: 4000000,
    51: 4300000,
    52: 4600000,
    53: 4900000,
    54: 5200000,
    55: 5500000,
    56: 5800000,
    57: 6100000,
    58: 6400000,
    59: 6700000,
    60: 7000000
}