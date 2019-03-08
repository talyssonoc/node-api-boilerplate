const {
  createLogger,
  format,
  transports,
} = require('winston');

require('winston-rocketchat-transport');

const {
  combine,
  timestamp,
  label,
  printf,
  json,
  colorize,
} = format;

let formatter;
let logger;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  formatter = combine(
    label({
      label: process.env.MACHINE_HOST || 'transaction',
    }),
    timestamp(),
    json(),
  );

  logger = createLogger({
    format: formatter,
    transports: [
      new transports.Console(),
      new transports.RocketChat({
        level: 'warn',
        webhook_url: process.env.ROCKET_CHAT_WEBHOOK_URL,
        custom_formatter: (level, message) => ({ text: `*WL_MS[transaction]*\n*${level.toUpperCase()}*: ${message}` }),
      }),
    ],
  });
} else {
  formatter = combine(
    timestamp(),
    colorize(),
    label({
      label: process.env.MACHINE_HOST || 'transaction',
    }),
    printf((i) => {
      const msg = JSON.stringify(i.message);
      const prefix = `${i.timestamp} [${i.label}] ${i.level}`;
      return `${prefix}: ${msg}`;
    }),
  );

  logger = createLogger({
    format: formatter,
    transports: [
      new transports.Console(),
    ],
  });
}

module.exports = {
  logger,
  stream: {
    write: (message) => {
      logger.info(JSON.parse(message));
    },
  },
};
