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
    salt: process.env.SALT || 3
  }
  
};
