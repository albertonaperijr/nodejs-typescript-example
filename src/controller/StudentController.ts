/**
 *
 * Student Controller
 * Create Update Delete Retrieve
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import * as _ from 'lodash';
import { Body, BodyParam, ContentType, Get, JsonController, QueryParam, Param, Post, Res } from 'routing-controllers';
import { Response } from 'express';

import { CurrentUserId } from '../decorator/CurrentUserIdDecorator';

import { CodeManagerUtil } from '../util/CodeManagerUtil';
import { CodeUtil } from '../util/CodeUtil';

import { StudentService } from '../service/StudentService';
import { UserService } from '../service/UserService';

import { StudentRequest } from '../interface/request/api/StudentRequest';

import { Student } from '../entity/Student';

@JsonController('')
export class StudentController {

    private studentService = StudentService;
    private userService = UserService;

    @Post('/register')
    @ContentType('application/json')
    async addStudentList(
        @CurrentUserId() currentUserId: number,
        @Body() studentRequest: StudentRequest,
        @Res() response: Response
    ) {

        // Add student list
        const StudentListResponse = await this.studentService.addStudentList(currentUserId, studentRequest);

        // Check if error adding student list
        if (StudentListResponse.returnCode !== CodeUtil.CREATE_OR_UPDATE_STUDENT_SUCCESS) {
            response.statusCode = CodeManagerUtil.getHttpStatusCode(StudentListResponse.returnCode);
            return response.send({
                message: StudentListResponse.message
            });
        }

        response.statusCode = CodeUtil.HTTP_STATUS_CODE_OK_BUT_NO_CONTENT;
        return response.send();
    }

    @Post('/suspend')
    @ContentType('application/json')
    async updateStudentUserStatusToSuspended(
        @CurrentUserId() currentUserId: number,
        @BodyParam('student') studentEmail: string,
        @Res() response: Response
    ) {

        // Update user
        const UserResponse = await this.userService.updateStudentUserStatusToSuspended(currentUserId, studentEmail);

        // Check if error updating user
        if (UserResponse.returnCode !== CodeUtil.UPDATE_USER_SUCCESS) {
            response.statusCode = CodeManagerUtil.getHttpStatusCode(UserResponse.returnCode);
            return response.send({
                message: UserResponse.message
            });
        }

        response.statusCode = CodeUtil.HTTP_STATUS_CODE_OK_BUT_NO_CONTENT;
        return response.send();
    }

    @Post('/retrievefornotifications')
    @ContentType('application/json')
    async getAllowedForNotificationStudentList(
        @CurrentUserId() currentUserId: number,
        @Body() studentRequest: StudentRequest,
        @Res() response: Response
    ) {

        // Retrieve student list
        const StudentListResponse = await this.studentService.getAllowedForNotificationStudentList(currentUserId, studentRequest);

        // Check if error retrieving student list
        if (StudentListResponse.returnCode !== CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS) {
            response.statusCode = CodeManagerUtil.getHttpStatusCode(StudentListResponse.returnCode);
            return response.send({
                message: StudentListResponse.message
            });
        }

        const lstStudent: Student[] = StudentListResponse.lstStudent || [];
        let lstStudentEmail: string[] = StudentListResponse.lstStudentEmail || [];

        // Check if lstStudent.length is greater than 0
        if (lstStudent.length) {
            for (const student of lstStudent) {
                lstStudentEmail.push(student.fkStudentUserId.email);
            }
        }

        // Remove duplicates
        lstStudentEmail = lstStudentEmail
            .filter((elem, index, array) => {
                return array.indexOf(elem) == index;
            });

        // Check if lstStudentEmail is null or empty
        if (!lstStudentEmail.length) {
            response.statusCode = CodeUtil.HTTP_STATUS_CODE_EXPECTATION_FAILED;
            return response.send({
                message: 'No students found'
            });
        }

        response.statusCode = CodeUtil.HTTP_STATUS_CODE_OK;
        return response.send({
            recipients: lstStudentEmail
        });
    }

    @Get('/commonstudents')
    async getStudentListByLstTeacherEmail(
        @CurrentUserId() currentUserId: number,
        @QueryParam('teacher') teacherEmail: string,
        @Res() response: Response
    ) {
        let lstTeacherEmail: string[] = (Array.isArray(teacherEmail) ? teacherEmail : [teacherEmail]) || [];

        // Remove duplicates
        lstTeacherEmail = lstTeacherEmail
            .filter((elem, index, array) => {
                return array.indexOf(elem) == index;
            });

        // Retrieve student list
        const StudentListResponse = await this.studentService.getStudentListByLstTeacherEmail(currentUserId, lstTeacherEmail);

        // Check if error adding student list
        if (StudentListResponse.returnCode !== CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS) {
            response.statusCode = CodeManagerUtil.getHttpStatusCode(StudentListResponse.returnCode);
            return response.send({
                message: StudentListResponse.message
            });
        }

        const lstStudent = StudentListResponse.lstStudent;
        const lstStudentEmail: string[] = [];

        // Check if lstTeacherEmail.length is equals to 1
        if (lstTeacherEmail.length === 1) {
            for (const student of lstStudent) {
                lstStudentEmail.push(student.fkStudentUserId.email);
            }
        } else {
            let lstStudentUserId: number[] = [];

            for (const student of lstStudent) {
                lstStudentUserId.push(student.fkStudentUserId.pkUserId);
            }

            // Get duplicated studentUserId list
            lstStudentUserId = _.filter(lstStudentUserId, (userId, index, iteratee) => {
                return _.includes(iteratee, userId, index + 1);
            });

            for (const studentUserId of lstStudentUserId) {

                let studentEmail: string = null;

                for (const student of lstStudent) {
                    if (student.fkStudentUserId.pkUserId === studentUserId) {
                        studentEmail = student.fkStudentUserId.email;
                    }
                }

                lstStudentEmail.push(studentEmail);
            }
        }

        response.statusCode = CodeUtil.HTTP_STATUS_CODE_OK;
        return response.send({
            students: lstStudentEmail
        });
    }

}