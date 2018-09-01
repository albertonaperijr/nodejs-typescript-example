/**
 *
 * Student Service
 * Create Update Delete Retrieve
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { EntityManager, getCustomRepository, getManager, In, TransactionManager } from 'typeorm';
import { validate, Validator } from 'class-validator';

import { CodeUtil } from '../util/CodeUtil';
import { CommonUtil } from '../util/CommonUtil';
import { ConstantUtil } from '../util/ConstantUtil';
import { LoggerUtil } from '../util/LoggerUtil';

import { Student } from '../entity/Student';
import { User } from '../entity/User';

import { StudentRepository } from '../repository/StudentRepository';

import { UserService } from './UserService';

import { StudentRequest } from '../interface/request/api/StudentRequest';

import { StudentResponse } from '../interface/response/StudentResponse';
import { StudentListResponse } from '../interface/response/StudentListResponse';

export class StudentService {

    private static validator = new Validator();

    // ----------------------------------------------------------------------
    // Create update delete section
    // ----------------------------------------------------------------------

    /**
     * Note: For testing purposes only. Not to be used in production.
     * Create Test Student List
     * @param {object[]} lstStudent
     * @return {object} StudentListResponse
     */
    public static async createTestStudentList(lstStudent: Student[]): Promise<StudentListResponse> {
        const MethodName = 'CreateTestStudentList |';
        LoggerUtil.info(MethodName, 'lstStudent :', lstStudent);

        let lstStudentFromDb: Student[] = null;

        // lstStudent must not be null
        if (!lstStudent) {
            LoggerUtil.error(MethodName, 'Null lstStudent |', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Validate Fields

        // Validate lstStudent array
        const objectErrors = await validate(lstStudent);

        if (objectErrors.length) {
            LoggerUtil.error(MethodName, 'Invalid lstStudent object | objectErrors :', objectErrors, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Create student list
        try {
            const studentRepository = getCustomRepository(StudentRepository);
            lstStudentFromDb = await studentRepository.save(lstStudent);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error creating test student list | error :', error.message, '|', CodeUtil.CREATE_STUDENT_ERROR);
            return {
                message: 'Error creating test students',
                returnCode: CodeUtil.CREATE_STUDENT_ERROR
            };
        }

        if (!lstStudentFromDb) {
            LoggerUtil.error(MethodName, 'Error creating test student list |', CodeUtil.CREATE_STUDENT_ERROR);
            return {
                message: 'Error creating test students',
                returnCode: CodeUtil.CREATE_STUDENT_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success creating test student list |', CodeUtil.CREATE_STUDENT_SUCCESS);
        return {
            lstStudent: lstStudentFromDb,
            returnCode: CodeUtil.CREATE_STUDENT_SUCCESS
        };
    }

    /**
     * Add Student List
     * @param {int} currentUserId
     * @param {object} studentRequest
     * @return {object} StudentListResponse
     */
    public static async addStudentList(currentUserId: number, studentRequest: StudentRequest): Promise<StudentListResponse> {
        const MethodName = 'AddStudentList |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| studentRequest', studentRequest);

        let lstStudentUserFromDb: User[] = [];
        let lstStudentFromDb: Student[] = [];

        // // currentUserId is required for all create/update/delete
        // if (!currentUserId) {
        //     LoggerUtil.error(MethodName, 'Null currentUserId | Unauthorized access |', CodeUtil.UNSTUDENTORIZED_ACCESS);
        //     return {
        //         message: 'Unauthorized access',
        //         returnCode: CodeUtil.UNSTUDENTORIZED_ACCESS
        //     };
        // }

        // studentRequest must not be null
        if (!studentRequest) {
            LoggerUtil.error(MethodName, 'Null studentRequest |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        const teacherEmail = studentRequest.teacher;
        let lstStudentEmail = studentRequest.students;

        // Validate Fields

        // Check if teacherEmail is null or invalid
        if (!teacherEmail || !this.validator.isEmail(teacherEmail)) {
            LoggerUtil.error(MethodName, 'Null or invalid teacherEmail |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Check if lstStudentEmail is not an array or empty
        if (!this.validator.isArray(lstStudentEmail) || !this.validator.arrayNotEmpty(lstStudentEmail)) {
            LoggerUtil.error(MethodName, 'lstStudentEmail is not an array or empty |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Remove duplicates
        lstStudentEmail = lstStudentEmail
            .filter((elem, index, array) => {
                return array.indexOf(elem) == index;
            });

        for (const studentEmail of lstStudentEmail) {

            // Check if studentEmail is invalid
            if (!this.validator.isEmail(studentEmail)) {
                LoggerUtil.error(MethodName, 'Invalid studentEmail |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
                return {
                    message: `${studentEmail} is not a valid email`,
                    returnCode: CodeUtil.INVALID_PARAMETER
                };
            }
        }

        // Retrieve user
        const UserResponse = await UserService.getUserByEmail(currentUserId, teacherEmail);

        // Check if error retrieving user
        if (UserResponse.returnCode !== CodeUtil.RETRIEVE_USER_SUCCESS) {
            LoggerUtil.error(MethodName, 'Error adding student list | Unable to retrieve user |', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR);
            return {
                message: `${teacherEmail} does not belong to a teacher`,
                returnCode: CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR
            };
        }

        const teacherUser = UserResponse.user;

        // Check if teacherUser.accessLevel is not equals to teacher
        if (teacherUser.accessLevel !== ConstantUtil.USER_ACCESS_LEVEL_TEACHER) {
            LoggerUtil.error(MethodName, 'Error adding student list | teacherUser.accessLevel is not teacher |', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR);
            return {
                message: `${teacherEmail} doesn't belong to a teacher`,
                returnCode: CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR
            };
        }

        // Retrieve user list
        const UserListResponse = await UserService.getUserListByLstEmail(currentUserId, lstStudentEmail);

        // Check if not success retrieving and do not exist user list
        if (UserListResponse.returnCode !== CodeUtil.RETRIEVE_USER_LIST_SUCCESS &&
            UserListResponse.returnCode !== CodeUtil.DO_NOT_EXIST_USER_ERROR) {
            LoggerUtil.error(MethodName, 'Error adding student list | Unable to retrieve user list |', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR);
            return {
                message: 'Error adding students',
                returnCode: CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR
            };
        }

        // Check if success retrieving user list
        if (UserListResponse.returnCode === CodeUtil.RETRIEVE_USER_LIST_SUCCESS) {

            lstStudentUserFromDb = UserListResponse.lstUser;
            const lstStudentUserId: number[] = [];

            for (const studentUser of lstStudentUserFromDb) {

                // Check if studentUser.accessLevel is not equals to student
                if (studentUser.accessLevel !== ConstantUtil.USER_ACCESS_LEVEL_STUDENT) {
                    const message = `${studentUser.email} doesn't belong to a student`;
                    LoggerUtil.error(MethodName, 'Error adding student list |', message, '|', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR);
                    return {
                        message,
                        returnCode: CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR
                    };
                } else {
                    lstStudentUserId.push(studentUser.pkUserId);
                }
            }

            // Retrieve student list
            const StudentListResponse = await this.getStudentListByTeacherUserIdAndLstStudentUserId(currentUserId, teacherUser.pkUserId, lstStudentUserId);

            // Check if not success retrieving and do not exist student list
            if (StudentListResponse.returnCode !== CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS &&
                StudentListResponse.returnCode !== CodeUtil.DO_NOT_EXIST_STUDENT_ERROR) {
                LoggerUtil.error(MethodName, 'Error adding student list | Unable to retrieve student list |', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR);
                return {
                    message: 'Error adding students',
                    returnCode: CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR
                };
            }

            // Check if success retrieving student list
            if (StudentListResponse.returnCode === CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS) {
                lstStudentFromDb = StudentListResponse.lstStudent;

                // Check if lstStudentFromDb.length is equals to lstStudentEmail.length
                if (lstStudentFromDb.length === lstStudentEmail.length) {
                    let hasInactiveStudentStatus = false;

                    for (const student of lstStudentFromDb) {
                        if (student.status == ConstantUtil.STUDENT_STATUS_INACTIVE) {
                            hasInactiveStudentStatus = true;
                            break;
                        }
                    }

                    // Check if there's no inactive student
                    if (!hasInactiveStudentStatus) {
                        LoggerUtil.info(MethodName, 'Success adding student list | All student emails are already added and not inactive |', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_SUCCESS);
                        return {
                            lstStudent: lstStudentFromDb,
                            returnCode: CodeUtil.CREATE_OR_UPDATE_STUDENT_SUCCESS
                        };
                    }
                }
            }
        }

        // Transaction
        try {
            await getManager()
                .transaction(async (transactionalEntityManager) => {

                    // Check if lstStudentUserFromDb.length is not equals to lstStudentEmail.length
                    if (lstStudentUserFromDb.length !== lstStudentEmail.length) {

                        // Assemble unregistered lstStudentUser
                        const lstStudentUser: User[] = [];

                        for (const studentEmail of lstStudentEmail) {

                            let isStudentEmailAlreadyRegistered = false;

                            if (lstStudentUserFromDb.length) {
                                for (const user of lstStudentUserFromDb) {
                                    if (user.email === studentEmail) {
                                        isStudentEmailAlreadyRegistered = true;
                                        break;
                                    }
                                }
                            }

                            // Check if studentEmail is not yet registered
                            if (!isStudentEmailAlreadyRegistered) {
                                const user = new User();
                                // user.firstName = firstName;
                                // user.lastName = lastName;
                                // user.photo = null;
                                user.email = studentEmail;
                                // user.password = password; // Auto-generated password
                                user.accessLevel = ConstantUtil.USER_ACCESS_LEVEL_STUDENT;
                                user.status = ConstantUtil.USER_STATUS_ACTIVE;
                                user.createdAt = new Date();
                                user.updatedAt = new Date();

                                lstStudentUser.push(user);
                            }
                        }

                        // Create user list (student)
                        const UserListResponse = await UserService.createUserList(transactionalEntityManager, currentUserId, lstStudentUser);

                        // Check if error creating user list
                        if (UserListResponse.returnCode !== CodeUtil.CREATE_USER_SUCCESS) {
                            LoggerUtil.error(MethodName, 'Error adding student list | Error creating student user list |', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR);
                            throw new Error(UserListResponse.message);
                        }

                        // Add the newly created student user list
                        lstStudentUserFromDb.push(...UserListResponse.lstUser);
                    }

                    // Assemble lstStudent
                    const lstStudentToBeCreated: Student[] = [];
                    const lstStudentToBeUpdated: Student[] = [];

                    for (const user of lstStudentUserFromDb) {

                        let studentFromDb: Student = null;

                        for (const studentObj of lstStudentFromDb) {
                            if (studentObj.fkStudentUserId.pkUserId === user.pkUserId) {
                                studentFromDb = studentObj;
                            }
                        }

                        // Check if studentFromDb is not null
                        if (studentFromDb) {
                            if (studentFromDb.status != ConstantUtil.STUDENT_STATUS_ACTIVE) {
                                studentFromDb.status = ConstantUtil.STUDENT_STATUS_ACTIVE;
                                studentFromDb.updatedAt = new Date();

                                lstStudentToBeUpdated.push(studentFromDb);
                            }
                        } else {
                            const student = new Student();
                            student.fkTeacherUserId = teacherUser;
                            student.fkStudentUserId = user;
                            student.status = ConstantUtil.STUDENT_STATUS_ACTIVE;
                            student.createdAt = new Date();
                            student.updatedAt = new Date();

                            lstStudentToBeCreated.push(student);
                        }
                    }

                    // Check if lstStudentToBeCreated is not empty
                    if (lstStudentToBeCreated.length) {

                        // Create student list
                        const StudentListResponse = await this.createStudentList(transactionalEntityManager, currentUserId, lstStudentToBeCreated);

                        // Check if error creating student list
                        if (StudentListResponse.returnCode !== CodeUtil.CREATE_STUDENT_SUCCESS) {
                            LoggerUtil.error(MethodName, 'Error adding student list | Error creating student list |', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR);
                            throw new Error(StudentListResponse.message);
                        }

                        lstStudentFromDb.push(...StudentListResponse.lstStudent);
                    }

                    // Check if lstStudentToBeUpdated is not empty
                    if (lstStudentToBeUpdated.length) {

                        // Update student list
                        const StudentListResponse = await this.updateStudentList(transactionalEntityManager, currentUserId, lstStudentToBeUpdated);

                        // Check if error update student list
                        if (StudentListResponse.returnCode !== CodeUtil.UPDATE_STUDENT_SUCCESS) {
                            LoggerUtil.error(MethodName, 'Error adding student list | Error update student list |', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR);
                            throw new Error(StudentListResponse.message);
                        }
                    }
                });
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error adding student list | error :', error.message, '|', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR);
            return {
                message: 'Error adding students',
                returnCode: CodeUtil.CREATE_OR_UPDATE_STUDENT_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success adding student list |', currentUserId, '|', CodeUtil.CREATE_OR_UPDATE_STUDENT_SUCCESS);
        return {
            lstStudent: lstStudentFromDb,
            returnCode: CodeUtil.CREATE_OR_UPDATE_STUDENT_SUCCESS
        };
    }

    /**
     * Create Student List | Transaction
     * @param {object} transactionManager
     * @param {int} currentUserId
     * @param {object} lstStudent
     * @return {object} StudentListResponse
     */
    // @Transaction()
    public static async createStudentList(@TransactionManager() transactionManager: EntityManager, currentUserId: number, lstStudent: Student[]): Promise<StudentListResponse> {
        const MethodName = 'CreateStudentList |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| lstStudent :', lstStudent);

        let lstStudentFromDb: Student[] = null;

        // lstStudent must not be null
        if (!lstStudent) {
            LoggerUtil.error(MethodName, 'Null lstStudent |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Validate Fields
        const objectErrors = await validate(lstStudent);

        if (objectErrors.length) {
            LoggerUtil.error(MethodName, 'Invalid lstStudent object | objectErrors :', objectErrors, '|', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Create student list
        try {
            const studentRepository = transactionManager.getCustomRepository(StudentRepository);
            lstStudentFromDb = await studentRepository.save(lstStudent);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error creating student list | error :', error.message, '|', currentUserId, '|', CodeUtil.CREATE_STUDENT_ERROR);
            return {
                message: 'Error creating students',
                returnCode: CodeUtil.CREATE_STUDENT_ERROR
            };
        }

        if (!lstStudentFromDb) {
            LoggerUtil.error(MethodName, 'Error creating student list |', currentUserId, '|', CodeUtil.CREATE_STUDENT_ERROR);
            return {
                message: 'Error creating students',
                returnCode: CodeUtil.CREATE_STUDENT_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success creating student list |', currentUserId, '|', CodeUtil.CREATE_STUDENT_SUCCESS);
        return {
            lstStudent: lstStudentFromDb,
            returnCode: CodeUtil.CREATE_STUDENT_SUCCESS
        };
    }

    /**
     * Update Student List | Transaction
     * @param {object} transactionManager
     * @param {int} currentUserId
     * @param {object} lstStudent
     * @return {object} StudentListResponse
     */
    // @Transaction()
    public static async updateStudentList(@TransactionManager() transactionManager: EntityManager, currentUserId: number, lstStudent: Student[]): Promise<StudentListResponse> {
        const MethodName = 'UpdateStudentList |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| lstStudent :', lstStudent);

        let lstStudentFromDb: Student[] = null;

        // lstStudent must not be null
        if (!lstStudent) {
            LoggerUtil.error(MethodName, 'Null lstStudent |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Validate Fields
        const objectErrors = await validate(lstStudent);

        if (objectErrors.length) {
            LoggerUtil.error(MethodName, 'Invalid lstStudent object | objectErrors :', objectErrors, '|', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Update student list
        try {
            const studentRepository = transactionManager.getCustomRepository(StudentRepository);
            lstStudentFromDb = await studentRepository.save(lstStudent);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error updating student list | error :', error.message, '|', currentUserId, '|', CodeUtil.UPDATE_STUDENT_ERROR);
            return {
                message: 'Error updating students',
                returnCode: CodeUtil.UPDATE_STUDENT_ERROR
            };
        }

        if (!lstStudentFromDb) {
            LoggerUtil.error(MethodName, 'Error updating student list |', currentUserId, '|', CodeUtil.UPDATE_STUDENT_ERROR);
            return {
                message: 'Error updating students',
                returnCode: CodeUtil.UPDATE_STUDENT_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success updating student list |', currentUserId, '|', CodeUtil.UPDATE_STUDENT_SUCCESS);
        return {
            lstStudent: lstStudentFromDb,
            returnCode: CodeUtil.UPDATE_STUDENT_SUCCESS
        };
    }

    // ----------------------------------------------------------------------
    // Data retrieval section
    // ----------------------------------------------------------------------

    /**
     * Get Student By StudentId
     * @param {int} currentUserId
     * @param {int} studentId
     * @return {object} StudentResponse
     */
    public static async getStudentByStudentId(currentUserId: number, studentId: number): Promise<StudentResponse> {
        const MethodName = 'GetStudentByStudentId |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| studentId :', studentId);

        let studentFromDb: Student = null;

        // studentId must not be null
        if (!studentId) {
            LoggerUtil.error(MethodName, 'Null studentId |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Validate Fields
        if (!Number(studentId)) {
            LoggerUtil.error(MethodName, 'Invalid studentId |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Retrieve student
        try {
            const studentRepository = getCustomRepository(StudentRepository);
            studentFromDb = await studentRepository.findOne(studentId);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error retrieving student | error :', error.message, '|', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_ERROR);
            return {
                message: 'Error retrieving student',
                returnCode: CodeUtil.RETRIEVE_STUDENT_ERROR
            };
        }

        if (!studentFromDb) {
            LoggerUtil.error(MethodName, 'studentId :', studentId, 'does not exist |', currentUserId, '|', CodeUtil.DO_NOT_EXIST_STUDENT_ERROR);
            return {
                message: 'Student does not exist',
                returnCode: CodeUtil.DO_NOT_EXIST_STUDENT_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success retrieving student | studentId :', studentId, '|', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_SUCCESS);
        return {
            student: studentFromDb,
            returnCode: CodeUtil.RETRIEVE_STUDENT_SUCCESS
        };
    }

    /**
     * Get Student List By TeacherUserId
     * @param {int} currentUserId
     * @param {int} teacherUserId
     * @return {object} StudentListResponse
     */
    public static async getStudentListByTeacherUserId(currentUserId: number, teacherUserId: number): Promise<StudentListResponse> {
        const MethodName = 'GetStudentListByTeacherUserId |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| teacherUserId :', teacherUserId);

        let lstStudentFromDb: Student[] = null;

        // // teacherUserId must not be null
        // if (!teacherUserId) {
        //     LoggerUtil.error(MethodName, 'Null teacherUserId |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
        //     return {
        //         message: 'Invalid parameter',
        //         returnCode: CodeUtil.INVALID_PARAMETER
        //     };
        // }

        // Validate Fields

        if (!Number(teacherUserId)) {
            LoggerUtil.error(MethodName, 'Invalid teacherUserId |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Retrieve student list
        try {
            const studentRepository = getCustomRepository(StudentRepository);
            lstStudentFromDb = await studentRepository.find({
                fkTeacherUserId: {
                    pkUserId: teacherUserId
                }
            });
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error retrieving student list | error :', error.message, '|', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_ERROR);
            return {
                message: 'Error retrieving students',
                returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_ERROR
            };
        }

        if (!lstStudentFromDb || !lstStudentFromDb.length) {
            LoggerUtil.error(MethodName, 'Error retrieving student list | No student list found |', currentUserId, '|', CodeUtil.DO_NOT_EXIST_STUDENT_ERROR);
            return {
                message: 'No students found',
                returnCode: CodeUtil.DO_NOT_EXIST_STUDENT_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success retrieving student list | rowsCount :', lstStudentFromDb.length, '|', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS);
        return {
            lstStudent: lstStudentFromDb,
            returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS
        };
    }

    /**
     * Get Student List By TeacherUserId And LstStudentUserId
     * @param {int} currentUserId
     * @param {int} teacherUserId
     * @param {int[]} lstStudentUserId
     * @return {object} StudentListResponse
     */
    public static async getStudentListByTeacherUserIdAndLstStudentUserId(currentUserId: number, teacherUserId: number, lstStudentUserId: number[]): Promise<StudentListResponse> {
        const MethodName = 'GetStudentListByTeacherUserIdAndLstStudentUserId |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| teacherUserId :', teacherUserId, '| lstStudentUserId :', lstStudentUserId);

        let lstStudentFromDb: Student[] = null;

        // // teacherUserId must not be null
        // if (!teacherUserId) {
        //     LoggerUtil.error(MethodName, 'Null teacherUserId |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
        //     return {
        //         message: 'Invalid parameter',
        //         returnCode: CodeUtil.INVALID_PARAMETER
        //     };
        // }

        // Validate Fields

        if (!Number(teacherUserId)) {
            LoggerUtil.error(MethodName, 'Invalid teacherUserId |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Check if lstStudentUserId is not an array
        if (!this.validator.isArray(lstStudentUserId) || !this.validator.arrayNotEmpty(lstStudentUserId)) {
            LoggerUtil.error(MethodName, 'lstStudentUserId is not an array or empty |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Retrieve student list
        try {
            const studentRepository = getCustomRepository(StudentRepository);
            lstStudentFromDb = await studentRepository.find({
                fkTeacherUserId: {
                    pkUserId: teacherUserId
                },
                fkStudentUserId: {
                    pkUserId: In(lstStudentUserId)
                }
            });
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error retrieving student list | error :', error.message, '|', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_ERROR);
            return {
                message: 'Error retrieving students',
                returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_ERROR
            };
        }

        if (!lstStudentFromDb || !lstStudentFromDb.length) {
            LoggerUtil.error(MethodName, 'Error retrieving student list | No student list found |', currentUserId, '|', CodeUtil.DO_NOT_EXIST_STUDENT_ERROR);
            return {
                message: 'No students found',
                returnCode: CodeUtil.DO_NOT_EXIST_STUDENT_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success retrieving student list | rowsCount :', lstStudentFromDb.length, '|', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS);
        return {
            lstStudent: lstStudentFromDb,
            returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS
        };
    }

    /**
     * Get Student List By LstTeacherEmail
     * @param {int} currentUserId
     * @param {int[]} lstTeacherEmail
     * @return {object} StudentListResponse
     */
    public static async getStudentListByLstTeacherEmail(currentUserId: number, lstTeacherEmail: string[]): Promise<StudentListResponse> {
        const MethodName = 'GetStudentListByLstTeacherEmail |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| lstStudentUserId :', lstTeacherEmail);

        let lstStudentFromDb: Student[] = null;
        let lstTeacherUserFromDb: User[] = [];
        const lstInvalidTeacherEmail: string[] = [];

        // lstTeacherEmail must not be null
        if (!lstTeacherEmail) {
            LoggerUtil.error(MethodName, 'Null lstTeacherEmail |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Validate Fields

        // Check if lstTeacherEmail is not an array or empty
        if (!this.validator.isArray(lstTeacherEmail) || !this.validator.arrayNotEmpty(lstTeacherEmail)) {
            LoggerUtil.error(MethodName, 'lstTeacherEmail is not an array or empty |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Remove duplicates
        lstTeacherEmail = lstTeacherEmail
            .filter((elem, index, array) => {
                return array.indexOf(elem) == index;
            });

        for (const teacherEmail of lstTeacherEmail) {

            // Check if teacherEmail is invalid
            if (!this.validator.isEmail(teacherEmail)) {
                LoggerUtil.error(MethodName, 'Invalid teacherEmail |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
                return {
                    message: `${teacherEmail} is not a valid email`,
                    returnCode: CodeUtil.INVALID_PARAMETER
                };
            }
        }

        // Retrieve user list
        const UserListResponse = await UserService.getUserListByLstEmail(currentUserId, lstTeacherEmail);

        // Check if not success retrieving and do not exist user list
        if (UserListResponse.returnCode !== CodeUtil.RETRIEVE_USER_LIST_SUCCESS &&
            UserListResponse.returnCode !== CodeUtil.DO_NOT_EXIST_USER_ERROR) {
            LoggerUtil.error(MethodName, 'Error retrieving common student list | Unable to retrieve user list |', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_ERROR);
            return {
                message: 'Error retrieving common students',
                returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_ERROR
            };
        }

        // Check if error retrieving user list
        if (UserListResponse.returnCode !== CodeUtil.RETRIEVE_USER_LIST_SUCCESS) {

            // Check if lstTeacherEmail.length is not 0 or empty
            if (!lstTeacherEmail.length) {
                let message: string = '';

                for (let i = 0; i < lstTeacherEmail.length; i++) {
                    const teacherEmail = lstTeacherEmail[i];

                    if (i === 0) {
                        message = teacherEmail;
                    } else if (i >= (lstTeacherEmail.length - 1)) { // Last iteration
                        message += (' and ' + teacherEmail);
                    } else {
                        message += (', ' + teacherEmail);
                    }
                }

                message = message + (lstTeacherEmail.length > 1 ? ' do not belong to a teacher' : ' does not belong to a teacher');
                LoggerUtil.error(MethodName, 'Error retrieving common student list |', message, '|', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_ERROR);
                return {
                    message,
                    returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_ERROR
                };
            }
        } else {
            lstTeacherUserFromDb = UserListResponse.lstUser;
        }

        for (const teacherEmail of lstTeacherEmail) {

            let teacherUser: User = null;

            if (lstTeacherUserFromDb.length) {
                for (const teacherUserObj of lstTeacherUserFromDb) {
                    if (teacherUserObj.email === teacherEmail) {

                        // Check if teacherUserObj.accessLevel is equals to teacher
                        if (teacherUserObj.accessLevel === ConstantUtil.USER_ACCESS_LEVEL_TEACHER) {
                            teacherUser = teacherUserObj;
                        }

                        break;
                    }
                }
            }

            // Check if teacherUser is null
            if (!teacherUser) {
                lstInvalidTeacherEmail.push(teacherEmail);
            }
        }

        // Check if lstInvalidTeacherEmail.length is not 0 or empty
        if (lstInvalidTeacherEmail.length) {
            let message: string = '';

            for (let i = 0; i < lstInvalidTeacherEmail.length; i++) {
                const teacherEmail = lstInvalidTeacherEmail[i];

                if (i === 0) {
                    message = teacherEmail;
                } else if (i >= (lstInvalidTeacherEmail.length - 1)) { // Last iteration
                    message += (' and ' + teacherEmail);
                } else {
                    message += (', ' + teacherEmail);
                }
            }

            message = message + (lstInvalidTeacherEmail.length > 1 ? ' do not belong to a teacher' : ' does not belong to a teacher');
            LoggerUtil.error(MethodName, 'Error retrieving common student list |', message, '|', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_ERROR);
            return {
                message,
                returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_ERROR
            };
        }

        const lstTeacherUserId: number[] = [];

        for (const teacherUser of lstTeacherUserFromDb) {
            lstTeacherUserId.push(teacherUser.pkUserId);
        }

        // Retrieve student list
        try {
            const studentRepository = getCustomRepository(StudentRepository);
            lstStudentFromDb = await studentRepository.find({
                fkTeacherUserId: {
                    pkUserId: In(lstTeacherUserId)
                }
            });
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error retrieving student list | error :', error.message, '|', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_ERROR);
            return {
                message: 'Error retrieving students',
                returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_ERROR
            };
        }

        if (!lstStudentFromDb || !lstStudentFromDb.length) {
            LoggerUtil.error(MethodName, 'Error retrieving student list | No student list found |', currentUserId, '|', CodeUtil.DO_NOT_EXIST_STUDENT_ERROR);
            return {
                message: 'No students found',
                returnCode: CodeUtil.DO_NOT_EXIST_STUDENT_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success retrieving student list | rowsCount :', lstStudentFromDb.length, '|', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS);
        return {
            lstStudent: lstStudentFromDb,
            returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS
        };
    }

    /**
     * Get Allowed For Notification Student List
     * @param {int} currentUserId
     * @param {int[]} studentRequest
     * @return {object} StudentListResponse
     */
    public static async getAllowedForNotificationStudentList(currentUserId: number, studentRequest: StudentRequest): Promise<StudentListResponse> {
        const MethodName = 'GetAllowedForNotificationStudentList |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| studentRequest :', studentRequest);

        const lstStudentFromDb: Student[] = [];
        const lstStudentEmail: string[] = [];

        // studentRequest must not be null
        if (!studentRequest) {
            LoggerUtil.error(MethodName, 'Null studentRequest |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        const teacherEmail = studentRequest.teacher;
        const notification = studentRequest.notification;

        // Validate Fields

        // Check if teacherEmail is null or invalid
        if (!teacherEmail || !this.validator.isEmail(teacherEmail)) {
            LoggerUtil.error(MethodName, 'Null or invalid teacherEmail |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Check if notification is null
        if (!notification) {
            LoggerUtil.error(MethodName, 'Null notification |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: `Field 'notification' must not be null`,
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Retrieve user
        const UserResponse = await UserService.getUserByEmail(currentUserId, teacherEmail);

        // Check if error retrieving user
        if (UserResponse.returnCode !== CodeUtil.RETRIEVE_USER_SUCCESS) {
            LoggerUtil.error(MethodName, 'Error retrieving allowed for notification student list | Unable to retrieve user |', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_ERROR);
            return {
                message: `${teacherEmail} does not belong to a teacher`,
                returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_ERROR
            };
        }

        const teacherUser = UserResponse.user;

        // Check if teacherUser.accessLevel is not equals to teacher
        if (teacherUser.accessLevel !== ConstantUtil.USER_ACCESS_LEVEL_TEACHER) {
            LoggerUtil.error(MethodName, 'Error retrieving allowed for notification student list | teacherUser.accessLevel is not teacher |', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_ERROR);
            return {
                message: `${teacherEmail} doesn't belong to a teacher`,
                returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_ERROR
            };
        }

        // Extract the @mention emails
        const lstEmailFromNotification = CommonUtil.extractMentionEmailsFromText(notification);

        // Check if splittedNotification is not empty
        if (lstEmailFromNotification.length) {
            const lstStudentEmailFromNotification: string[] = [];

            for (let email of lstEmailFromNotification) {
                email = email.trim();

                // Check if email is valid and has no duplicates
                if (this.validator.isEmail(email) && !lstStudentEmailFromNotification.includes(email)) {
                    lstStudentEmailFromNotification.push(email);
                }
            }

            // Check if lstStudentEmail is not empty
            if (lstStudentEmailFromNotification.length) {

                // Retrieve user list
                const UserListResponse = await UserService.getUserListByLstEmail(currentUserId, lstStudentEmailFromNotification);

                // Check if success retrieving user list
                if (UserListResponse.returnCode === CodeUtil.RETRIEVE_USER_LIST_SUCCESS) {
                    const lstStudentUserFromDb = UserListResponse.lstUser;

                    for (const studentUser of lstStudentUserFromDb) {

                        // Check if studentUser.accessLevel is equals to student and studentUser.status is active
                        if (studentUser.accessLevel === ConstantUtil.USER_ACCESS_LEVEL_STUDENT && studentUser.status === ConstantUtil.USER_STATUS_ACTIVE) {
                            lstStudentEmail.push(studentUser.email);
                        }
                    }
                }
            }
        }

        // Retrieve student list
        const StudentListResponse = await this.getStudentListByTeacherUserId(currentUserId, teacherUser.pkUserId);

        // Check if not success retrieving and do not exist student list
        if (StudentListResponse.returnCode !== CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS &&
            StudentListResponse.returnCode !== CodeUtil.DO_NOT_EXIST_STUDENT_ERROR) {
            LoggerUtil.error(MethodName, 'Error retrieving allowed for notification student list | Unable to retrieve student list |', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS);
            return {
                message: 'Error retrieving students',
                returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS
            };
        }

        // Check if success retrieving student list
        if (StudentListResponse.returnCode === CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS) {
            for (const student of StudentListResponse.lstStudent) {

                // Check if student.fkStudentUserId.status is active
                if (student.fkStudentUserId.status === ConstantUtil.USER_STATUS_ACTIVE) {
                    lstStudentFromDb.push(student);
                }
            }
        }

        LoggerUtil.info(MethodName, 'Success retrieving allowed for notification student list |', currentUserId, '|', CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS);
        return {
            lstStudent: lstStudentFromDb,
            lstStudentEmail,
            returnCode: CodeUtil.RETRIEVE_STUDENT_LIST_SUCCESS
        };
    }

    // ----------------------------------------------------------------------
    // Module specific section
    // ----------------------------------------------------------------------

    // ----------------------------------------------------------------------
    // Generic method section
    // ----------------------------------------------------------------------

}