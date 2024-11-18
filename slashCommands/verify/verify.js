const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch')
const fs = require('fs');
const path = require('path');

var VERIFICATIONGUILD = "Victorem";

const { getAPIKey } = require('../utils/APISwapper.js');

const { createEmbed } = require('../utils/ConfigStuff.js');


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
            name: "bypasskey",
            description: "A bypass key for /verify!",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
	run: async (client, interaction) => {

        function sum(arr) {
            var result = 0, n = arr.length || 0; //may use >>> 0 to ensure length is Uint32
            while(n--) {
              result += +arr[n]; // unary operator to ensure ToNumber conversion
            }
            return result;
          }

        //let apiKey = await getAPIKey();
        let apiKey = "fbf5bebc-e355-4425-add7-a1f8703d7ada";

        // console.log(apiKey);
		var { options, member } = interaction;
        

		var unixtime = Math.round(new Date().getTime()/1000 * 1000)
		var PLAYERUUID;
        try {
            PLAYERUUID = await fetch(`https://api.mojang.com/users/profiles/minecraft/${options.getString('ign')}?at=${unixtime}`)
            .then(res => res.json());
        } catch(err) {
            PLAYERUUID = "1";
        }
        if(PLAYERUUID === "1") {
            interaction.reply({
				embeds: [
                    await createEmbed(`Issue with this player`,
                    `This account doesn't exist.`,
                    "Purple",
                    interaction,
                    interaction.member)
				]
			})
			return;
        }

		let themember = await fetch(`https://api.hypixel.net/player?uuid=${PLAYERUUID.id}&key=${apiKey}`)
		.then(res => res.json());

        if(themember.status && themember.status != 200) {
            interaction.editReply({ embeds: [
                await createEmbed(`***Verification Error***`, `
                ***Error occured while trying...***
                Player hasen't played on hypixel, or issue with getting player info from hypixel api.`, `Purple`)
            ]});
            return;
          }

        

		// console.log(themember['player']['socialMedia']['links']['DISCORD']);

        // Checks if the players discord is the same as the discord account verifying

        if(!themember['player']['socialMedia'] || !themember['player']['socialMedia']['links']) {
            await interaction.reply({
                embeds: [
                    await createEmbed("Issue with verify you!",
                    `Please link your Minecraft account with your Discord account to verify.
                    Use /link for help!`,
                    "Purple",
                    interaction)
                ]
            })
            return;
        }

		if(themember['player']['socialMedia']['links']['DISCORD'] != `${member.user.name}#${member.user.discriminator}`) {
            var BYPASSLINK = fs.readFileSync('./bypasskeys.json');

            if(!BYPASSLINK.includes(member.id) && BYPASSLINK[member.id] && (BYPASSLINK[member.id].name !== options.getString('ign').toLowerCase()) && (BYPASSLINK[member.id].key !== options.getString('bypasskey'))) {
                await interaction.reply({
                    embeds: [
                        await createEmbed("Issue with verify you!",
                        `Please link your Minecraft account with your Discord account to verify.
                        Use /link for help!`,
                        "Purple",
                    interaction)
                    ]
                })
                return;
            }
			
		}


        // Checks if member is in guild
        let isMemberInGuild = await fetch(`https://api.hypixel.net/guild?player=${PLAYERUUID.id}&key=${apiKey}`)
		.then(res => res.json());

        let skyblockProfiles = await fetch(`https://api.hypixel.net/skyblock/profiles?uuid=${PLAYERUUID.id}&key=${apiKey}`)
            .then(res => res.json());


        if(!isMemberInGuild['guild'] || isMemberInGuild.status) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Issue with verify you!")
                    .setDescription(`Couldn't find the guild you are currently in!`)
                    .setColor('Purple')
                ]
            })
        } else {
            if(isMemberInGuild['guild']['name'] != VERIFICATIONGUILD) {
                await interaction.reply({
                    embeds: [
                        await createEmbed("Issue with verify you!",
                        `It would appear that you are currently not in the guild!`,
                        "Purple",
                    interaction)
                    ]
                })
                return
            }
        }


        //Adds Roles
        await interaction.reply({
            embeds: [
                await createEmbed("Verification Completed!",
                `You will recieve your roles shortly.`,
                "Purple",
                    interaction)
            ]
        })


        // List of roles
        var roles = {

            // Guild rank
            "member": "543919123252510730",
            "memer": "756122512617898076",
    
            // Name color
            "#14ce00": "860511526327025684", // Member green
            "#0c8500": "860511843453370379", // Memer dark green
    
            // Role dividers
            "dividerGuildStatus": "860510297423740958",
            "dividerIngameStats": "860510565561663518",
    
            // Bedwars prestige
            "bedwarsIronPrestige": "870117323497951272",
            "bedwarsGoldPrestige": "870117447959740476",
            "bedwarsDiamondPrestige": "870118152502136903",
            "bedwarsEmeraldPrestige": "896438062131855400",
            "bedwarsSapphirePrestige": "962784833640218674",
    
            // Bedwars FKDR
            "bedwars3fkdr": "870118271624544306",
            "bedwars5fkdr": "870118354088771635",
            "bedwars10fkdr": "870129667099746304",
    
            // Skywars prestige
            "skywarsGoldPrestige": "1004400207179558943",
            "skywarsDiamondPrestige": "996959535921115247",
    
            // Skyblock SA
            "skyblock35SA": "759073562425557043",
            "skyblock40SA": "759103738148290680",
            "skyblock45SA": "759103737582452736",
            "skyblock50SA": "759103736488132608",
    
        }

        // List of roles to add to the member
        var rolesToAdd = [roles["member"], roles["dividerGuildStatus"], roles["dividerIngameStats"]]
        var namecolor = roles["#14ce00"]

        let guild = await fetch(`https://api.hypixel.net/guild?name=${VERIFICATIONGUILD}&key=${apiKey}`)
            .then(res => res.json());

        // Guild rank
        var guildrank = "Member"
        for(member in guild['guild']['members']) {
            // console.log(guild['guild']['members'][member]);
            if(guild['guild']['members'][member]['uuid'] == themember['player']['uuid']) {
                guildrank = guild['guild']['members'][member]['rank']
                break
            }
        }

        if(guildrank == "Memer") {
            rolesToAdd.push(roles["memer"])
            namecolor = roles["#0c8500"]
        }
        if(guildrank == "CoOwner") {
            await interaction.editReply({
                embeds: [
                    await createEmbed("Roles Issue...",
                    `The operation has been cancelled because you have the in-game CoOwner role. Contact the server owner.`,
                    "Purple",
                    interaction)
                ]
            })
            return
            // guildrank = "Member";
        }

        // console.log(roles['member'])
        // console.log(roles['memer'])

        var bwstar = 0;
        try {
            bwstar = themember['player']['achievements']['bedwars_level']
        } catch(err) { console.log(err) }

        if(bwstar >= 100 && bwstar < 200) {
        rolesToAdd.push(roles["bedwarsIronPrestige"])
        }
        else if(bwstar >= 200 && bwstar < 300) {
            rolesToAdd.push(roles["bedwarsGoldPrestige"])
        }
        if(bwstar >= 300 && bwstar < 400) {
            rolesToAdd.push(roles["bedwarsDiamondPrestige"])
        } else if(bwstar >= 400 && bwstar < 500) {
            rolesToAdd.push(roles["bedwarsEmeraldPrestige"])
        } else if(bwstar >= 500) {
            rolesToAdd.push(roles["bedwarsSapphirePrestige"])
        }

        var bwfkdr = 0;
        try {
            bwfkdr = themember['player']['stats']['Bedwars']['final_kills_bedwars'] / themember['player']['stats']['Bedwars']['final_deaths_bedwars']
        } catch(err) { console.log(err) }

        if(bwfkdr >= 3 && bwfkdr < 5)
            rolesToAdd.push(roles["bedwars3fkdr"])
        else if(bwfkdr >= 5 && bwfkdr < 10)
            rolesToAdd.push(roles["bedwars5fkdr"])
        else if(bwfkdr >= 10)
            rolesToAdd.push(roles["bedwars10fkdr"])

        var swexp = 0;
        try {
            swexp = themember['player']['stats']['SkyWars']['skywars_experience']
        } catch(err) { console.log(err) }

        if(swexp >= 10000)
            rolesToAdd.push(roles["skywarsGoldPrestige"])
        else if(swexp >= 55000)
            rolesToAdd.push(roles["skywarsDiamondPrestige"])


        var sbsa = 0;

        try {
                // console.log(skyblockProfiles['profiles']['members'])
                // console.log(skyblockProfiles['profiles']['members'][PLAYERUUID])

                // if(!skyblockProfiles['profiles']['members'][PLAYERUUID.id][skills[0]]) return;

                for(var profile of skyblockProfiles['profiles']) {

                    var skills = ["experience_skill_alchemy", "experience_skill_mining", "experience_skill_combat", "experience_skill_farming", "experience_skill_enchanting", "experience_skill_taming", "experience_skill_fishing", "experience_skill_foraging"]
                    var skillLevels = [];
                    for(var skill of skills) {
                        // console.log(profile['members'][PLAYERUUID.id]);
                        // console.log(profile['members'][PLAYERUUID.id][skill]);
                            try {
                                var skillExp = Math.round(profile['members'][PLAYERUUID.id][skill]);
                                var level = 0;
                                var cumXpReq = 0;
                                for(var xpReg of Object.values(skyblockSkillXpRequirements)) {
                                    cumXpReq += xpReg;
                                    if(skillExp > cumXpReq)
                                        level += 1;
                                }
                                skillLevels.push(level);
                            } catch(err) { 
                                skillLevels.push(0);
                                console.log(err)
                            }
                            if(sum(skillLevels)/skillLevels.length > sbsa)
                                sbsa = sum(skillLevels)/(skillLevels.length);
                        }
                }

        } catch(err) { console.log(err) }

        if(sbsa >= 35 && sbsa < 40)
            rolesToAdd.push(roles["skyblock35SA"])
        else if(sbsa >= 40 && sbsa < 45)
            rolesToAdd.push(roles["skyblock40SA"])
        else if(sbsa >= 45 && sbsa < 50)
            rolesToAdd.push(roles["skyblock45SA"])
        else if(sbsa >= 50)
            rolesToAdd.push(roles["skyblock50SA"])


        // Adds all needed roles and changes nick
        rolesToAdd.push(namecolor)
        // await interaction.member.roles.add(rolesToAdd)
        for(var roless of rolesToAdd) {
            // console.log(rolesToAdd)
            // console.log(roless);
            await interaction.member.roles.add(roless);
        }
        try {
            await interaction.member.setNickname(themember['player']['displayname'])
        } catch(err) { console.log(err) }





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