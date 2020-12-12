import { Sequelize, Model, DataTypes } from 'sequelize';

const seq = new Sequelize({
    dialect: 'sqlite',
    storage: './.database.sqlite',
    logging: false,
});

class Users extends Model {}
class Mutes extends Model {}
Users.init(
    {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        level: {
            type: DataTypes.FLOAT,
        },

        exp: {
            type: DataTypes.FLOAT,
        },
    },
    {
        sequelize: seq,
        modelName: 'Users',
    }
);
Mutes.init(
    {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        guildId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tag: {
            type: DataTypes.STRING,
        },
        duration: {
            type: DataTypes.INTEGER,
        },
        reason: {
            type: DataTypes.STRING,
        },
        expireDate: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize: seq,
        modelName: 'Mutes',
    }
);
Users.sync();
Mutes.sync();
export { Users, Mutes };
