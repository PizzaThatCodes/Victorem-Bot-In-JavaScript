const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'help',
	description: "help menu with all the commands.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
		interaction.reply({
			embeds: [
				new EmbedBuilder()
				.setTitle("Help Menu")
				.setColor("Purple")
				.setDescription(`
				**/help**: prints this page
				**/link**: prints how to link your Minecraft and Discord accounts
				**/myposition** [optional IGN]: prints your position in weekly GEXP leaderboard
				**/verify** [IGN]: gives you all the roles you qualify for`)
			]
		})
	}
};