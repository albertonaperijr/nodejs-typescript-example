/**
 *
 * Student Repository
 * Create Update Delete Retrieve
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { EntityRepository, Repository } from 'typeorm';

import { Student } from '../entity/Student';

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {



}