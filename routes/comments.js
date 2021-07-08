const express = require('express');
const router = express.Router({mergeParams:true});

const catchAsync = require('../utils/catchAsync');
const { validateComment, isAdminOrCommenter, isLoggedIn } = require('../middleware');
const comments = require('../controllers/comments');


//COMMENTS
router.post('/', isLoggedIn, validateComment, catchAsync(comments.postComment));

router.delete('/:commentId', isLoggedIn, isAdminOrCommenter, catchAsync(comments.deleteComment));

module.exports = router;