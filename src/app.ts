// src/app.ts
import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import ErrorType from "./utils/ErrorType";
import StatusCode from "./utils/StatusCode";
import { Message } from "./utils/ResponseMessage";

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

app.use(function notFoundHandler(_req, res: ExResponse) {
  const notFoundError: ErrorType = {
    status: StatusCode.NOT_FOUND,
    success: false,
    message: Message.NOT_FOUND,
  };
  res.status(notFoundError.status).send(notFoundError);
});

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}: \n ${err.fields}`);
    const validateError: ErrorType = {
      status: StatusCode.VALIDATION_FAILED,
      success: false,
      message: Message.VALIDATION_FAILED,
      datail: err?.fields,
    };

    return res.status(validateError.status).json(validateError);
  }

  if (err instanceof Error) {
    console.log(err);
    const internalServerError: ErrorType = {
      status: StatusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: Message.INTERNAL_SERVER_ERROR,
    };

    return res.status(internalServerError.status).json(internalServerError);
  }

  next();
});
