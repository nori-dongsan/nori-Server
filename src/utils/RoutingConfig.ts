import { env } from '../env';

export const routingControllerOptions = {
  cors: {
    credentials: true,
    origin: [
      `${env.app.ec2Instance}`,
      'http://localhost:3000',
      'https://www.with-nori.com',
    ],
  },
  routePrefix: env.app.apiPrefix,
  controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
  middlewares: [`${__dirname}/../middlewares/*{.ts,.js}`],
};
