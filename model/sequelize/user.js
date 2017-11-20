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
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            comment: '登陆用户名'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '登陆密码'
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '昵称'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '邮箱'
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '手机'
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        paranoid: true,
        underscored: true
    });

    Model.associate = (models) => {
        Model.hasMany(models.node_client, {
            foreignKey: 'user_id',
            constraints: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    };

    Model.prototype.someMethod = () => {

    };

    Model.findOne({where: {username: "root"}}).then((user) => {
        if (!user) {
            const rootUser = {
                username: "root",
                password: "123456",
                nickname: "root",
                email: "root@yonyou.com",
                phone: "13911111111"
            };
            Model.create(rootUser).then((root)=>{
                if(root){
                    console.log("create root account success! username: root, password: 123456");
                }
            });
        }
    }, (err) => {
        console.error(err);
    });

    return Model;
};