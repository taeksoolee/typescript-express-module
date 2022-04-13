import { Router, Request, Response } from 'express';

import { JwtPayload, userRoleTypes } from '../interface';
import bodyChecker from '../middleware/bodyChecker';

import { User } from "../entity/User"
import { DataSource, Like } from 'typeorm';
import Jwt, { getJwt } from '../utils/jwt';


let jwt: Jwt<JwtPayload>;
getJwt().subscribe((_jwt: Jwt<JwtPayload>) => {
  jwt = _jwt;
})

export default function authRouter(AppDataSource: DataSource): Router {
  const r = Router();

  r.post('/login', 
    bodyChecker({
      id: {
        type: 'string',
        requirement: true,
      },
      password: {
        type: 'string',
        requirement: true,
      }
    }),
    async (req: Request, res: Response) => {
      const { id, password } = req.body;
      const logined = true; // ToDo.. 로그인 확인

      if(!logined) {
        res.status(403).json({return: 'failed login'})
        return;
      }

      const accessToken = jwt.sign({
        name: 'lee..'
      });

      const refreshToken = jwt.signRefreshToken(accessToken);

      res.json({ 
        accessToken,
        refreshToken,
      });
    }
  );

  return r;
}