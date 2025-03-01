const postQOTD = require("../../utils/postQOTD");
const { devOnly } = require("../misc/ping");

module.exports = {
    name: 'invoke_qotd',
    description: 'Forces an off-schedule qotd.',
    devOnly: true,
    callback: (client, interaction) => {
        //empty
    }
}