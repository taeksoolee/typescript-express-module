import * as express from 'express';

import { Application } from 'express';

import { AppDataSource } from "./data-source"

import * as cors from 'cors';
import userRouter from './routes/user';

async function bootstrap(port) {
    await AppDataSource
        .initialize()
        .then((d) => {
            d.setOptions({
                timezone: 'UTC',
            });
        });

    const app: Application = express();
    
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use('/user', userRouter(AppDataSource));

    app.listen(port, () => {
        console.log(`listen ::: ${port}`)
    });
}

bootstrap(4000);
