import DiscordJS, {Intents} from 'discord.js'
//import WOKCommands from 'wokcommands'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
//import path from 'path'

import saveSchema from './save-schema'

dotenv.config()

const client = new DiscordJS.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	],
})

client.on('ready', async () => {
	console.log("The bot is running!");
	await mongoose.connect( process.env.MONGO_URI || '', { keepAlive: true} )


	// new WOKCommands(client, {
	// 	commandsDir: path.join(__dirname, '../commands'),
	// 	typeScript: true,
	// 	mongoUri: process.env.MONGO_URI
	// })

	// setTimeout(async () => {
	// 	await new testSchema({
	// 		message: 'hello world'
	// 	}).save()
	// }, 1000)
})

client.on('messageCreate', (message) => {

	//Ignore the bot's message asap
	if(message.author.id == "325127234996404224") { 
		return 
	};

	//Preprocessors
	let user = message.author.id;	//get user id
	let sentMessage = message.content.toLowerCase(); //force message to lowercase and saves the message

	if(sentMessage.includes("fuck")){
		message.channel.send( "Fuck you, <@" + user +">" );
	}

	if(sentMessage.includes("bababooey")){
		message.react('🅱️');
		message.react('🅰️');
		message.react('🇧');
		message.react('🆎');
		message.react('🇴');
		message.react('🅾️');
		message.react('🇪');
		message.react('🇾');
	}

	if(sentMessage.includes("!chance")){
		let randNum = Math.random()*100;
		message.channel.send(randNum + "%");
	}

	// if(sentMessage.includes("325127234996404224")){
	// 	message.channel.send("What do you want, <@" + user +">")
	// }

	if(sentMessage.includes("69")){
		message.react('🇳');
		message.react('🇮');
		message.react('🇨');
		message.react('🇪');
	}

	if(sentMessage.includes("21")){
		message.channel.send("https://tenor.com/view/21-gif-20187208");
	}

	if(sentMessage.includes("!save")){
		saveUserMessage(message);
	}else if (sentMessage.at(0) == "!"){
		sendUserMessage(message);
	}

	if(sentMessage.includes("!help")){
		sendHelpMessage(message);
	}

})

client.login(process.env.TOKEN)

function sendHelpMessage(message: DiscordJS.Message){

}

function sendUserMessage(messageObj: DiscordJS.Message){
	let sentMessage = messageObj.content;
	let cutMessage  = sentMessage.substring(1);
	saveSchema.findOne({saveId: cutMessage}).then((data) =>{
		if(data){
			messageObj.channel.send(data.message);
		}
	});

}

function saveUserMessage(message: DiscordJS.Message){
	let sentMessage = message.content.toLowerCase();
	let splitString =  sentMessage.split(" ");
	let sentence = "";

	for (let index = 2; index < splitString.length; index++) {
		sentence += " " + splitString[index];
	}

	new saveSchema({
		saveId: splitString[1],
		message: sentence
	}).save()

}