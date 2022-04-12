import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: false, // 배포시 false로 변경 필요
    logging: true,
    entities: [
        User,
    ],
    migrations: [],
    subscribers: [],
})
