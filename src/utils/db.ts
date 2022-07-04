import { Sequelize } from 'sequelize';
import { NODE_ENV, DATABASE_URL } from '../config';

let options = {};

if (NODE_ENV === 'development') {
  options = { logging: false };
}

if (NODE_ENV === 'production') {
  // Recommended for production database to use SSL
  options = {
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
}

export const sequelize = new Sequelize(DATABASE_URL, options);

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
  } catch {
    console.log('Failed to connect to database');
  }
};

export default sequelize;
