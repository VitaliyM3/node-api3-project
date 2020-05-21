const express = require('express');

const userRouter = require('./users/userRouter.js'); //importing our users route
const postRouter = require('./posts/postRouter.js'); //importing our posts route

const server = express();

server.use(express.json());

server.use('/api/user', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method}
    to ${req.url} from ${req.get('origin')}`
  );
  next();
}

module.exports = server;
