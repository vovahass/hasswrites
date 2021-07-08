if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
};
const ExpressError = require('./utils/ExpressError');
const { literatureSchema, commentSchema, userSchema } = require('./schemas.js');
const Comment = require('./models/comment');

const admin = process.env.ADMIN;

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
};


module.exports.validateLiterature = (req, res, next) => {
    const { error } = literatureSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

// module.exports.validateUser = (req, res, next) => {
//     console.log(req.body)
//     const { error } = userSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400);
//     }
//     else {
//         next();
//     }
// };

module.exports.isAdmin = async (req, res, next) => {
    const { id } = req.params;
    if (id && (req.user.username != admin)) {
        req.flash('error', `You do not have permission to do that!`);
        return res.redirect(`/literature/${id}`);
    }
    else if ((req.user.username) != admin)
    {
        req.flash('error', `You do not have permission to do that!`);
        return res.redirect(`/literature`);
    }
    next();
};

module.exports.isAdminOrCommenter = async (req, res, next) => {
    const { id,commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if ((id && (req.user.username != admin)) && (!comment.username._id.equals(req.user._id))) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/literature/${id}`);
    }
    next();
};