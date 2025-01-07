const {devs, testServer} = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) =>{
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try{
        const commandObject = localCommands.find((cmd => cmd.name === interaction.commandName));

        if(!commandObject) return;

        if(commandObject.devOnly){
            if(!devs.includes(interaction.member.id)){
                interaction.reply({
                    content: "Only developers can run this command.",
                    ephemeral: true,
                });
                return;
            }
        }

        await commandObject.callback(client, interaction);
    } catch (error){
        console.log(`There was an error running this command: ${error}.`);
    }
};