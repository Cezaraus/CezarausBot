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

	if(sentMessage.startsWith("!save")){
		saveUserMessage(message);
	}else if(sentMessage.at(0) == "!"){
		sendUserMessage(message);
	}

	if(sentMessage.includes("!helpcommand")){
		sendHelpMessage(message);
	}

	if(sentMessage.includes("!testing")){
		console.log(message);
		let imageUrl = "";
		message.attachments.forEach(attachment => {
			imageUrl = attachment.url;
		})
		console.log(imageUrl);
		message.channel.send(imageUrl);
	}

	if(sentMessage.startsWith("!delete")){
		deleteUserMessage(message);
	}

})

client.login(process.env.TOKEN)

function deleteUserMessage(messageObj: DiscordJS.Message) {
	let sentMessage = messageObj.content.toLowerCase();
	let splitString =  sentMessage.split(" ");
	let saveIdCreator = splitString[1];

	saveSchema.findOne({saveId: saveIdCreator}).then((data) => {
		if(data){
			saveSchema.deleteOne({saveId: saveIdCreator}).then((result) =>{
				if(result){
					messageObj.channel.send("The **"+ saveIdCreator + "** command has been deleted.");
				}
			});
		}else{
			messageObj.channel.send("The **"+ saveIdCreator + "** command doesn't exists.")
		}
	});


}

function sendHelpMessage(message: DiscordJS.Message){
	message.channel.send("To create a command:\n```!save <command name> <your message> (attached image)```\nTo call a command use ```!<command name>```\nThis will make the bot repeat the saved message and image!");
}

function sendUserMessage(messageObj: DiscordJS.Message){
	let sentMessage = messageObj.content;
	let cutMessage  = sentMessage.substring(1);
	saveSchema.findOne({saveId: cutMessage}).then((data) =>{
		if(data){
			messageObj.channel.send(data.message);
			if(typeof(data.imageUrl) === 'string'){
				messageObj.channel.send(data.imageUrl);
			}
		}
	});
}

function saveUserMessage(message: DiscordJS.Message){
	let sentMessage = message.content.toLowerCase();
	let splitString =  sentMessage.split(" ");
	let saveIdCreator = splitString[1];
	let sentence = "‎";

	saveSchema.findOne({saveId: saveIdCreator}).then((data) =>{
		if(data){
			console.log("A message should be sent to the server")
			message.channel.send("Sorry, the **"+ saveIdCreator +"** command name already exists. Try a different name.")
		}else{
			for (let index = 2; index < splitString.length; index++) {
				sentence += " " + splitString[index];
			}
			
			if(checkAttachment(message)){
				new saveSchema({
					saveId: saveIdCreator,
					message: sentence,
					imageUrl: getAttachmentUrl(message)
				}).save()
			}else{
				new saveSchema({
					saveId: saveIdCreator,
					message: sentence,
				}).save()
			}
		}
	});
}

function checkAttachment(message: DiscordJS.Message) : boolean{
	return message.attachments.size > 0;
}

function getAttachmentUrl(message: DiscordJS.Message) : String{
	let imageUrl = "";
	message.attachments.forEach(attachment => {
		imageUrl = attachment.url;
	})
	return imageUrl;
}