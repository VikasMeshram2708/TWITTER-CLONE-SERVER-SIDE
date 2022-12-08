const monk = require("monk");
const db = monk(process.env.MONGO_URI);

if (db) {
  console.log(`Connected to DB 🌎`);
} else {
  console.log(`Connection with DB Failed 🥺`);
}

module.exports = db;
