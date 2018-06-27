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
        throw new Error('Information incomplete or incorrect');
      }
    });
  };

  /*
  User.getUser = user => {
    return User.findOne({ where: user });
  };

  User.getByEmail = e => {
    return User.findOne({ where: { email: e } }).then(user => {
      if (user) {
        return user;
      }
      else {
        throw errors.userNotFound(user.email);
      }
    })
  };
*/

  return User;
};
