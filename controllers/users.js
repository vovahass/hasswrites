const User = require('../models/user');


module.exports.renderRegistrationPage = (req, res) => {
    res.render('users/register');
};

module.exports.renderLoginPage = (req, res) => {
    res.render('users/login');
};

module.exports.createUser = async (req, res) => {
    try {
        const { username, email, name, textColor, commentBoxTheme, password } = req.body;
        const uniqueNumber = Math.floor(Math.random() * 1000); 
        const user = new User({ username, email, name, textColor, commentBoxTheme, uniqueNumber});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Hass Writes!');
            res.redirect('/');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderUserPage = async(req,res) => {
    const user = req.user;
    if (!user) {
        req.flash('error', 'No user currently logged in.');
        return res.redirect('/login');
    }
    res.render('users/user', {user});
};

module.exports.renderBannedList = async(req,res) => {
    const users = await User.find({ status: 'banned' });
    res.render('users/banned', { users });
}

module.exports.updateUser = async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new:true });
    await user.save();
    req.flash('success', 'User preferences updated!');
    res.redirect('/user');
};

module.exports.banUser = async (req,res,next) => {
    const literatureID = req.params.litID;
    const id = req.params.user;
    const user = await User.findById(id);
    if (user.status == "normal") {
        user.status = "banned";
        user.commentBoxTheme = 'light';
        user.textColor = 'black';
    }
    else {
        user.status = "normal";
    }
    await user.save();
    req.flash('success', 'User status updated.');
    res.redirect(`/literature/${literatureID}`);
};

module.exports.unbanUser = async(req,res,next) => {
    const id = req.params.user;
    const user = await User.findById(id);
    user.status = "normal";
    await user.save();
    req.flash('success', 'User status updated.');
    res.redirect('/user/banned');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/literature';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/literature');
};