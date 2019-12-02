module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Carlos',
          email: 'carlos@gympoint.com',
          age: 18,
          weight: 85,
          height: 1.83,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Lucia',
          email: 'lucia@gympoint.com',
          age: 36,
          weight: 56,
          height: 1.6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'David',
          email: 'david@gympoint.com',
          age: 56,
          weight: 75,
          height: 1.72,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Amanda',
          email: 'amanda@gympoint.com',
          age: 24,
          weight: 60,
          height: 1.56,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
