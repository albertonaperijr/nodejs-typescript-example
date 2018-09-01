/**
 *
 * Common Util
 *
 * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr. *
 * * * * * * * * * * * * * * * *
 *
 */

import * as fs from 'fs';
import * as moment from 'moment-timezone';
import * as path from 'path';

import { CodeUtil } from './CodeUtil';
import { ConstantUtil } from './ConstantUtil';
import { LoggerUtil } from './LoggerUtil';

import { Student } from '../entity/Student';
import { User } from '../entity/User';

import { StudentService } from '../service/StudentService';
import { UserService } from '../service/UserService';

export class CommonUtil {

    /**
     * Get No Dash UUID
     * @return {string} UUID
     */
    public static getNoDashUUID() {
        const MethodName = 'GetNoDashUUID |';
        // LoggerUtil.info(MethodName);

        // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = (c == 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Extract Emails From Text
     * @param {string} text
     * @return {string[]} emails
     */
    public static extractEmailsFromText(text: string): string[] {
        const MethodName = 'ExtractEmailsFromText |';
        // LoggerUtil.info(MethodName);

        return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || [];
    }

    /**
     * Extract Mention Emails From Text
     * @param {string} text
     * @return {string[]} emails
     */
    public static extractMentionEmailsFromText(text: string): string[] {
        const MethodName = 'ExtractMentionEmailsFromText |';
        // LoggerUtil.info(MethodName);

        if (!text) {
            return [];
        }

        const splittedMentionEmail = text.match(/(@+[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || [];
        const lstEmail: string[] = [];

        if (splittedMentionEmail.length) {
            for (const mentionEmail of splittedMentionEmail) {
                const email = mentionEmail.substring(1);
                lstEmail.push(email);
            }
        }

        return lstEmail;
    }

    /**
     * Populate tables
     * @param {string} text
     * @return {boolean}
     */
    static async populateTables(): Promise<boolean> {
        const MethodName = 'PopulateTables |';
        LoggerUtil.info(MethodName);

        // Retrieve user
        const UserResponse = await UserService.getUserByUserId(ConstantUtil.DEFAULT_CURRENT_USER_ID, ConstantUtil.EXISTING_USER_ID);

        // Check if successs retrieving user
        if (UserResponse.returnCode === CodeUtil.RETRIEVE_USER_SUCCESS) {
            LoggerUtil.info(MethodName, 'Database tables already populated');
            return true;
        }

        // Parse test data
        LoggerUtil.info(MethodName, 'Parse test data | Current working directory :', path.resolve());
        const lstStudentRequest = JSON.parse(fs.readFileSync(path.resolve('./test/db/students.json'), 'utf8'));
        const lstUserRequest = JSON.parse(fs.readFileSync(path.resolve('./test/db/users.json'), 'utf8'));

        // LoggerUtil.info(MethodName, 'lstStudent :', lstStudent, '| lstUser :', lstUser);

        // Create user list
        const UserListResponse = await UserService.createTestUserList(lstUserRequest);

        // Check if error creating user list
        if (UserListResponse.returnCode !== CodeUtil.CREATE_USER_SUCCESS) {
            LoggerUtil.info(MethodName, 'Error creating users test data');
            return true;
        }

        // Assemble lstStudent
        const lstStudent: Student[] = [];

        for (const studentRequest of lstStudentRequest) {

            const teacherUser = new User();
            teacherUser.pkUserId = studentRequest.fkTeacherUserId;

            const studentUser = new User();
            studentUser.pkUserId = studentRequest.fkStudentUserId;

            const student = new Student();
            student.fkTeacherUserId = teacherUser;
            student.fkStudentUserId = studentUser;
            student.status = studentRequest.status;
            student.createdAt = new Date();
            student.updatedAt = new Date();

            lstStudent.push(student);
        }

        // Create student list
        const StudentListResponse = await StudentService.createTestStudentList(lstStudent);

        // Check if error creating student list
        if (StudentListResponse.returnCode !== CodeUtil.CREATE_STUDENT_SUCCESS) {
            LoggerUtil.info(MethodName, 'Error creating students test data');
            // return true;
        }

        return true;
    }

}