const importDataRouter = require('./importData');
const authRouter = require('./auth');
const manageRouter = require('./manage');
const restaurantsRouter = require('./restaurants');
const usersRouter = require('./users');
const profileRouter = require('./profile');
const actionRouter = require('./action');
const cartRouter = require('./cart');

const { notFound, errorHandler } = require('../helpers/Errors');

function route(app) {
  app.use('/import', importDataRouter);

  app.use('/restaurants', restaurantsRouter);
  app.use('/profile', profileRouter);
  app.use('/users', usersRouter);
  app.use('/manage', manageRouter);

  app.use('/action', actionRouter);
  app.use('/cart', cartRouter);

  app.use('/', authRouter);

  app.use(errorHandler);
  app.use(notFound);
}

module.exports = route;
