const router = require('express').Router();

const {
  returnSavedArticles,
  createNewArticle,
  deleteArticle,
} = require('../controllers/articles');

const { newArticleValidation, articleIdValidation } = require('../midlleware/validation');

router.get('/', returnSavedArticles);
router.post('/', newArticleValidation, createNewArticle);
router.delete('/:article_id', articleIdValidation, deleteArticle);

module.exports = router;
