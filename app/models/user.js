const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true
    }
  );

  User.associate = function(models) {
    // associations can be defined here
  };

  User.createModel = user => {
    return User.create(user).catch(error => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw errors.emailDuplicated(user.email);
      } else {
        throw errors.parametersInvalid;
      }
    });
  };

  User.getUserByEmail = e => {
    return User.findOne({ where: { email: e } });
  };

  User.getUsers = (page, size) => {
    if (page < 1) throw new Error('Invalid parameters');
    const offst = size * page - size;
    return User.findAll({ offset: offst, limit: size });
  };

  return User;
};
