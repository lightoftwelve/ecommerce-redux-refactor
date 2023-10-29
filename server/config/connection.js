require("dotenv").config();
const { connect, connection } = require("mongoose");

const connectionString = process.env.MONGODB_URI;

connect(connectionString);

module.exports = connection;
