const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT,
    ()=>{console.log("server start!")}
);

const routes = [
  { path: '/users', routes: './src/routes/users' },
  { path: '/books', routes: './src/routes/books' },
  { path: '/likes', routes: './src/routes/likes' },
  { path: '/carts', routes: './src/routes/carts' },
  { path: '/orders', routes: './src/routes/orders'},
  { path: '/category', routes: './src/routes/category'}
];

routes.forEach(route => {
  const router = require(route.routes);
  app.use(route.path, router);
});
