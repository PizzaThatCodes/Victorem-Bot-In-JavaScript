const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'adminhelp',
	description: "Admin help menu with all the commands.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	default_member_permissions: 'Administrator',
	run: async (client, interaction) => {
		interaction.reply({
			embeds: [
				new EmbedBuilder()
				.setTitle("Admin Help Menu")
				.setColor("Purple")
				.setDescription(`
				**grantkey** [discord_user_id, minecraft_ign]: grants a link bypass key to a member`)
			]
		})
	}
};