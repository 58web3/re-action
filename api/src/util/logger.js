const log4js = require("log4js");
const logger = log4js.getLogger('API');
logger.level = process.env.LOGGER_LEVEL || "error";
logger.level = 'info'

module.exports = logger;
