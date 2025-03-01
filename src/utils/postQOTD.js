module.exports = async (client, question, submit, database) => {
    await database.connect();
    
    const dbclient = database.db('QOTD');
    const postChannel = "1326235335516229655";
    const qd = dbclient.collection("Questions");
    const txt = {
        "question": question
    }

    if(submit){
        await qd.insertOne(txt);
    } else{
        let questiontopost = await qd.aggregate([
            { $sample: { size: 1 } },
        ]).toArray();
        if(questiontopost[0] == null){
            client.channels.cache.get(postChannel).send({
                content: "We have run out of questions, please submit some more!"
            });
            return;
        }
        await client.channels.cache.get(postChannel).send({
            content: `${JSON.stringify(questiontopost[0].question)}`
        });
        let query = {_id: questiontopost[0]._id};
        await qd.deleteOne(query);
    }

    await database.close();
};