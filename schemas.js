const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.literatureSchema = Joi.object({
    literature: Joi.object({
        title: Joi.string().required().escapeHTML(),
        body: Joi.string().required().escapeHTML(),
        notes: Joi.string().empty('').default('').escapeHTML(),
        genre: Joi.valid('Poem', 'Poem (Youth)', 'Poem (Haiku)', 'Quote', 'Writing Prompt', 'Novel', 'Other').required(),
        quoteBy: Joi.string().empty('').default('').escapeHTML(),
        tags: Joi.string().required().escapeHTML(),
        part: Joi.number().default(1),
        previous_id: Joi.string().empty('').default('').escapeHTML(),
        next_id: Joi.string().empty('').default('').escapeHTML(),
        likes: Joi.number().default(0),
        updatedAt: Joi.date(),
        imageCredit: Joi.string().empty('').default('').escapeHTML()
    }).required(),
    deleteImage: Joi.string()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().min(1).max(500).required().escapeHTML()
    }).required()
});


// module.exports.userSchema = Joi.object({
//     user: Joi.object({
//         username: Joi.string().alphanum().min(4).max(20).lowercase().escapeHTML().required(),
//         email: Joi.string().email().required().escapeHTML(),
//         name: Joi.string().required().escapeHTML(),
//         textColor: Joi.string().required(),
//         commentBoxTheme: Joi.valid('light', 'dark').required(),
//         password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().escapeHTML()
//         // repeat_password: Joi.ref('password')
//     }).required()
// });
