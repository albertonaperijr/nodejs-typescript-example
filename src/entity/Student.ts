/**
 *
 * Student Entity
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, ManyToMany, OneToOne, PrimaryColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsDate, IsIn, IsInt, IsOptional } from 'class-validator';

import { ConstantUtil } from '../util/ConstantUtil';

import { User } from './User';

@Entity('student')
@Index('unq_student_fkteacheruserid_fkstudentuserid', ['fkTeacherUserId', 'fkStudentUserId'], { unique: true })
export class Student {

    @PrimaryColumn('bigint')
    @Generated()
    // @IsInt()
    @IsOptional()
    pkStudentId: number;

    @ManyToOne(type => User, {
        eager: true
    })
    @JoinColumn({ name: 'fk_teacher_user_id' })
    fkTeacherUserId: User;

    @ManyToOne(type => User, {
        eager: true
    })
    @JoinColumn({ name: 'fk_student_user_id' })
    fkStudentUserId: User;

    @Column('integer')
    @IsInt()
    @IsIn([
        ConstantUtil.STUDENT_STATUS_ACTIVE,
        ConstantUtil.STUDENT_STATUS_INACTIVE,
    ])
    status: number;

    @CreateDateColumn()
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn()
    @IsDate()
    updatedAt: Date;

    // @Column()
    // @IsDate()
    // @IsOptional()
    // deletedAt: Date;

}
