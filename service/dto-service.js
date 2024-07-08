class DtoService {
  clearUserData(userData) {
    const { id, surname, name } = userData;
    return {
      id,
      surname,
      name,
    };
  }
}
module.exports = new DtoService();
