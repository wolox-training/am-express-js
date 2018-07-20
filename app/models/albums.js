const logger = require('../logger'),
  errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const album = sequelize.define(
    'album',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      },
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'album_id'
      }
    },
    {
      underscored: true
    }
  );

  album.associate = function(models) {
    // associations can be defined here
  };

  album.createModel = sale => {
    return album.findOne({ where: { userId: sale.userId, albumId: sale.albumId } }).then(alreadyBought => {
      if (alreadyBought) {
        throw errors.alreadyBought(sale.userId, sale.albumId);
      } else {
        return album.create(sale);
      }
    });
  };
  return album;
};
