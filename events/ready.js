const { ActivityType } = require('discord.js');
const client = require('..');
const chalk = require('chalk');
const fs = require('fs');

client.on("ready", () => {
	const activities = [
		{ name: `Hypixel`, type: ActivityType.Playing },
		{ name: `Bedwars`, type: ActivityType.Playing },
		{ name: `The Bridge`, type: ActivityType.Playing },
		{ name: `Skywars`, type: ActivityType.Playing },
		{ name: `Pixel Party`, type: ActivityType.Playing },
		{ name: `Housing`, type: ActivityType.Playing },
	];
	const status = [
		'online',
		'dnd',
		'idle'
	];
	let i = 0;
	setInterval(() => {
		if(i >= activities.length) i = 0
		client.user.setActivity(activities[i])
		i++;
	}, 5000);

	let s = 0;
	setInterval(() => {
		if(s >= activities.length) s = 0
		client.user.setStatus(status[s])
		s++;
	}, 5000);
	console.log(chalk.red(`Logged in as ${client.user.tag}!`))

	setInterval(() => {
		var exemptList = require('../slashCommands/moderation/exempt-list.json');
		for(var users in exemptList) {
			if(exemptList[users].ExpireTime <= Math.round(new Date().getTime()/1000 * 1000)) {
				delete exemptList[users];
				fs.writeFileSync('./slashCommands/moderation/exempt-list.json', JSON.stringify(exemptList, null, 4), (err) => {
					if(err) console.log(err)
				  });
			}
		}
	}, 1000);

});