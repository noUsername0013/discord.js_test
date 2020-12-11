"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutes = exports.Users = void 0;
const sequelize_1 = require("sequelize");
const seq = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: './.database.sqlite',
    logging: false
});
class Users extends sequelize_1.Model {
}
exports.Users = Users;
class Mutes extends sequelize_1.Model {
}
exports.Mutes = Mutes;
Users.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    level: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    exp: {
        type: sequelize_1.DataTypes.FLOAT,
    },
}, {
    sequelize: seq,
    modelName: 'Users',
});
Mutes.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    tag: {
        type: sequelize_1.DataTypes.STRING
    },
    duration: {
        type: sequelize_1.DataTypes.FLOAT
    },
    reason: {
        type: sequelize_1.DataTypes.STRING,
    },
    expireDate: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: seq,
    modelName: 'Mutes',
});
Users.sync();
Mutes.sync();
