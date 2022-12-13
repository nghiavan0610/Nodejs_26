const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const db = require('./config/db');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const route = require('./routes');

const port = 3000;

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

// Connect to db
db.connect();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
