/**
 *
 * Student List Response
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { Student } from '../../entity/Student';
import { ReturnCodeResponse } from './ReturnCodeResponse';

export interface StudentListResponse extends ReturnCodeResponse {
    lstStudent?: Student[];
    lstStudentEmail?: string[];
}