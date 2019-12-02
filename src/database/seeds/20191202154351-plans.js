module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'plans',
      [
        {
          title: 'Basic',
          duration: 1,
          price: 110,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Pro',
          duration: 3,
          price: 100,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Godlike',
          duration: 6,
          price: 90,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
