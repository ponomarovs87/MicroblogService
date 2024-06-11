function calculateString(string) {
  let number = eval(string);
  if (isNaN(number)) {
    number = null;
  }
  return number;
}

module.exports = {
  client: {
    host: "http://localhost",
    port: process.env.CLIENT_PORT || 3001,
  },
  server: {
    host: "http://localhost",
    port: process.env.SERVER_PORT || 3000,
  },
  bcrypt: {
    salt: process.env.SALT || 3,
  },
  accessToken: {
    secret:
      process.env.JWT_ACCESS_SECRET || "jwtSecretStrong",
    expiresIn: "20m",
  },
  refreshToken: {
    secret:
      process.env.JWT_REFRESH_SECRET ||
      "jwtRefreshSecretStrong",
    expiresIn: "30d",
  },
  cookie: {
    refreshTokenMaxAge:
      calculateString(
        process.env.COOKIE_REFRESH_TOKEN_MAX_AGE
      ) || 30 * 24 * 60 * 60 * 1000,
  },
};
