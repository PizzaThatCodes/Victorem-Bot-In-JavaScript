const fs = require('fs');
const fetch = require('node-fetch');

async function getAPIKey() {
 return "fba399b8-2dc3-4137-ac5c-8c33664b4211";
//    var key = "";
//    var APIKeyList = require('../utils/apiKeyList.json');
//
//    let entries = Object.entries(APIKeyList);
//    entries = entries.map(([id, { apiKey, discordAccountID}], idb) => `${apiKey}`);
//
//    for(var keys of entries) {
//        var checkKey = await fetch(`https://api.hypixel.net/key?key=${keys}`).then(res => res.json());
//
//        if(checkKey['cause'] && checkKey['cause'] === 'Invalid API key') {
//            Object.keys(APIKeyList).forEach(theKey => {
//                if(APIKeyList[theKey].apiKey === keys) {
//                    delete APIKeyList[theKey];
//                }
//            })
//			continue;
//		}
//
//        
//		if(checkKey['cause'] && checkKey['cause'] === 'Key throttle') {
//			continue;
//		}
//
//        console.log(`Key Currently Has Used ${checkKey['record']['queriesInPastMin']} Checks`)
//
//        if(checkKey['record']['queriesInPastMin'] === 118) {
//            continue;
//        }
//
//        fs.writeFileSync('./slashCommands/utils/apiKeyList.json', JSON.stringify(APIKeyList, null, 4), (err) => {
//			if(err) console.log(err)
//		  });
//
//        key = `${keys}`;
//        break;
//
//    }
//
//    return key;

}

module.exports = {
    getAPIKey
}