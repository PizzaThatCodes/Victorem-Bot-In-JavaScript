const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');

module.exports = {
	name: 'donate-api-key',
	description: "Donate your api key for free robuxs",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	options: [
        {
            name: "api-token",
            description: "The Hypixel API token (do /api new)",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
	run: async (client, interaction) => {
		const { options } = interaction;
		var apiKeyList = require('../utils/apiKeyList.json');

		var checkOwner = await fetch(`https://api.hypixel.net/key?key=${options.getString("api-token")}`)
		.then(res => res.json());


		if(checkOwner['cause'] && checkOwner['cause'] === 'Invalid API key') {
			interaction.reply({ embeds: [
                new EmbedBuilder()
                .setTitle(`***Error with adding key***`)
                .setColor(`Purple`)
                .setDescription(`
                Invalid api key.`)
                ]})
              return;
		}
		if(checkOwner['cause'] && checkOwner['cause'] === 'Key throttle') {
			interaction.reply({ embeds: [
                new EmbedBuilder()
                .setTitle(`***Error with adding key***`)
                .setColor(`Purple`)
                .setDescription(`
                Key api limit is currently maxed out, wait a minute before trying again.`)
                ]})
              return;
		}

		if(Object.keys(apiKeyList).includes(`${checkOwner['record']['owner']}`)) {
			var isKeyAdded = false;
			Object.keys(apiKeyList).forEach(key => {
				if(key.apiKey === options.getString('api-token')) isKeyAdded = true;
			})
			if(isKeyAdded) {
				interaction.reply({
					embeds: [
						new EmbedBuilder()
						.setTitle("Issue with adding API Token")
						.setDescription("Api token is already added.")
						.setColor('Purple')
					]
				})
				return;
			}
		}

		


		if(!apiKeyList[`${checkOwner['record']['owner']}`]) {
			apiKeyList[`${checkOwner['record']['owner']}`] = {
				apiKey: checkOwner['record']['key'],
				discordAccountID: `${interaction.member.id}`
			};
		}

		interaction.reply({ embeds: [
			new EmbedBuilder()
			.setTitle(`***API Token Added!***`)
			.setColor(`Purple`)
			.setDescription(`
			Your API Token is now added! thank you very much!`)
			]})

		fs.writeFileSync('./slashCommands/utils/apiKeyList.json', JSON.stringify(apiKeyList, null, 4), (err) => {
			if(err) console.log(err)
		  });
		

	}
};