const express = require('express');
const userdb = require('./userDb');
const postdb = require('../posts/postDb');

const router = express.Router();

router.post('/', (req, res) => {
  // do your magic!
  const body = req.body;
  if (!body.name) {
    res.status(400).json({ errorMessage: "Please provide a name for the user." });
  } else {
    userdb.insert(body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "There was an error while saving the user to the database" });
    });
  };
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const newPost = { ...req.body, user_id: req.params.id };
  postdb.insert(newPost)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error posting" })
  })
});

router.get('/', validateUser, (req, res) => {
  // do your magic!
  userdb.get(req.query)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error retrieving the users" });
  });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  userdb.getById(req.params.id)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error retrieving the user" });
  });
});

router.get('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const id = req.params.id;
  userdb.getUserPosts(id)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User posts not found" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error retrieving the user posts" });
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  userdb.remove(id)
  .then(user => {
    if (user) {
      res.status(200).json({ message: "The user was deleted" })
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ error: "The user could not be removed" })
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  const id = req.params.id;
  const body = req.body;
  userdb.update(id, body)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'The user could not be found' });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error updating the user" });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  userdb.getById(id)
  .then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" })
    }
  })
  .catch(error => {
    res.status(500).json({  message: 'Request failed', error})
  })
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: 'missing user data'})
  } else if (req.name) {
    res.status(400).json({ message: 'missing required name' })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: 'missing post data'})
  } else if (req.text) {
    res.status(400).json({ message: 'missing required text field' })
  } else {
    next();
  }
}

module.exports = router;
