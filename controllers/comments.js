const Literature = require('../models/literature');
const Comment = require('../models/comment');

module.exports.postComment = async (req, res) => {
    const {id} = req.params;
    const literature = await Literature.findById(id).populate('comments');
    const comment = new Comment(req.body.comment);
    if (literature.comments.length==0){
        comment.number = 1;
    }
    else {
        comment.number = literature.comments[0].number +1;
    }
    literature.comments.push({$each: [comment], $position:0});
    comment.username = req.user._id;
    await comment.save();
    await literature.save();
    req.flash('success', 'Comment Added!');
    res.redirect(`/literature/${literature._id}`);
};

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Literature.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment Removed.');
    res.redirect(`/literature/${id}`);
};