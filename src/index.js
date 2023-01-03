const path = require('path');
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const morgan = require('morgan');
const db = require('./config/db');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const route = require('./routes');
const configs = require('./config/env/index');

app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// HTTP logger
app.use(morgan('combined'));

// Cookie
app.use(cookieParser());

// Template engine
app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      multiply: (a, b) => a * b,
    },
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

// Route init
route(app);

// Sync models
// db.sequelize.drop();
// db.sequelize.sync({force: true});

// Connect to db
db.connect();

const PORT = configs.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
