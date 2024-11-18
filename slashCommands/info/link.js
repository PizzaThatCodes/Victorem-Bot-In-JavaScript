const { ApplicationCommandType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const { createEmbed } = require('../utils/ConfigStuff.js');

module.exports = {
	name: 'link',
	description: "quick tutorial on how to link your account",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {

		const link1 = fs.readFileSync('./link-1.png')
		const link2 = fs.readFileSync('./link-2.png')

		const attachment1 = new AttachmentBuilder(link1)
		const attachment2 = new AttachmentBuilder(link2)

		interaction.reply({
			embeds: [
				await createEmbed("Quick tutorial on how to link your Minecraft and Discord accounts for verification:",
				`
				**1)** Type /profile in any lobby
    			**2)** Click on the blue head labeled \"Social Media\"
    			**3)** Left-click on the head labeled \"Discord\"
    			**4)** Type out your Discord username and tag (ex. **fingerbirdy#8056**)`,
				'Purple',
				interaction)
			]
		}).then(() => {
			interaction.channel.send({files: [attachment1, attachment2]});
		})
	}
};