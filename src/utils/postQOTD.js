var questionArray = [];

module.exports = (client, question, submit) => {
    const postChannel = "1325891691319918692"; ///Change this when implementing in main server.

    if(submit){
        questionArray.push(question);
    } else{
        let ranNum = Math.floor(Math.random() * questionArray.length);
        if(questionArray.length === 0){
            client.channels.cache.get(postChannel).send({
                content: 'We have run out of questions... Please submit some more!'
            })
            return;
        }

        client.channels.cache.get(postChannel).send({
            content: `${questionArray.splice(ranNum, 1)}`
        });
    }
};