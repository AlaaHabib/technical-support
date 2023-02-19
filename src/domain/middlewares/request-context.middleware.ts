import { UnauthorizedException } from '@nestjs/common';
/*
https://docs.nestjs.com/middleware#middleware
*/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestScopeData } from '../models/request-scope-data.model';
import { verify } from 'jsonwebtoken';
import { CustomLogger } from '../helpers';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: any) {
    const isRefresh = req.originalUrl.includes('refresh');
    const Bearer = req.headers.authorization;
    const token = Bearer?.replace('Bearer', '').trim();
    console.log({ token });

    const { ip, method, path: url } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      // CustomLogger(
      //   {
      //     res,
      //      method, url, statusCode, contentLength, userAgent, ip
      //   }
      // );
      // CustomLogger({ req: {
      //   headers: req.headers,
      //   body: req.body,
      //   originalUrl: req.originalUrl,
      // } });
    });

    let user;
    if (token) {
      try {
        user = this.validateToken(token, isRefresh ? 'refresh' : 'access');
      } catch (error) {
        throw new UnauthorizedException();
      }
      req['user'] = {
        id: user.sub,
        email: user['email'],
        role: user['role'],
      };
    }
    if (req.originalUrl.includes('/auth')) {
      next();
    } else {
      RequestScopeData.cls.run(
        new RequestScopeData(user?.sub, user?.email, user?.role),
        next,
      );
    }
  }
  validateToken(token: string, type: 'refresh' | 'access') {
    const decoded = verify(
      token,
      type === 'access'
        ? process.env.ACCESS_TOKEN_KEY
        : process.env.REFRESH_TOKEN_KEY,
    );
    return decoded;
  }
}
