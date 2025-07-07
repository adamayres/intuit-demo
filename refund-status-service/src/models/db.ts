import { Sequelize } from 'sequelize';

// TODO: Move to environment variables or KMS
export const sequelize = new Sequelize('intuit_demo_db', 'intuit_demo', 'intuit', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  timezone: 'America/Los_Angeles'
});
