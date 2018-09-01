/**
 *
 * Student Service Integration Test
 * Create Update Delete Retrieve
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import 'mocha';
import { assert, expect } from 'chai';

import { TestUtil } from '../util/TestUtil';
import { TestVariable } from '../TestVariable';

import { CodeUtil } from '../../../src/util/CodeUtil';
import { ConstantUtil } from '../../../src/util/ConstantUtil';
import { LoggerUtil } from '../../../src/util/LoggerUtil';

import { Student } from '../../../src/entity/Student';

import { StudentService } from '../../../src/service/StudentService';

import { StudentRequest } from '../../../src/interface/request/api/StudentRequest';

import { StudentResponse } from '../../../src/interface/response/StudentResponse';
import { StudentListResponse } from '../../../src/interface/response/StudentListResponse';

const studentRequest: StudentRequest = {
    teacher: null,
    students: null,
    notification: null
};

const studentResponse: StudentResponse = {
    student: new Student(),
    message: null,
    returnCode: null
};

const studentListResponse: StudentListResponse = {
    lstStudent: [new Student()],
    message: null,
    returnCode: null
};

const expectedStudentResponse: StudentResponse = studentResponse;
let actualStudentResponse: StudentResponse = studentResponse;

const expectedStudentListResponse: StudentListResponse = studentListResponse;
let actualStudentListResponse: StudentListResponse = studentListResponse;

// describe('StudentServiceTest @watch', () => {
describe('StudentServiceTest', () => {

    before(async () => {
        // Do nothing
    });

    /**
     * Normal Test
     */
    describe('NormalTest', () => {

        describe('addStudentList', () => {
            it('should add the student list using EXISTING teacherEmail and studentEmails', async () => {
                studentRequest.teacher = TestVariable.EXISTING_EMAIL;
                studentRequest.students = TestVariable.EXISTING_STUDENT_USER_EMAILS;
                expectedStudentListResponse.returnCode = CodeUtil.CREATE_OR_UPDATE_STUDENT_SUCCESS;
                actualStudentListResponse = await StudentService.addStudentList(ConstantUtil.DEFAULT_CURRENT_USER_ID, studentRequest);
                assert.equal(actualStudentListResponse.returnCode, expectedStudentListResponse.returnCode,
                    'Student list add must be successful');
            });
        });

        describe('getStudentByStudentId', () => {
            it('should retrieve the student using EXISTING studentId', async () => {
                expectedStudentResponse.returnCode = CodeUtil.RETRIEVE_STUDENT_SUCCESS;
                actualStudentResponse = await StudentService.getStudentByStudentId(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.EXISTING_STUDENT_ID);
                assert.equal(actualStudentResponse.returnCode, expectedStudentResponse.returnCode,
                    'Student retrieval must be successful');
                assert.isNotNull(actualStudentResponse.student,
                    'Student object must not be null');
            });
        });

        describe('getStudentListByTeacherUserId', () => {
            it('should retrieve the student using EXISTING teacherUserId', async () => {
                expectedStudentResponse.returnCode = CodeUtil.RETRIEVE_STUDENT_SUCCESS;
                actualStudentResponse = await StudentService.getStudentListByTeacherUserId(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.EXISTING_TEACHER_USER_ID);
                assert.equal(actualStudentResponse.returnCode, expectedStudentResponse.returnCode,
                    'Student retrieval must be successful');
                assert.isNotNull(actualStudentResponse.student,
                    'Student object must not be null');
            });
        });

        describe('getStudentListByTeacherUserIdAndLstStudentUserId', () => {
            it('should retrieve the student list using EXISTING teacherUserId and studentUserIds', async () => {
                expectedStudentListResponse.returnCode = CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS;
                actualStudentListResponse = await StudentService.getStudentListByTeacherUserIdAndLstStudentUserId(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.EXISTING_TEACHER_USER_ID, TestVariable.EXISTING_STUDENT_USER_IDS);
                assert.equal(actualStudentListResponse.returnCode, expectedStudentListResponse.returnCode,
                    'Student list retrieval must be successful');
                assert.isNotNull(actualStudentListResponse.lstStudent,
                    'Student list object must not be null');
            });
        });

        describe('getStudentListByLstEmail', () => {
            it('should retrieve the student list using EXISTING teacherEmails', async () => {
                expectedStudentListResponse.returnCode = CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS;
                actualStudentListResponse = await StudentService.getStudentListByLstTeacherEmail(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.EXISTING_TEACHER_EMAILS);
                assert.equal(actualStudentListResponse.returnCode, expectedStudentListResponse.returnCode,
                    'Student list retrieval must be successful');
                assert.isNotNull(actualStudentListResponse.lstStudent,
                    'Student list object must not be null');
            });
        });

    });

    /**
     * Error Test
     */
    describe('ErrorTest', () => {

        describe('addStudentList', () => {
            it('should NOT add the student using NULL studentRequest', async () => {
                expectedStudentListResponse.returnCode = CodeUtil.INVALID_PARAMETER;
                actualStudentListResponse = await StudentService.addStudentList(ConstantUtil.DEFAULT_CURRENT_USER_ID, null);
                assert.equal(actualStudentListResponse.returnCode, expectedStudentListResponse.returnCode,
                    'Should NOT add student list');
            });

            it('should NOT add the student using NON-EXISTING teacherEmail', async () => {
                studentRequest.teacher = TestVariable.NON_EXISTING_EMAIL;
                studentRequest.students = TestVariable.NON_EXISTING_EMAILS;
                expectedStudentListResponse.returnCode = CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR;
                actualStudentListResponse = await StudentService.addStudentList(ConstantUtil.DEFAULT_CURRENT_USER_ID, studentRequest);
                assert.equal(actualStudentListResponse.returnCode, expectedStudentListResponse.returnCode,
                    'Should NOT add student list');
            });
        });

        describe('getStudentByStudentId', () => {
            it('should NOT retrieve the student using NULL studentId', async () => {
                expectedStudentResponse.returnCode = CodeUtil.INVALID_PARAMETER;
                actualStudentResponse = await StudentService.getStudentByStudentId(ConstantUtil.DEFAULT_CURRENT_USER_ID, null);
                assert.equal(actualStudentResponse.returnCode, expectedStudentResponse.returnCode,
                    'Should NOT retrieve student');
            });

            it('should NOT retrieve the student using NON-EXISTING studentId', async () => {
                expectedStudentResponse.returnCode = CodeUtil.DO_NOT_EXIST_STUDENT_ERROR;
                actualStudentResponse = await StudentService.getStudentByStudentId(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.NON_EXISTING_STUDENT_ID);
                assert.equal(actualStudentResponse.returnCode, expectedStudentResponse.returnCode,
                    'Should NOT retrieve student');
            });
        });

        describe('getStudentListByTeacherUserId', () => {
            it('should NOT retrieve the student using NULL teacherUserId', async () => {
                expectedStudentResponse.returnCode = CodeUtil.INVALID_PARAMETER;
                actualStudentResponse = await StudentService.getStudentListByTeacherUserId(ConstantUtil.DEFAULT_CURRENT_USER_ID, null);
                assert.equal(actualStudentResponse.returnCode, expectedStudentResponse.returnCode,
                    'Should NOT retrieve student');
            });

            it('should NOT retrieve the student using NON-EXISTING teacherUserId', async () => {
                expectedStudentResponse.returnCode = CodeUtil.DO_NOT_EXIST_STUDENT_ERROR;
                actualStudentResponse = await StudentService.getStudentListByTeacherUserId(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.NON_EXISTING_TEACHER_USER_ID);
                assert.equal(actualStudentResponse.returnCode, expectedStudentResponse.returnCode,
                    'Should NOT retrieve student');
            });
        });

    });

});