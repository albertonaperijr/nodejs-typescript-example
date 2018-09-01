/**
 *
 * Student Response
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { Student } from '../../entity/Student';
import { ReturnCodeResponse } from './ReturnCodeResponse';

export interface StudentResponse extends ReturnCodeResponse {
    student?: Student;
}