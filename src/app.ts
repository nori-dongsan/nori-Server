// src/app.ts
import express, { Response as ExResponse, Request as ExRequest } from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  async (_req: ExRequest, res: ExResponse) => {
    return res.send(swaggerUi.generateHTML(await import("./swagger.json")));
  }
);

RegisterRoutes(app);
