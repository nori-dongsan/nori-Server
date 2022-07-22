import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { env } from '../env';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';

/**
 * 헤더에서 accessToken을 추출한다.
 * @param req
 */
export const extractAccessToken = (req: Request) => {
  if (req.headers.accesstoken) {
    return String(req.headers.accesstoken);
  }
};

/**
 * 헤더에서 refreshToken을 추출한다.
 * @param req
 */
const extractRefreshToken = (req: Request) => {
  if (req.headers.refreshtoken) {
    return req.headers.refreshtoken;
  }
};

/**
 * JWT AccessToken을 만든다.
 * @param user
 */
export const generateAccessToken = (user: User) => {
  const payload = {
    id: user.id,
  };

  return jwt.sign(payload, String(env.app.jwtAccessSecret), {
    algorithm: 'HS256',
    expiresIn: '2h',
    issuer: 'nori',
  });
};

/**
 * JWT RefreshToken을 만든다.
 * @param user
 */
export const generateRefreshToken = (user: User) => {
  const payload = {
    id: user.id,
  };

  return jwt.sign(payload, String(env.app.jwtRefreshSecret), {
    algorithm: 'HS256',
    expiresIn: '14d',
    issuer: 'nori',
  });
};

/**
 * JWT 헤더에 존재하는 AccessToken을 체크한다.
 * @param req
 * @param res
 * @param next
 */
export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractAccessToken(req);
  let jwtPayload;

  try {
    jwtPayload = jwt.verify(String(token), String(env.app.jwtAccessSecret));
    res.locals.jwtPayload = jwtPayload;
  } catch (err) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .send(util.fail(statusCode.UNAUTHORIZED, message.TOKEN_ERROR));
  }

  next();
};

/**
 * JWT 헤더에 존재하는 RefreshToken을 체크한다.
 * @param req
 * @param res
 * @param next
 */
export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractRefreshToken(req);
  let jwtPayload;

  try {
    jwtPayload = jwt.verify(String(token), String(env.app.jwtRefreshSecret));
    res.locals.jwtPayload = jwtPayload;
    res.locals.token = token;
  } catch (err) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .send(util.fail(statusCode.UNAUTHORIZED, message.TOKEN_ERROR));
  }

  next();
};
