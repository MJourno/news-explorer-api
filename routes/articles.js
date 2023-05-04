const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  returnSavedArticles,
  createNewArticle,
  deleteArticle,
} = require('../controllers/articles');

router.get('/', returnSavedArticles);
router.post('/', createNewArticle);
router.delete(
  '/:article._id',
  celebrate({
    params: Joi.object().keys({
      article_id: Joi.string().hex().length(24),
    }),
  }),
  deleteArticle,
);

module.exports = router;
