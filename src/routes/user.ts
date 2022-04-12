import { Router, Request, Response } from 'express';

import { userRoleTypes } from '../interface';
import bodyChecker from '../middleware/bodyChecker';

import { User } from "../entity/User"
import { DataSource, Like } from 'typeorm';
import { constants } from 'fs';

export default function userRouter(AppDataSource: DataSource) {
  const r = Router();

  r.get('/',
    async (req: Request, res: Response) => {
      const { name } = req.query;

      const users = await AppDataSource.manager.find(User, {
        where: [ // arr is or
          { firstName: Like(`%${name}%`) }, 
          { lastName: Like(`%${name}%`) }
        ]
      });
      res.status(200).json(users);
    }
  );

  r.get('/:id',
    async (req: Request<{id: number}>, res: Response) => {
      const { id } = req.params;
      
      const user = await AppDataSource.manager.findOne(User, {
        where: { id },
      })

      res.status(200).json(user);
    }
  )

  r.get('/:firstName/:lastName',
    async (req: Request<{firstName: string, lastName: string}>, res: Response) => {
      const { firstName, lastName } = req.params;
      
      const users = await AppDataSource.manager.find(User, {
        where: {
          firstName, lastName
        }
      })

      res.status(200).json(users);
    }
  )

  r.post('/',
    bodyChecker({
      firstName: 'string',
      lastName: 'string',
      age: 'number',
      role: {
        enum: userRoleTypes,
      },
    }),
    async (req: Request, res: Response) => {
      const { firstName, lastName, age, role } = req.body;

      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.age = age;
      user.role = role;

      await AppDataSource.manager.save(user)

      res.status(200).json(true);
    }
  )

  return r;
}
