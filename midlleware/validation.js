const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// this validation ensures that name, email and password exist
const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().alphanum().required(),
  }),
});

// this validation ensures that email and password exist
const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// this validation ensures that keyword, title, text, date, source, link, image and owner exist
const newArticleValidation = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateURL),
    image: Joi.string().required().custom(validateURL),
  }),
});

// this validation ensures that ID is exist
const articleIdValidation = celebrate({
  params: Joi.object().keys({
    article_id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  signUpValidation,
  signInValidation,
  newArticleValidation,
  articleIdValidation,
};
