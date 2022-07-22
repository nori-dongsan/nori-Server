import { env } from '../env';

export const routingControllerOptions = {
  cors: {
    credentials: true,
    origin: [
      'http://localhost:3000',
      `${env.app.ec2Instance}`,
      'https://www.with-nori.com',
    ],
  },
  routePrefix: env.app.apiPrefix,
  controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
  middlewares: [`${__dirname}/../middlewares/*{.ts,.js}`],
};
