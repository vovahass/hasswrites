const mongoose = require('mongoose');
const Literature = require('../models/literature');
const someWork = require('./somework');

mongoose.connect('mongodb://localhost:27017/hass-writes', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Literature.deleteMany({});
    for (let i = 0; i < 4; i++) {
        const literature = new Literature({
            title: someWork[i].title,
            body: someWork[i].body,
            genre: someWork[i].genre,
            tags: someWork[i].tags
        });
        await literature.save();
    }

}

seedDB()
    .then(() => {
        mongoose.connection.close();
    });