import DiscordJS, {Intents} from 'discord.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import saveSchema from './save-schema'

dotenv.config()

const client = new DiscordJS.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	],
})

//reports to console when the bot is running
client.on('ready', async () => {
	console.log("The bot is running!");
	await mongoose.connect( process.env.MONGO_URI || '', { keepAlive: true} )
})

//when ever a user sends a message it scans for the desired trigger word
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


	if(sentMessage.includes(" 69 ")){
		message.react('🇳');
		message.react('🇮');
		message.react('🇨');
		message.react('🇪');
	}

	if(sentMessage.includes("21")){
		message.channel.send("https://tenor.com/view/21-gif-20187208");
	}

	if(sentMessage.startsWith("!save")){
		saveUserMessage(message);
	}else if(sentMessage.at(0) == "!"){
		sendUserMessage(message);
	}

	if(sentMessage.includes("!help")){
		sendHelpMessage(message);
	}

})

client.login(process.env.TOKEN)

function sendHelpMessage(message: DiscordJS.Message){
	message.channel.send("!save <command name> <your message>");
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
	let saveIdCreator = splitString[1];
	let sentence = "";

	saveSchema.findOne({saveId: saveIdCreator}).then((data) =>{
		if(data){
			console.log("A message should be sent to the server")
			message.channel.send("Sorry, the **"+ saveIdCreator +"**command name already exists. Try a different name.")
		}else{
			for (let index = 2; index < splitString.length; index++) {
				sentence += " " + splitString[index];
			}
		
			new saveSchema({
				saveId: saveIdCreator,
				message: sentence
			}).save()
		}
	});

}
