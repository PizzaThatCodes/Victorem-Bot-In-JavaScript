const { EmbedBuilder } = require('discord.js');

const apiKeyList = require("./apiKeyList.json");

async function createEmbed(title, description, color, interactionSender) {
    // console.log(interactionSender.member.id);
    const footerMSG = "It looks like you haven't donated an API key! If you would like to help allow us to run these commands please add one by doing /donate-api-key.";
    var hasAddedKey = false;
    for(var info of Object.values(apiKeyList)) {
        if(info['discordAccountID'] === interactionSender.member.id) {
            hasAddedKey = true;
            break;
        }
    }
    if(hasAddedKey) {
        return new EmbedBuilder()
        .setTitle(`${title}`)
        .setColor(color)
        .setDescription(`${description}
        `);
    } else {
        return new EmbedBuilder()
        .setTitle(`${title}`)
        .setColor(color)
        .setDescription(`${description}
        `)
        .setFooter({text: footerMSG});
    }
}

module.exports = {
    createEmbed
}