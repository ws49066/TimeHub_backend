'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },

      sobrenome: {
        type: Sequelize.STRING,
        allowNull: false
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false
      },

      cep: {
        type: Sequelize.STRING(8),
        allowNull: false
      },

      endereco: {
        type: Sequelize.STRING,
        allowNull: true
      },

      numero: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      complemento: {
        type: Sequelize.STRING,
        allowNull: true
      },

      bairro: {
        type: Sequelize.STRING,
        allowNull: true
      },

      cidade: {
        type: Sequelize.STRING,
        allowNull: true
      },

      estado: {
        type: Sequelize.STRING(2),
        allowNull: true
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "client"
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }

    })

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clients')
  }
};
