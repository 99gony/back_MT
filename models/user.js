const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          unique: true,
        },
        password: {
          type: Sequelize.STRING(100),
        },
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(60),
        },
        nickname: {
          type: Sequelize.STRING(7),
        },
        mbti: {
          type: Sequelize.STRING(4),
        },
        gender: {
          type: Sequelize.STRING(5),
        },
        character: {
          type: Sequelize.STRING(20),
        },
        token: {
          type: Sequelize.STRING(255),
        },
      },
      {
        sequelize,
        modelName: "User",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.User.belongsToMany(db.User, { through: "Friends", as: "Friend" });
  }
};
