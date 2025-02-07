require('dotenv').config();
const {CronJob} = require('cron');
const {Client, IntentsBitField} = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const postQOTD = require('./utils/postQOTD');
const {MongoClient, ServerApiVersion} = require('mongodb');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const database = new MongoClient(process.env.DB_LINK, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.on('interactionCreate', (interaction) => {
    if(!interaction.isButton()) return;
    let question = interaction.message.content;
    const selection = interaction.customId;
    if(selection === "confirm"){
        postQOTD(client, question, true);
        interaction.reply(`${question} has been confirmed.`);
        interaction.message.delete();
    }
    else if(selection === "deny"){
        interaction.reply(`${question} has been denied.`);
        interaction.message.delete();
    }
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

const schedule = new CronJob('0 0 10 * * *', () =>{
    postQOTD(client, "Dummy", false, database);
});

schedule.start();

eventHandler(client);

client.login(process.env.TOKEN);