import { Router, Request, Response } from 'express';

import { userRoleTypes } from '../interface';
import bodyChecker from '../middleware/bodyChecker';

import { User } from "../entity/User"
import { DataSource, Like } from 'typeorm';


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

      const logined = true;

      if(logined) {
        
        res.json({id, password});
      } else {

      }
    }
  );

  return r;
}