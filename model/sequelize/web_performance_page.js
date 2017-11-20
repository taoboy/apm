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
        timing_redirect: {
            type: DataTypes.INTEGER,
            comment: '重定向时间'
        },
        timing_dns: {
            type: DataTypes.INTEGER,
            comment: 'DNS解析时间'
        },
        timing_tcp: {
            type: DataTypes.INTEGER,
            comment: 'TCP完成握手时间'
        },
        timing_http: {
            type: DataTypes.INTEGER,
            comment: 'HTTP请求响应完成时间'
        },
        timing_domPre: {
            type: DataTypes.INTEGER,
            comment: 'DOM开始加载前所花费时间'
        },
        timing_domComplete: {
            type: DataTypes.INTEGER,
            comment: 'domComplete'
        },
        timing_domAfter: {
            type: DataTypes.INTEGER,
            comment: 'DOM结构解析完成时间'
        },
        timing_script: {
            type: DataTypes.INTEGER,
            comment: '脚本加载时间'
        },
        timing_loadEvent: {
            type: DataTypes.INTEGER,
            comment: 'onload事件时间'
        },
        timing_all: {
            type: DataTypes.INTEGER,
            comment: '页面完全加载时间'
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
        Model.hasMany(models.web_performance_page_entries, {
            foreignKey: 'performance_id',
            constraints: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    };

    return Model;
};