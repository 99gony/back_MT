const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(100),
        },
        nickname: {
          type: Sequelize.STRING(7),
          allowNull: false,
        },
        mbti: {
          type: Sequelize.STRING(4),
          allowNull: false,
        },
        gender: {
          type: Sequelize.STRING(5),
          allowNull: false,
        },
        character: {
          type: Sequelize.STRING(20),
          allowNull: false,
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
