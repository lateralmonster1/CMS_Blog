const router = require('express').Router();
const { Post } = require('../models');
const withAuth = require('../middleware/auth');

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });
    res.render('dashboard', { posts, loggedIn: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/post', withAuth, async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/post/:id', withAuth, async (req, res) => {
  try {
    const [updated] = await Post.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!updated) {
      res.status(404).end();
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/post/:id', withAuth, async (req, res) => {
  try {
    const deleted = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!deleted) {
      res.status(404).end();
    }
    res.json(deleted);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
