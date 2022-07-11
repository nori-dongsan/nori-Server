import { App } from "./app";
import { logger } from "./utils/Logger";

try {
  const app = new App();
  const port = Number(process.env.PORT);

  app.createExpressServer(port);
} catch (error) {
  logger.error(error);
}
