import { createConnection, Connection } from 'typeorm';

const createDatabaseConnection = async (): Promise<Connection> => {
  const config = {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5433,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '3657635',
    database: process.env.DB_DATABASE || 'jira_development',
    entities: [__dirname + '/../entities/**/*.ts'],
    synchronize: true,
  };
  try {
    const connection = await createConnection(config);
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default createDatabaseConnection;