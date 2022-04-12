import * as express from 'express';

import { Application, Request, Response, NextFunction } from 'express';

import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

import * as cors from 'cors';
import { userRoleTypes } from './interface';

import bodyChecker from './middleware/bodyChecker';


async function bootstrap(port) {
    const app: Application = express();
    await AppDataSource.initialize();
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.get('/user', 
        async (req: Request, res: Response) => {
            const users = await AppDataSource.manager.find(User);
            res.status(200).json(users);
        }
    );

    app.post('/user',
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

    app.listen(port, () => {
        console.log(`listen ::: ${port}`)
    });
}

bootstrap(4000);
