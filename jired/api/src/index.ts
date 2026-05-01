// import 'module-alias/register';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import createDatabaseConnection from './database/createConnection';
import { addRespondToResponse } from './middleware/response';
import { authenticateUser } from './middleware/authentication';
import { handleError } from './middleware/errors';
import { RouteNotFoundError } from './errors';
import { attachPublicRoutes, attachPrivateRoutes } from './routes';

process.on('uncaughtException', (err) => {
  console.error('!!! UNCAUGHT EXCEPTION !!!', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('!!! UNHANDLED REJECTION !!!', reason);
  process.exit(1);
});
const establishDatabaseConnection = async (): Promise<void> => {
  await createDatabaseConnection();
};

const initializeExpress = (): void => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(addRespondToResponse);

  attachPublicRoutes(app);

  app.use('/', authenticateUser);

  attachPrivateRoutes(app);

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);

  app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

initializeApp();
