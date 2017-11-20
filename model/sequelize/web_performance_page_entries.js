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
        connect: {
            type: DataTypes.INTEGER,
            comment: 'TCP 建立连接完成握手的时间'
        },
        duration: {
            type: DataTypes.INTEGER,
            comment: '下载耗时'
        },
        lookup_domain: {
            type: DataTypes.INTEGER,
            comment: 'DNS 查询时间'
        },
        redirect: {
            type: DataTypes.INTEGER,
            comment: '重定向的时间'
        },
        request: {
            type: DataTypes.INTEGER,
            comment: '内容加载完成的时间'
        },
        name: {
            type: DataTypes.STRING(2000),
            comment: '引入名称'
        },
        entry_type: {
            type: DataTypes.STRING,
            comment: '引入类型'
        },
        initiator_type: {
            type: DataTypes.STRING,
            comment: '资源类型'
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        paranoid: true,
        underscored: true
    });

    Model.associate = (models) => {
        Model.belongsTo(models.web_performance_page, {foreignKey: 'performance_id', constraints: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    };

    return Model;
};