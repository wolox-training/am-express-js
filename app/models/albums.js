const logger = require('../logger'),
  errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const albums = sequelize.define(
    'albums',
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

  albums.associate = function(models) {
    // associations can be defined here
  };

  albums.createModel = sale => {
    return albums.findOne({ where: { userId: sale.userId, albumId: sale.albumId } }).then(alreadyBought => {
      if (alreadyBought) {
        throw errors.alreadyBought(sale.userId, sale.albumId);
      } else {
        return albums.create(sale);
      }
    });
  };
  return albums;
};
