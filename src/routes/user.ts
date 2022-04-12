import { Router, Request, Response } from 'express';

import { userRoleTypes } from '../interface';
import bodyChecker from '../middleware/bodyChecker';

import { User } from "../entity/User"
import { DataSource } from 'typeorm';

export default function userRouter(AppDataSource: DataSource) {
  const r = Router();

  r.get('/',
    async (req: Request, res: Response) => {
      const users = await AppDataSource.manager.find(User);
      res.status(200).json(users);
    }
  );

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
