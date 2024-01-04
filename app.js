const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT,
    ()=>{console.log("server start!")}
    );

const routes = [
  { path: '/users', file: './routes/users' },
  { path: '/books', file: './routes/books' },
  { path: '/likes', file: './routes/likes' },
  { path: '/carts', file: './routes/carts' },
  { path: '/orders', file: './routes/orders'}
];

routes.forEach(route => {
  const router = require(route.file);
  app.use(route.path, router);
});
