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
        client_time: {
            type: DataTypes.DATE,
            comment: '客户端记录时间'
        },
        server_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: '服务端记录时间'
        },
        type: {
            type: DataTypes.STRING,
            comment: '日志类型(connect, catch, network)'
        },
        info: {
            type: DataTypes.TEXT,
            comment: '信息',
            get() {
                let obj = {}, strs = this.getDataValue('info').split("&");
                for(let i = 0; i < strs.length; i++) {
                    obj[strs[i].split("=")[0]] = strs[i].split("=")[1];
                }
                return obj;
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        paranoid: true,
        underscored: true
    });

    Model.associate = (models) => {
        Model.belongsTo(models.web_exception_page,
            {
                foreignKey: 'exception_id',
                constraints: true,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        );
        //Model.hasMany(models.web_logger_content, {
        //    foreignKey: 'content_id',
        //    constraints: true,
        //    onDelete: 'CASCADE',
        //    onUpdate: 'CASCADE'
        //});
    };

    return Model;
};