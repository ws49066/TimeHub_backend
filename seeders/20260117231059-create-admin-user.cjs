'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);


    const [existAdmin] = await queryInterface.sequelize.query(
      `SELECT id FROM users_admin WHERE email = :email LIMIT 1`,
      {
        replacements: { email: process.env.ADMIN_EMAIL },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (!existAdmin) {
      await queryInterface.bulkInsert('users_admin', [{
        nome: process.env.ADMIN_NAME,
        sobrenome: process.env.ADMIN_SURNAME,
        email: process.env.ADMIN_EMAIL,
        password: passwordHash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists. Skipping seed.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users_admin', { email: process.env.ADMIN_EMAIL }, {});
    console.log('Admin user deleted successfully.');
  }
};
