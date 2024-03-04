import Article from "../models/Article.js"

export const create = async (req, res) => {
    try {
        const doc = new Article ({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const article = await doc.save();

        res.json(article);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create article',
        });
    };
};

export const getAll = async (req, res) => {
    try {
        const articles = await Article.find().populate('user').exec();

        res.json(articles)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get article',
        });
    };
};

export const getLastTags = async (req, res) => {
    try {
        const articles = await Article.find().populate('user').limit(5).exec();

        const tags = articles.map((obj) => obj.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get tags',
        });
    };
};

export const getOne = async (req, res) => {
    try {
        const articleId = req.params.id;
        
        const getOneArticle = await Article.findOneAndUpdate(
            {
                _id: articleId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                new: true, 
            }
        )
        .populate('user'); 

        if (!getOneArticle) {
            return res.status(404).json({
                message: 'Article not found',
            });
        }

        res.json(getOneArticle);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get article',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const articleId = req.params.id;

        const deletedArticle = await Article.findByIdAndDelete(articleId);

        if (!deletedArticle) {
            return res.status(404).json({
                message: 'Article not found',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to delete article',
        });
    }
};

export const update = async (req, res) => {
    try {
        const articleId = req.params.id;

        const updatedArticle = await Article.updateOne(
            {
                _id: articleId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.body.user,
                tags: req.body.tags,
            }
        );

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update article',
        });
    }
}

export const getTag = async (req, res) => {
    try {
        const tag = req.params.tag;
        const articles = await Article.find({ tags: tag }).populate('user').exec();
        res.json(articles);
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: 'Failed to get articles by tag',
        });
      }
}