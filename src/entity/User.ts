import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { UserRoleType, userRoleTypes } from "../interface"

@Entity()
export class User {

    @PrimaryGeneratedColumn({
        name: 'ID',
    })
    id: number;

    @Column({
        name: 'FIRST_NAME',
    })
    firstName: string;

    @Column({
        name: 'LAST_NAME'
    })
    lastName: string;

    @Column({
        name: 'AGE'
    })
    age: number;

    @Column({
        name: 'ROLE',
        type: 'enum',
        enum: userRoleTypes,
        default: userRoleTypes[2],
    })
    role: UserRoleType;

    @CreateDateColumn({
        name: 'CREATED_DATE',
        type: 'timestamp',
    })
    createdDate: String;

    @UpdateDateColumn({
        name: 'UPDATED_DATE',
        type: 'timestamp',
    })
    updatedDate: String;

}
