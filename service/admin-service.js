const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AdminService {
  async getAllUsers() {
    const selectFields = {
      id: true,
      name: true,
      surname: true,
      email: true,
      birthDate: true,
      role: true,
      _count: {
        select: {
          comments: true,
          posts: true,
        },
      },
    };

    return prisma.users.findMany({ select: selectFields });
  }
  async deleteUser(id) {
    return prisma.users.delete({
      where: { id },
    });
  }
  async editUserRole(userId, newRole) {
    return prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });
  }
}

module.exports = new AdminService();
