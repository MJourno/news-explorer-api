const Article = require('../models/article');
const { ErrorHandler } = require('../errors/error');

const returnSavedArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({});
    res.status(200).send(articles);
    return articles;
  } catch (err) {
    console.log('Error happened in returnSavedArticles', err);
    return next(new ErrorHandler(500, 'Something went wrong'));
  }
};

const createNewArticle = async (req, res, next) => {
  console.log(req.user._id);
  const { keyword, title, text, date, source, link, image } = req.body;
  try {
    const newArticle = await Article.create({
      keyword: keyword,
      title: title,
      text: text,
      date: date,
      source: source,
      link: link,
      image: image,
      owner: req.user._id,
    });
    res.status(201).send(newArticle);
    return newArticle;
  } catch (err) {
    console.log('Error happened in createNewArticle', err);
    if (err.name === 'ValidationError') {
      return next(new ErrorHandler(400, `${err.name}: Not a valid user id`));
    }
    return next(new ErrorHandler(500, `${err.name}: Something went wrong`));
  }
};

const deleteArticle = async (req, res, next) => {
  const articleId = req.params.article_id;
  try {
    const articleById = await Article.findById(articleId);
    if (articleById === null) {
      return next(new ErrorHandler(404, 'Article ID not found'));
    }
    if (articleById.owner._id.toString() !== req.user._id) {
      return next(new ErrorHandler(403, 'you are not the article\'s owner'));
    }
    await Article.findByIdAndRemove(articleId);
    res.status(200).send({ message: `Article ID ${articleId} was deleted.` });
    return { message: `Article ID ${articleId} was deleted.` };
  } catch (err) {
    console.log('Error happened in deleteArticle', err);
    if (err.name === 'ValidationError') {
      return next(new ErrorHandler(400, `${err.name}: Not a valid user id`));
    }
    return next(new ErrorHandler(500, `${err.name}: Something went wrong`));
  }
};

module.exports = {
  returnSavedArticles: returnSavedArticles,
  createNewArticle: createNewArticle,
  deleteArticle: deleteArticle,
};