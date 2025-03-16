require('dotenv').config();
const {CronJob} = require('cron');
const {Client, IntentsBitField} = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const postQOTD = require('./utils/postQOTD');
const {MongoClient, ServerApiVersion} = require('mongodb');

const database = new MongoClient(process.env.DB_LINK, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
    "database" : database
});

//Connects to MongoDB
async function run() {
    try{
        await database.connect();
        await database.db("admin").command({ping: 1});
        console.log("Pinged the database. Successfully connected!")
    }
    finally{
        await database.close();
    }
    
}

const schedule = new CronJob('0 0 8 * * *', () =>{
    postQOTD(client, "Dummy", false, database);
});

schedule.start();

run();

eventHandler(client);

client.login(process.env.TOKEN);

//Handles QOTD rejections and approvals
client.on('interactionCreate', (interaction) => {
    if(interaction.isCommand()){
        let name = interaction.commandName;
        if(name == "invoke_qotd"){
            postQOTD(client, "Dummy", false, database);
            interaction.reply('Forcing an off-schedule QOTD.');
        }
    }

    if(!interaction.isButton()) return;
    let question = interaction.message.content;
    const selection = interaction.customId;
    if(selection === "confirm"){
        postQOTD(client, question, true, database);
        interaction.reply(`${question} has been confirmed.`);
        interaction.message.delete();
    }
    else if(selection === "deny"){
        interaction.reply(`${question} has been denied.`);
        interaction.message.delete();
    }
});

function getDatabase(){
    return database;
}