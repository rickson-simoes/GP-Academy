const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Administrador',
          email: 'admin@gympoint.com',
          password_hash: bcrypt.hashSync('123456', 8),
          admin_status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Administrador2',
          email: 'admin2@gympoint.com',
          password_hash: bcrypt.hashSync('123456', 8),
          admin_status: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
