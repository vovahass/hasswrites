const Literature = require('../models/literature');
const Image = require('../models/image');
const { cloudinary } = require('../cloudinary');

module.exports.renderMainPage = async (req, res) => {
    const literatures = (await Literature.find({ genre: { $ne: "Quote" } }).populate('image')).reverse();
    const quotes = (await Literature.find({ genre: 'Quote' })).reverse();
    const genre = 'All Literature';
    res.render('literature/index', { literatures, genre, quotes });
};

module.exports.renderNewForm = (req, res) => {
    res.render('literature/new');
};

module.exports.renderNewPart = async (req, res) => {
    const { id } = req.params;
    const literature = await Literature.findById(id);
    if (!literature) {
        req.flash('error', 'The literary work you were trying to reach is missing.');
        return res.redirect('/literature');
    }
    res.render('literature/newPart', { literature });
};

module.exports.renderTaggedLiterature = async (req, res) => {
    const { tag } = req.params;
    const literatures = (await Literature.find({ tags: tag }).populate('image')).reverse();
    if (literatures.length == 0) {
        req.flash('error', 'This tag seems to be empty.');
        return res.redirect('/literature');
    }
    genre = `Tag: ${tag}`;
    res.render('literature/index', { literatures, genre });
}

module.exports.renderTagList = async (req, res) => {
    let literatures = await Literature.find({});
    let tags = [];
    for (literature of literatures) {
        for (tag of literature.tags) {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        }
    }
    tags.sort();
    res.render('literature/tags', { tags });
}

module.exports.showLiterature = async (req, res) => {
    let { page } = req.params;
    if (!page) {
        page = 1;
    }
    try {
        const literature = await Literature.findById(req.params.id)
            .populate({ path: 'comments', populate: { path: 'username' } })
            .populate('image');
        if (!literature) {
            req.flash('error', 'The literary work you were trying to reach is missing.');
            return res.redirect('/literature');
        }
        res.render('literature/show', { literature, page });
    } catch (e) {
        req.flash('error', 'The page you were trying to reach is unavailable.');
        res.redirect('/literature');
    }
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const literature = await Literature.findById(id).populate('image');
    if (!literature) {
        req.flash('error', 'Literary work missing.');
        return res.redirect('/literature');
    }
    res.render('literature/edit', { literature });
};

module.exports.createLiterature = async (req, res, next) => {
    req.body.literature.tags = req.body.literature.tags.replace(/\s/g, '').split(",");
    const literature = new Literature(req.body.literature);
    if (req.file) {
        const image = new Image({ url: req.file.path, filename: req.file.filename });
        await image.save();
        literature.image = image;
    }
    else {
        literature.image = null;
    }
    await literature.save();
    //update previous part
    if (literature.previous_id !== '') {
        const previousLiterature = await Literature.findOneAndUpdate(literature.previous_id, { next_id: literature._id }, { returnOriginal: false });
    }
    req.flash('success', 'Literary work posted!');
    res.redirect(`/literature/${literature._id}`);
};

module.exports.updateLiterature = async (req, res, next) => {
    const { id } = req.params;
    req.body.literature.tags = req.body.literature.tags.replace(/\s/g, '').split(",");
    const literature = await Literature.findByIdAndUpdate(id, { ...req.body.literature }, { runValidators: true, new: true }).populate('image');
    if (req.file) {
        const image = new Image({ url: req.file.path, filename: req.file.filename });
        await image.save();
        if (literature.image !== null) {
            await cloudinary.uploader.destroy(literature.image.filename);
            await Image.findByIdAndDelete(literature.image._id);
        }
        literature.image = image;
    };
    if ((req.body.deleteImage) && (!req.file)) {
        await cloudinary.uploader.destroy(req.body.deleteImage);
        await Image.findOneAndDelete({ filename: req.body.deleteImage });
        literature.image = new Image({ url: '', filename: '' });
    };
    await literature.save();
    req.flash('success', 'Literary work updated!');
    res.redirect(`/literature/${literature._id}`);
};

module.exports.likeLiterature = async (req, res) => {
    const { id } = req.params;
    const literature = await Literature.findByIdAndUpdate(id, { $push: { likes: req.user._id } }, { new: true });
    await literature.save();
    // req.flash('success', `You liked ${literature.title}!`);
}
module.exports.unlikeLiterature = async (req, res) => {
    const { id } = req.params;
    const literature = await Literature.findByIdAndUpdate(id, { $pull: { likes: req.user._id } }, { new: true });
    await literature.save();
    // req.flash('success', `You unliked ${literature.title}!`);
}

module.exports.deleteLiterature = async (req, res) => {
    const { id } = req.params;
    const literature = await Literature.findById(id).populate('image');
    if (literature.image !== null) {
        await Image.findByIdAndDelete(literature.image._id);
        await cloudinary.uploader.destroy(literature.image.filename);
    }
    await Literature.findByIdAndDelete(id);
    req.flash('success', 'Literary work deleted!');
    res.redirect('/literature');
};

