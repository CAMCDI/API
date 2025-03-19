const fs = require('fs');
const { LOG_FILE } = require('./config');

const logEvent = (message) => {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFile(LOG_FILE, logMessage, (err) => {
    if (err) throw err;
    console.log('Evento registrado en el log');
  });
};

module.exports = { logEvent };
