/**
 * Created by lenovo on 2017/7/27.
 */
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define((__filename.substr(__dirname.length + 1)).split(".")[0], {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1
        },
        appid: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            comment: '监听的node客户端id'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '监听的node客户端名称'
        },
        struct: {
            type: DataTypes.ENUM('express', 'koa', 'koa2', 'other'),
            defaultValue: 'koa2',
            comment: '监听的node框架'
        },
        version: {
            type: DataTypes.STRING,
            comment: '监听的node 版本'
        },
        disable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: '添加时间'
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        paranoid: true,
        underscored: true
    });

    Model.associate = (models) => {
        Model.belongsTo(models.user, {
            foreignKey: 'user_id',
            constraints: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        Model.hasMany(models.node_error_page, {
            foreignKey: 'node_id',
            constraints: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        Model.hasMany(models.node_exception_page, {
            foreignKey: 'node_id',
            constraints: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    };

    Model.prototype.someMethod = () => {

    };

    return Model;
};