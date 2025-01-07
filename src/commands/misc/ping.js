module.exports = {
    name: 'ping',
    description: 'Submits a question of the day to the mod team.',
    devOnly: true,
    callback: (client, interaction) => {
        interaction.reply('I AM HERE!');
    }
}