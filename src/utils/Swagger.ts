import express from "express";
import swaggerUi from "swagger-ui-express";
import { getMetadataArgsStorage } from "routing-controllers";
import { getFromContainer, MetadataStorage } from "class-validator";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { routingControllerOptions } from "./RoutingConfig";
import { env } from "../env";

/**
 * Swagger를 사용하도록 한다.
 * @param app Express Application
 */
export function useSwagger(app: express.Application) {
  // Parse routing-controllers classes into OPENAPI spec:
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: "#/components/schemas",
  });

  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, routingControllerOptions, {
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    info: {
      title: "nori Server",
      description: "nori Server API",
      version: "1.0.0",
      contact: {
        email: "with.nori2022@gmail.com",
        name: "노리",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  });

  app.use(`${env.swagger.route}`, swaggerUi.serve, swaggerUi.setup(spec));
}
