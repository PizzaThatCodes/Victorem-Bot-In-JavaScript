const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch');
const chalk = require('chalk');
const fs = require('fs');

var GUILDNAME = "Victorem";

var { getAPIKey } = require('../utils/APISwapper.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	name: 'exempt',
	description: "Add members to the exempt kick list",
	cooldown: 3000,
  default_member_permissions: 'Administrator',
	type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: "ign",
        description: "The ign you want to add to the exempt list.",
        type: ApplicationCommandOptionType.String,
        required: true
    },
    {
        name: "day",
        description: "The day when it will expire.",
        type: ApplicationCommandOptionType.String,
        required: true
    },
    {
        name: "month",
        description: "The month when it will expire.",
        type: ApplicationCommandOptionType.String,
        required: true
    },
    {
        name: "year",
        description: "The year when it will expire.",
        type: ApplicationCommandOptionType.String,
        required: true
    }
],
	run: async (client, interaction) => {
	 
        const { options } = interaction;

        let apiKey = await getAPIKey();
        const args = options.getString('ign');
        var ign;
        var unixtime = Math.round(new Date().getTime()/1000 * 1000)

        var expireUnixTime = Math.round(new Date(options.getString('year'), options.getString('month') - 1, options.getString('day')).getTime()/1000 * 1000)

        console.log(unixtime)

        var members = new Array();;
		    var membersSorted = {};

            let guild = await fetch(`https://api.hypixel.net/guild?name=${GUILDNAME}&key=${apiKey}`)
            .then(res => res.json());



            if(guild.status && guild.status != 200) {
              await interaction.reply({ embeds: [
                new EmbedBuilder()
                .setTitle(`***${GUILDNAME} Kick List Exempt List***`)
                .setColor(`Purple`)
                .setDescription(`
                ***Error occured while trying...***
                Unable to connect to the API. Try again later.`)
                ]})
              return;
            }


            if(guild['success'] == false) {
              await interaction.reply({ embeds: [
                new EmbedBuilder()
                .setTitle(`***${GUILDNAME} Kick List Exempt List***`)
                .setColor(`Purple`)
                .setDescription(`
                ***Error occured while trying...***
                Something went wrong; check the spelling of the guild name an validity of the API key.`)
                ]})
              return;
            }

            
		if(args)
			ign = args
		else
			ign = interaction.member.displayName;

		var playerUUID = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}?at=${unixtime}`)
		.then(res => res.json())

    for(var member of guild['guild']['members']) {
			members[`${member['uuid']}`] = 0;
		}

    if(!Object.keys(members).includes(playerUUID.id)) {
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
					.setTitle(`Issue with this player!`)
					.setColor("Purple")
					.setDescription(`
					${ign} Is currently not in the guild! please choose someone who is in the guild currently
					`)
				]
			})
			return;
		}


    // Player is in guild

    var exemptList = require('./exempt-list.json');

    if(!exemptList[`${playerUUID.id}`]) {
			exemptList[`${playerUUID.id}`] = {
				playerName: options.getString('ign').toLowerCase(),
				personWhoAddedThem: `${interaction.member.id}`,
        ExpireTime: expireUnixTime
			};
		} else {
      await interaction.reply({
				embeds: [
					new EmbedBuilder()
					.setTitle(`Issue with adding player!`)
					.setColor("Purple")
					.setDescription(`
					${ign} Is Already added to the exempt list!
					`)
				]
			})
			return;
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle(`Player added to exempt list!`)
        .setColor("Purple")
        .setDescription(`
        ${ign} is now added to the exempt list!
        `)
      ]
    })

    fs.writeFileSync('./slashCommands/moderation/exempt-list.json', JSON.stringify(exemptList, null, 4), (err) => {
			if(err) console.log(err)
		  });


            

    }
};
