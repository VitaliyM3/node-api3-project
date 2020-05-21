const express = require('express');
const postdb = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  postdb.get(req.query)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'Error getting posts' });
  })
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  postdb.getById(req.params.id)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error retrieving the post" });
  });
});

router.delete('/:id', (req, res) => {
  // do your magic!
  const id = req.params.id;
  postdb.remove(id)
  .then(post => {
    if (post) {
      res.status(200).json({ message: "The post was deleted" })
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ error: "The post could not be removed" })
  })
});

router.put('/:id', (req, res) => {
  // do your magic!
  const id = req.params.id;
  const body = req.body;
  postdb.update(id, body)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'The post could not be found' });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error updating the post" });
  });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  postdb.getById(id)
  .then(post => {
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(400).json({ message: "invalid post id" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: 'Request failed', error });
  })
}

module.exports = router;
