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
        location: {
            type: DataTypes.STRING,
            comment: '页面链接'
        },
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: '访问量'
        },
        min: {
            type: DataTypes.INTEGER,
            comment: '最小耗时'
        },
        min_id: {
            type: DataTypes.UUID,
            comment: '最小耗时id'
        },
        max: {
            type: DataTypes.INTEGER,
            comment: '最大耗时'
        },
        max_id: {
            type: DataTypes.UUID,
            comment: '最大耗时id'
        },
        average: {
            type: DataTypes.INTEGER,
            comment: '平均耗时'
        },
        average_id: {
            type: DataTypes.UUID,
            comment: '平均耗时id'
        },
        percent_90: {
            type: DataTypes.INTEGER,
            comment: '90%耗时'
        },
        percent_90_id: {
            type: DataTypes.UUID,
            comment: '90%耗时id'
        },
        percent_50: {
            type: DataTypes.INTEGER,
            comment: '50%耗时'
        },
        percent_50_id: {
            type: DataTypes.UUID,
            comment: '50%耗时id'
        },
        time_day: {
            type: DataTypes.DATEONLY,
            comment: '时间单元/天'
        },
        time_hour: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            comment: '时间单元/小时'
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        paranoid: true,
        underscored: true
    });

    Model.associate = (models) => {
        Model.belongsTo(models.web_client,
            {
                foreignKey: 'web_id',
                constraints: true,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        );
    };

    return Model;
};