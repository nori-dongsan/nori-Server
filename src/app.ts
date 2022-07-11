// src/app.ts
import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes/routes";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import ErrorType from "./utils/ErrorType";
import StatusCode from "./utils/StatusCode";
import { Message } from "./utils/ResponseMessage";
import { logger, stream } from "./utils/Logger";
import { createDatabaseConnection } from "./config/database";

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.setDatabase();
    this.setMiddlewares();
    this.setSwagger();
    this.setRoutes();
    this.errorHanlder();
  }

  /**
   * 데이터베이스를 세팅한다.
   */
  private async setDatabase(): Promise<void> {
    try {
      await createDatabaseConnection();
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * 미들웨어를 세팅한다.
   */
  private setMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(morgan("combined", { stream }));
  }

  /**
   * swagger 세팅
   */
  private setSwagger(): void {
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      async (_req: ExRequest, res: ExResponse) => {
        return res.send(swaggerUi.generateHTML(await import("./swagger.json")));
      }
    );
  }

  /**
   * tsoa routes 등록
   */
  private setRoutes(): void {
    RegisterRoutes(this.app);
  }

  /**
   * http 에러 처리
   */
  private errorHanlder(): void {
    this.app.use(function notFoundHandler(_req, res: ExResponse) {
      const notFoundError: ErrorType = {
        status: StatusCode.NOT_FOUND,
        success: false,
        message: Message.NOT_FOUND,
      };
      res.status(notFoundError.status).send(notFoundError);
    });

    this.app.use(function errorHandler(
      err: unknown,
      req: ExRequest,
      res: ExResponse,
      next: NextFunction
    ): ExResponse | void {
      if (err instanceof ValidateError) {
        console.warn(
          `Caught Validation Error for ${req.path}: \n ${err.fields}`
        );
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
  }

  /**
   * Express를 시작한다.
   * @param port 포트
   */
  public async createExpressServer(port: number): Promise<void> {
    try {
      this.app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      logger.error(error);
    }
  }
}
