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
        //node_id: {
        //    type: DataTypes.UUID,
        //    comment: 'node客户端ID'
        //},
        client_time: {
            type: DataTypes.DATE,
            comment: '客户端记录时间'
        },
        server_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: '服务端记录时间'
        },
        url: {
            type: DataTypes.STRING,
            comment: '页面链接'
        },
        message: {
            type: DataTypes.STRING,
            comment: '错误信息'
        },
        stack: {
            type: DataTypes.TEXT,
            comment: '错误堆栈'
        },
        host: {
            type: DataTypes.STRING,
            comment: '域名'
        },
        browser_name: {
            type: DataTypes.STRING,
            comment: '错误请求发起的浏览器名称'
        },
        browser_version: {
            type: DataTypes.STRING,
            comment: '错误请求发起的浏览器版本'
        },
        cookie: {
            type: DataTypes.STRING,
            comment: '错误请求的cookie'
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        paranoid: true,
        underscored: true
    });

    Model.associate = (models) => {
        Model.belongsTo(models.node_client,
            {
                foreignKey: 'node_id',
                constraints: true,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        )
    };

    return Model;
};