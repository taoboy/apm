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
        user_agent: {
            type: DataTypes.STRING,
            comment: 'userAgent'
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
        location_href: {
            type: DataTypes.STRING,
            comment: '页面链接'
        },
        location_origin: {
            type: DataTypes.STRING,
            comment: '页面源地址'
        },
        location_host: {
            type: DataTypes.STRING,
            comment: '页面域名'
        },
        location_protocal: {
            type: DataTypes.ENUM('http', 'https'),
            defaultValue: 'http',
            comment: '页面协议'
        },
        exception_name: {
            type: DataTypes.STRING,
            comment: '异常name'
        },
        exception_msg: {
            type: DataTypes.STRING,
            comment: '异常msg'
        },
        exception_url: {
            type: DataTypes.STRING,
            comment: '异常路径'
        },
        exception_line: {
            type: DataTypes.INTEGER,
            comment: '异常行号',
            set(val) {
                if(typeof val !== "number")val = 0;
                this.setDataValue('exception_line', val);
            }
        },
        exception_col: {
            type: DataTypes.INTEGER,
            comment: '异常列号',
            set(val) {
                if(typeof val !== "number")val = 0;
                this.setDataValue('exception_col', val);
            }
        },
        exception_stack: {
            type: DataTypes.TEXT,
            comment: '异常信息'
        },
        geolocation_country: {
            type: DataTypes.STRING,
            comment: '国家'
        },
        geolocation_province: {
            type: DataTypes.STRING,
            comment: '省份'
        },
        geolocation_city: {
            type: DataTypes.STRING,
            comment: '城市'
        },
        client_OS: {
            type: DataTypes.STRING,
            comment: '浏览器操作系统'
        },
        client_mobile: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: '是否移动端'
        },
        client_name: {
            type: DataTypes.STRING,
            comment: '浏览器名称'
        },
        client_version: {
            type: DataTypes.STRING,
            comment: '浏览器版本号'
        },
        client_weixin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: '是否微信'
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
        Model.hasMany(models.web_logger, {
            foreignKey: 'exception_id',
            constraints: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return Model;
};