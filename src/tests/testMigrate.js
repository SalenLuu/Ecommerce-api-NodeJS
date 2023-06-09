const sequelize = require("../utils/connection");
require("../models/User");
require("../models/Product");
require("../models/Category");
require("../models/Cart");
require("../models");

const User = require("../models/User");

const main = async () => {
  try {
    await sequelize.sync({ force: true });

    await User.create({
      firstName: "testUser",
      lastName: "testUser",
      email: "testuser@gmail.com",
      password: "testuser1234",
      phone: "123456789",
    });

    process.exit();
  } catch (error) {
    console.log(error);
  }
};

main();
