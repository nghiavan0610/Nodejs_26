const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const db = require('./config/db');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const route = require('./routes');


app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
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
// db.sequelize.sync({alter: true});

// Connect to db
db.connect();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
