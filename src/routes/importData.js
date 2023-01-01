const express = require('express');
const router = express.Router();
const User = require('../app/models/User');
const users = require('../config/db/usersData');
const Restaurant = require('../app/models/Restaurant');
const restaurants = require('../config/db/restaurantsData');
const Food = require('../app/models/Food');
const foods = require('../config/db/foodsData');
const Food_type = require('../app/models/Food_type');
const food_type = require('../config/db/food_typeData');

router.post('/', async (req, res) => {
  const importUser = await User.bulkCreate(users);
  const importRestaurant = await Restaurant.bulkCreate(restaurants);
  const importFood_type = await Food_type.bulkCreate(food_type);
  const importFood = await Food.bulkCreate(foods);
  res.json('Success');
});

module.exports = router;
