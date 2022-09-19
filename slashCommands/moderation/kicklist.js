const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch');
const chalk = require('chalk');

var NETWORKLEVELREQ = 25;
var OFFLINETHRESHOLD = 14;
var GUILDNAME = "Victorem";

var { getAPIKey } = require('../utils/APISwapper.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	name: 'kicklist',
	description: "See which members need to be kicked from the guild",
	cooldown: 30000,
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
	 
        const { options } = interaction;

        let apiKey = await getAPIKey();

            let guild = await fetch(`https://api.hypixel.net/guild?name=${GUILDNAME}&key=${apiKey}`)
            .then(res => res.json());



            if(guild.status && guild.status != 200) {
              interaction.reply({ embeds: [
                new EmbedBuilder()
                .setTitle(`***${GUILDNAME} Kick List***`)
                .setColor(`Purple`)
                .setDescription(`
                ***Error occured while trying...***
                Unable to connect to the API. Try again later.`)
                ]})
              return;
            }


            if(guild['success'] == false) {
              interaction.reply({ embeds: [
                new EmbedBuilder()
                .setTitle(`***${GUILDNAME} Kick List***`)
                .setColor(`Purple`)
                .setDescription(`
                ***Error occured while trying...***
                Something went wrong; check the spelling of the guild name an validity of the API key.`)
                ]})
              return;
            }


            var members = {};
            var memberList = [];
            var warningmessagelist = [];
            var kickmessagelist = [];
            var failedToGrabInfo = [];
            var dontKickCauseOG = [];

                for(var member of guild['guild']['members']) {
                    members[member['uuid']] = {}
                    memberList.push(member['uuid'])

                    if(member['joined'] < 1622523600000) {
                      dontKickCauseOG.push(member['uuid']);
                    }
                }

                var memberscounted = 0;
                var unixtime = Math.round(new Date().getTime()/1000 * 1000)

                var { filledBar } = require('string-progressbar');
                var bar = filledBar(memberList.length, memberscounted, 20);

                if(memberscounted === 0) {
                interaction.reply({ embeds: [
                  new EmbedBuilder()
                  .setTitle(`***${GUILDNAME} Kick List***`)
                  .setColor(`Purple`)
                  .setDescription(`
                  **Current Progress**
                        ${bar[0]} (${Math.round(bar[1])}%)
                        
                  **Player Warnings:**
                  
                  **Players who need to be kicked:**
                  `)
                  ]})
                }

                for(var uuid of memberList) {

                  var exemptList = require(`../moderation/exempt-list.json`);

                  if(Object.keys(exemptList).includes(uuid)) {
                    continue;
                  }
                  
                  
                  if(dontKickCauseOG.includes(uuid)) {
                    console.log(uuid);
                    continue;
                  }

                    await sleep(250);

                    
                        memberscounted += 1;

                        bar = filledBar(memberList.length, memberscounted, 20);

                        let member = await fetch(`https://api.hypixel.net/player?uuid=${uuid}&key=${apiKey}`)
                        .then(res => res.json());

                        if(member.status && member.status != 200) {

                          failedToGrabInfo.push(`Failed to fetch data. UUID = ${uuid}`);
                          continue;
                        }

                        member = member['player'];


                        try {
                          members[uuid]['ign'] = member['displayname']
                        } catch(err) {
                          members[uuid]['ign'] = null;
                        }

                        try {
                          members[uuid]['lastLogin'] = member['lastLogin']
                        } catch(err) {
                          members[uuid]['lastLogin'] = null;
                        }

                        try {
                          members[uuid]['exp'] = member['networkExp']
                        } catch(err) {
                          members[uuid]['exp'] = null;
                        }


                        if(members[uuid]['lastLogin'] != null) {
                            members[uuid]['daysOffline'] = (unixtime - members[uuid]['lastLogin']) / 1000 / 60 / 60 / 24;
                        } else
                            members[uuid]['daysOffline'] = null;
                        if(members[uuid]['exp'] != null)
                            members[uuid]['networkLevel'] = Math.round(((Math.sqrt((2 * members[uuid]['exp']) + 30625) / 50) - 2.5), 2);
                        else
                            members[uuid]['networkLevel'] = null;

                        


                        if(members[uuid]['daysOffline'] == null)
                          warningmessagelist.push(`⚠️ Unable to calculate when ***${members[uuid]['ign']}*** was last online.`);
                        else if(members[uuid]['daysOffline'] >= OFFLINETHRESHOLD)
                          kickmessagelist.push(`🚫 ***${members[uuid]['ign']}*** has been offline for ***${Math.round(members[uuid]['daysOffline'])}*** days.`)

                        if(members[uuid]['networkLevel'] == null)
                          warningmessagelist.push(`⚠️ Unable to calculate ${members[uuid]['ign']}'s network level.`)
                        else if(members[uuid]['networkLevel'] < NETWORKLEVELREQ)
                          kickmessagelist.push(`🚫 ***${members[uuid]['ign']}*** has a network level of ***${members[uuid]['networkLevel']}***.`)


                    if(memberscounted % 3 == 0) {

                      if(failedToGrabInfo.length == 0) {
                        interaction.editReply({ embeds: [
                          new EmbedBuilder()
                          .setTitle(`***${GUILDNAME} Kick List***`)
                          .setColor(`Purple`)
                          .setDescription(`
                          **Current Progress**
                          ${bar[0]} (${Math.round(bar[1])}%)

                          **Player Warnings:**
                          ${warningmessagelist.join('\n')}
                          
                          **Players who need to be kicked:**
                          ${kickmessagelist.join(`\n`)}`)
                        ]})
                      } else {
                        interaction.editReply({ embeds: [
                          new EmbedBuilder()
                          .setTitle(`***${GUILDNAME} Kick List***`)
                          .setColor(`Purple`)
                          .setDescription(`
                          **Current Progress**
                          ${bar[0]} (${Math.round(bar[1])}%)

                          **UUID's that failed to fetch data from:**
                          ${failedToGrabInfo.join('\n')}
      
                          **Player Warnings:**
                          ${warningmessagelist.join('\n')}
                          
                          **Players who need to be kicked:**
                          ${kickmessagelist.join(`\n`)}`)
                        ]})
                      }

                  }

                }

                if(failedToGrabInfo.length == 0) {
                  interaction.editReply({ embeds: [
                    new EmbedBuilder()
                    .setTitle(`***${GUILDNAME} Kick List***`)
                    .setColor(`Purple`)
                    .setDescription(`
                    **Player Warnings:**
                    ${warningmessagelist.join('\n')}
                    
                    **Players who need to be kicked:**
                    ${kickmessagelist.join(`\n`)}`)
                  ]})
                } else {
                  interaction.editReply({ embeds: [
                    new EmbedBuilder()
                    .setTitle(`***${GUILDNAME} Kick List***`)
                    .setColor(`Purple`)
                    .setDescription(`
                    **UUID's that failed to fetch data from:**
                    ${failedToGrabInfo.join('\n')}

                    **Player Warnings:**
                    ${warningmessagelist.join('\n')}
                    
                    **Players who need to be kicked:**
                    ${kickmessagelist.join(`\n`)}`)
                  ]})
                }

    }
};
