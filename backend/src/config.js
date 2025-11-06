const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
  port: process.env.PORT || 5000,
  openaiApiKey: process.env.OPEN_API_KEY,
};

module.exports = config;
