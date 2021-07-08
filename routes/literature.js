const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { validateLiterature, isAdmin, isLoggedIn } = require('../middleware');
const literature = require('../controllers/literature');

const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(literature.renderMainPage))
    .post(isLoggedIn, isAdmin, upload.single('image'), validateLiterature, catchAsync(literature.createLiterature));

router.get('/tags', catchAsync(literature.renderTagList));

router.get('/tags/:tag', catchAsync(literature.renderTaggedLiterature));

router.get('/new', isLoggedIn, isAdmin, literature.renderNewForm);

router.get('/new/:id', isLoggedIn, isAdmin, catchAsync(literature.renderNewPart));

router.route('/:id')
    .get(catchAsync(literature.showLiterature))
    .put(isLoggedIn, isAdmin, upload.single('image'), validateLiterature, catchAsync(literature.updateLiterature))
    .delete(isLoggedIn, isAdmin, catchAsync(literature.deleteLiterature));

router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(literature.renderEditForm));

router.put('/:id/like', isLoggedIn, catchAsync(literature.likeLiterature));
router.put('/:id/unlike', isLoggedIn, catchAsync(literature.unlikeLiterature));

router.get('/:id/:page', catchAsync(literature.showLiterature));

module.exports = router;