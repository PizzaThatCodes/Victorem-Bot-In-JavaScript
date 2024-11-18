const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

const { createEmbed } = require('../utils/ConfigStuff.js');

module.exports = {
	name: 'help',
	description: "help menu with all the commands.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
		interaction.reply({
			embeds: [
				await createEmbed("Help Menu",
				`
				**/help**: prints this page
				**/link**: prints how to link your Minecraft and Discord accounts
				**/myposition** [optional IGN]: prints your position in weekly GEXP leaderboard
				**/verify** [IGN]: gives you all the roles you qualify for`,
				"Purple",
				interaction)
			]
		})
	}
};