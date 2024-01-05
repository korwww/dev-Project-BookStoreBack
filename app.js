const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT,
    ()=>{console.log("server start!")}
);

const routes = [
  { path: '/users', routes: './routes/users' },
  { path: '/books', routes: './routes/books' },
  { path: '/likes', routes: './routes/likes' },
  { path: '/carts', routes: './routes/carts' },
  { path: '/orders', routes: './routes/orders'},
  { path: '/category', routes: './routes/category'}
];

routes.forEach(route => {
  const router = require(route.routes);
  app.use(route.path, router);
});
