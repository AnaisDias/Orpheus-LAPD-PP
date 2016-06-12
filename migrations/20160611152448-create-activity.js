'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE Activities ADD CONSTRAINT activity_user_id_fkey FOREIGN KEY (userid) REFERENCES Users (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;");

    return queryInterface.createTable('activities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userid: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      content: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Activities');
  }
};
