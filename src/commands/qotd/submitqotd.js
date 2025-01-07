const {ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');

module.exports = {
    name: 'submit_qotd',
    description: 'Submits a question of the day to the mod team.',
    options: [
        {
            name: 'question',
            description: 'The question to be submitted',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    callback: (client, interaction) => {
        
            const voteChannel = "1324000082546135151"; ///Change this when implementing in main server.
            
            if(interaction.commandName === 'submit_qotd'){
                const question = interaction.options.get('question')?.value;
                interaction.reply(`You have submitted: "${question}" as a QOTD.`);
        
                const confirm = new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Primary);
                
                const deny = new ButtonBuilder()
                    .setCustomId('deny')
                    .setLabel('Deny')
                    .setStyle(ButtonStyle.Primary);
                
                const row = new ActionRowBuilder()
                    .addComponents(confirm, deny);
                
                client.channels.cache.get(voteChannel).send({
                    content: `"${question}"`,
                    components: [row],
                });
            }
    }
}