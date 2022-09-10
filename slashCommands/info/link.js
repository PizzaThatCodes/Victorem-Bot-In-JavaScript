const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'link',
	description: "quick tutorial on how to link your account",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
		interaction.reply({
			embeds: [
				new EmbedBuilder()
				.setTitle("Quick tutorial on how to link your Minecraft and Discord accounts for verification:")
				.setColor("Purple")
				.setDescription(`
				**1)** Type /profile in any lobby
    			**2)** Click on the blue head labeled \"Social Media\"
    			**3)** Left-click on the head labeled \"Discord\"
    			**4)** Type out your Discord username and tag (ex. **fingerbirdy#8056**)

    			https://media.discordapp.net/attachments/1002036959088234558/1002550236016816158/unknown.png
    			https://media.discordapp.net/attachments/1002036959088234558/1002550351657967666/unknown.png`)
			]
		})
	}
};