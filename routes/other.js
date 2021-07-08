const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const other = require('../controllers/other');

//HOME
router.get('/', other.renderHomePage);

//ABOUT ME
router.get('/aboutme', other.renderAboutMePage);

//NOVELS
router.get('/novels', catchAsync(other.renderNovels));

//OLDPOETRY
router.get('/teenageYears', catchAsync(other.renderTeenageYearsPoetry));

//NEWPOETRY
router.get('/freeverse', catchAsync(other.renderFreeVersePoetry));

//HAIKU
router.get('/haiku', catchAsync(other.renderHaikuPoetry));

//QUOTES
router.get('/quotes', catchAsync(other.renderQuotes));

//WRITINGPROMPTS
router.get('/writingprompts', catchAsync(other.renderWritingPrompts));

module.exports = router;