/**
 *
 * User Entity
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { AfterLoad, Column, CreateDateColumn, Entity, Generated, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { IsDate, IsEmail, IsIn, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { ConstantUtil } from '../util/ConstantUtil';

@Entity('user')
@Index('unq_user_email', ['email'], { unique: true })
export class User {

    @PrimaryColumn('bigint')
    @Generated()
    // @IsInt()
    @IsOptional()
    pkUserId: number;

    @Column()
    @IsString()
    @IsOptional()
    // @MinLength(2)
    // @MaxLength(25)
    firstName: string;

    @Column()
    @IsString()
    @IsOptional()
    // @MinLength(2)
    // @MaxLength(25)
    lastName: string;

    @Column()
    @IsString()
    @IsOptional()
    photo: string;

    @Column({
        length: 50
    })
    @IsEmail()
    @MaxLength(50)
    email: string;

    @Column()
    @IsString()
    @IsOptional()
    password: string;

    @Column('integer')
    @IsInt()
    @IsIn([
        ConstantUtil.USER_ACCESS_LEVEL_TEACHER,
        ConstantUtil.USER_ACCESS_LEVEL_STUDENT,
    ])
    accessLevel: number;

    @Column('integer')
    @IsInt()
    @IsIn([
        ConstantUtil.USER_STATUS_ACTIVE,
        ConstantUtil.USER_STATUS_INACTIVE,
        // ConstantUtil.USER_STATUS_BLOCKED,
        ConstantUtil.USER_STATUS_SUSPENDED_STUDENT,
    ])
    status: number;

    @CreateDateColumn()
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn()
    @IsDate()
    updatedAt: Date;

    // Methods

    @AfterLoad()
    async afterLoad() {
        const MethodName = 'UserBeforeInsert |';
        // LoggerUtil.error(MethodName);
    }

}
