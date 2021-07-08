const Literature = require('../models/literature');

module.exports.renderHomePage = (req, res) => {
    res.render('home');
};

module.exports.renderAboutMePage = (req, res) => {
    const genre = 'About Me';
    res.render('aboutme', {genre});
};

module.exports.renderNovels = async (req, res) => {
    const literatures = (await Literature.find({ genre: 'Novel' }).populate('image')).reverse();
    const genre = 'Novels';
    res.render('literature/index', { literatures, genre });
};

module.exports.renderTeenageYearsPoetry = async (req, res) => {
    const literatures = (await Literature.find({ genre: 'Poem (Youth)' }).populate('image')).reverse();
    const genre = 'Teenage Years Poetry';
    res.render('literature/index', { literatures, genre });
};

module.exports.renderFreeVersePoetry = async (req, res) => {
    const literatures = (await Literature.find({ genre: 'Poem' }).populate('image')).reverse();
    const genre = 'Free Verse Poetry';
    res.render('literature/index', { literatures, genre });
};

module.exports.renderHaikuPoetry = async (req, res) => {
    const literatures = (await Literature.find({ genre: 'Poem (Haiku)' }).populate('image')).reverse();
    const genre = 'Haiku Poems';
    res.render('literature/index', { literatures, genre });
};

module.exports.renderQuotes = async (req, res) => {
    const literatures = (await Literature.find({ genre: 'Quote' }).populate('image')).reverse();
    const genre = 'Inspirational Quotes';
    res.render('literature/index', { literatures, genre });
};

module.exports.renderWritingPrompts = async (req, res) => {
    const literatures = (await Literature.find({ genre: 'Writing Prompt' }).populate('image')).reverse();
    const genre = 'Writing Prompts';
    res.render('literature/index', { literatures, genre });
};