import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import {
  createLogger,
  format,
  Logger,
  LoggerOptions,
  transports,
} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, prettyPrint, colorize, json, errors } =
  format;

const logDirectory = "logs";
const filename = join(logDirectory, "app-%DATE%.log");
const level = process.env.NODE_ENV === "production" ? "error" : "debug";

// log 저장 폴더 없을 시 생성
if (!existsSync(logDirectory)) {
  mkdirSync(logDirectory);
}

/**
 * 콘솔 로그 출력 포맷 설정
 */
const consoleOutputFormat = combine(
  colorize(),
  prettyPrint(),
  json(),
  printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

/**
 * 파일 로그 출력 포맷 설정
 */
const fileOutputFormat = combine(
  printf((info) => {
    if (info.stack) {
      return `${info.timestamp} ${info.level}: ${info.message}: ${info.stack}`;
    }

    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

const options: LoggerOptions = {
  level,
  exitOnError: false,
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true })
  ),
  transports: [
    // 콘솔 로그 출력
    new transports.Console({
      handleExceptions: true,
      format: consoleOutputFormat,
    }),

    // 파일 로그 출력
    new DailyRotateFile({
      handleExceptions: true,
      format: fileOutputFormat,
      filename,
    }),
  ],
};

const logger: Logger = createLogger(options);

const stream = {
  write: (message: string) => {
    logger.info(message);
  },
};

export { logger, stream };
