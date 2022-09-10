const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch')

var GUILDNAME = "Victorem";

module.exports = {
	name: 'myposition',
	description: "quick tutorial on how to link your account",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	options: [
        {
            name: "ign",
            description: "(Optional) The ign you want to find their position of.",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
	run: async (client, interaction) => {
		const { options } = interaction;

		const args = options.getString('ign');

		var ign;
		if(args)
			ign = args
		else
			ign = interaction.member.displayName;

			var unixtime = Math.round(new Date().getTime()/1000 * 1000)
		var playerUUID = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}?at=${unixtime}`)
		.then(res => res.json())

		var members = new Array();;
		var membersSorted = {};

		let guild = await fetch(`https://api.hypixel.net/guild?name=${GUILDNAME}&key=4e3f3e85-971a-4414-b3a3-c8bc0096295c`)
		.then(res => res.json());

		if(guild.status && guild.status != 200) {
		  interaction.editReply({ embeds: [
			new EmbedBuilder()
			.setTitle(`***${GUILDNAME} Current Position***`)
			.setColor(`Purple`)
			.setDescription(`
			***Error occured while trying...***
			Unable to connect to the API. Try again later.`)
			]})
		  return;
		}


		for(var member of guild['guild']['members']) {
			members[`${member['uuid']}`] = 0;
			for(const day of Object.values(member['expHistory'])) {
				members[member['uuid']] += day;
			}
		}

		if(!Object.keys(members).includes(playerUUID.id)) {
			interaction.reply({
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

		while (Object.keys(members).length > 0) {

			var highestkey = Object.keys(members)[0];
			var highestvalue = Object.values(members)[0];

			for(key of Object.keys(members)) {
				if(members[key] > highestvalue) {
					highestkey = key;
					highestvalue = members[key]
				}

			}

			membersSorted[highestkey] = highestvalue;
			delete members[highestkey];


		}


		var rank = 0;

		for(var member of Object.keys(membersSorted)) {
			rank += 1;
			if(playerUUID.id == member) {
				break;
			}
		}


		await interaction.reply({
			embeds: [
				new EmbedBuilder()
				.setTitle(`${ign}'s Current Position`)
				.setColor("Purple")
				.setDescription(`
				${ign} Is currently rank #${rank} with ${membersSorted[playerUUID.id]} GEXP in the past 7 days.
				`)
			]
		})


	}	
};