require("dotenv").config();
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const ApiError = require("../exceptions/api-errors");

class PostService {
    async getAll() {

      return "getAll"
    }
    async add() {
      
      return "add"
    }
    async edit() {
      
      return "edit"
    }
    async delete() {
      
      return "edit"
    }
  }
  
  module.exports = new PostService();
  