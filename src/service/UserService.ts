/**
 *
 * User Service
 * Create Update Delete Retrieve
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { EntityManager, getCustomRepository, In, Transaction, TransactionManager } from 'typeorm';
import { validate, Validator } from 'class-validator';

import { CodeUtil } from '../util/CodeUtil';
import { CommonUtil } from '../util/CommonUtil';
import { ConstantUtil } from '../util/ConstantUtil';
import { LoggerUtil } from '../util/LoggerUtil';

import { User } from '../entity/User';

import { UserRepository } from '../repository/UserRepository';

import { UserRequest } from '../interface/request/api/UserRequest';

import { UserResponse } from '../interface/response/UserResponse';
import { UserListResponse } from '../interface/response/UserListResponse';

export class UserService {

    private static validator = new Validator();

    // private static userRepository = getCustomRepository(UserRepository);

    // ----------------------------------------------------------------------
    // Create update delete section
    // ----------------------------------------------------------------------

    /**
     * Note: For testing purposes only. Not to be used in production.
     * Create Test User List
     * @param {object[]} lstUserRequest
     * @return {object} UserListResponse
     */
    public static async createTestUserList(lstUserRequest: UserRequest[]): Promise<UserListResponse> {
        const MethodName = 'CreateTestUserList |';
        LoggerUtil.info(MethodName, 'lstUserRequest :', lstUserRequest);

        let lstUserFromDb: User[] = null;
        const lstUser: User[] = [];

        // lstUserRequest must not be null
        if (!lstUserRequest) {
            LoggerUtil.error(MethodName, 'Null lstUserRequest |', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Validate Fields

        for (const userRequest of lstUserRequest) {
            if (userRequest) {

                // Check if userRequest.email is null
                if (!userRequest.email) {
                    LoggerUtil.error(MethodName, 'Null email |', CodeUtil.INVALID_PARAMETER);
                    return {
                        message: `Field 'email' must not be null`,
                        returnCode: CodeUtil.INVALID_PARAMETER
                    };
                }

                // Check if userRequest.email is invalid email
                if (!this.validator.isEmail(userRequest.email)) {
                    LoggerUtil.error(MethodName, `${userRequest.email} is not a valid email |`, CodeUtil.INVALID_PARAMETER);
                    return {
                        message: `${userRequest.email} is not a valid email`,
                        returnCode: CodeUtil.INVALID_PARAMETER
                    };
                }

                // Check if userRequest.accessLevel is null
                if (!userRequest.accessLevel) {
                    LoggerUtil.error(MethodName, 'Null accessLevel |', CodeUtil.INVALID_PARAMETER);
                    return {
                        message: 'Invalid access level',
                        returnCode: CodeUtil.INVALID_PARAMETER
                    };
                }

                const user = new User();
                user.firstName = userRequest.firstName;
                user.lastName = userRequest.lastName;
                user.photo = userRequest.photo;
                user.email = userRequest.email;
                // user.password = password; // Auto-generated password
                user.accessLevel = userRequest.accessLevel;
                user.status = userRequest.status || ConstantUtil.USER_STATUS_ACTIVE;
                user.createdAt = new Date();
                user.updatedAt = new Date();

                lstUser.push(user);
            }
        }

        // Validate lstUser array
        const objectErrors = await validate(lstUser);

        if (objectErrors.length) {
            LoggerUtil.error(MethodName, 'Invalid user object | objectErrors :', objectErrors, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Create user list
        try {
            const userRepository = getCustomRepository(UserRepository);
            lstUserFromDb = await userRepository.save(lstUser);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error creating test user list | error :', error.message, '|', CodeUtil.CREATE_USER_ERROR);
            let message = null;

            // Check if user email already exist
            if (error.message.indexOf('unq_user_email') != -1) {
                message = 'Email already used';
            }

            return {
                message: message || 'Error creating test user list',
                returnCode: CodeUtil.CREATE_USER_ERROR
            };
        }

        if (!lstUserFromDb) {
            LoggerUtil.error(MethodName, 'Error creating test user list |', CodeUtil.CREATE_USER_ERROR);
            return {
                message: 'Error creating test users',
                returnCode: CodeUtil.CREATE_USER_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success creating test user list |', CodeUtil.CREATE_USER_SUCCESS);
        return {
            lstUser: lstUserFromDb,
            returnCode: CodeUtil.CREATE_USER_SUCCESS
        };
    }

    /**
     * Create User | Transaction
     * @param {object} transactionManager
     * @param {object} user
     * @return {object} UserResponse
     */
    // @Transaction()
    public static async createUser(@TransactionManager() transactionManager: EntityManager, user: User): Promise<UserResponse> {
        const MethodName = 'CreateUser |';
        LoggerUtil.info(MethodName, 'user :', user);

        let userFromDb: User = null;

        // user must not be null
        if (!user) {
            LoggerUtil.error(MethodName, 'Null user |', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // pkUserId must be null
        if (user.pkUserId) {
            LoggerUtil.error(MethodName, 'Not null pkUserId |', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Validate Fields
        const objectErrors = await validate(user);

        if (objectErrors.length) {
            LoggerUtil.error(MethodName, 'Invalid user object | objectErrors :', objectErrors, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Create user
        try {
            const userRepository = transactionManager.getCustomRepository(UserRepository);
            userFromDb = await userRepository.save(user);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error creating user | error :', error.message, '|', CodeUtil.CREATE_USER_ERROR);
            let message = null;

            // Check if user email already exist
            if (error.message.indexOf('unq_user_email') != -1) {
                message = 'Email already used';
            }

            return {
                message: message || 'Error creating test user',
                returnCode: CodeUtil.CREATE_USER_ERROR
            };
        }

        if (!userFromDb) {
            LoggerUtil.error(MethodName, 'Error creating user |', CodeUtil.CREATE_USER_ERROR);
            return {
                message: 'Error creating user',
                returnCode: CodeUtil.CREATE_USER_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success creating user |', CodeUtil.CREATE_USER_SUCCESS);
        return {
            user: userFromDb,
            returnCode: CodeUtil.CREATE_USER_SUCCESS
        };
    }

    /**
     * Create User List | Transaction
     * @param {object} transactionManager
     * @param {int} currentUserId
     * @param {object} lstUser
     * @return {object} UserListResponse
     */
    // @Transaction()
    public static async createUserList(@TransactionManager() transactionManager: EntityManager, currentUserId: number, lstUser: User[]): Promise<UserListResponse> {
        const MethodName = 'CreateUserList |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| lstUser :', lstUser);

        let lstUserFromDb: User[] = null;

        // // currentUserId is required for all create/update/delete
        // if (!currentUserId) {
        //     LoggerUtil.error(MethodName, 'Null currentUserId | Unauthorized access |', CodeUtil.UNSTUDENTORIZED_ACCESS);
        //     return {
        //         message: 'Unauthorized access',
        //         returnCode: CodeUtil.UNSTUDENTORIZED_ACCESS
        //     };
        // }

        // lstUser must not be null
        if (!lstUser) {
            LoggerUtil.error(MethodName, 'Null lstUser |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Validate Fields
        const objectErrors = await validate(lstUser);

        if (objectErrors.length) {
            LoggerUtil.error(MethodName, 'Invalid lstUser object | objectErrors :', objectErrors, '|', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Create user list
        try {
            const userRepository = transactionManager.getCustomRepository(UserRepository);
            lstUserFromDb = await userRepository.save(lstUser);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error creating user list | error :', error.message, '|', currentUserId, '|', CodeUtil.CREATE_USER_ERROR);
            let message = null;

            // Check if user email already exist
            if (error.message.indexOf('unq_user_email') != -1) {
                message = 'Email already used';
            }

            return {
                message: message || 'Error creating users',
                returnCode: CodeUtil.CREATE_USER_ERROR
            };
        }

        if (!lstUserFromDb) {
            LoggerUtil.error(MethodName, 'Error creating user list |', currentUserId, '|', CodeUtil.CREATE_USER_ERROR);
            return {
                message: 'Error creating users',
                returnCode: CodeUtil.CREATE_USER_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success creating user list |', currentUserId, '|', CodeUtil.CREATE_USER_SUCCESS);
        return {
            lstUser: lstUserFromDb,
            returnCode: CodeUtil.CREATE_USER_SUCCESS
        };
    }

    /**
     * Update User
     * @param {int} currentUserId
     * @param {object} userRequest
     * @return {object} UserResponse
     */
    public static async updateUser(currentUserId: number, userRequest: UserRequest): Promise<UserResponse> {
        const MethodName = 'UpdateUser |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| userRequest :', userRequest);

        let userFromDb: User = null;

        // // currentUserId is required for all create/update/delete
        // if (!currentUserId) {
        //     LoggerUtil.error(MethodName, 'Null currentUserId | Unauthorized access |', CodeUtil.UNSTUDENTORIZED_ACCESS);
        //     return {
        //         message: 'Unauthorized access',
        //         returnCode: CodeUtil.UNSTUDENTORIZED_ACCESS
        //     };
        // }

        // userRequest must not be null
        if (!userRequest) {
            LoggerUtil.error(MethodName, 'Null userRequest |', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // userRequest.userId must not be null
        if (!userRequest.userId) {
            LoggerUtil.error(MethodName, 'Null userId |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: `Field 'userId' must not be null or empty`,
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // userRequest.firstName and userRequest.lastName must not be null
        if (!userRequest.firstName || !userRequest.lastName) {
            LoggerUtil.error(MethodName, 'Null firstName or null lastName |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: `Field 'firstName' and 'lastName' must not be null or empty`,
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Retrieve user
        const UserResponse = await this.getUserByUserId(currentUserId, userRequest.userId);

        // Check if error retrieving user
        if (UserResponse.returnCode !== CodeUtil.RETRIEVE_USER_SUCCESS) {
            LoggerUtil.error(MethodName, 'Error adding student list | Unable to retrieve user |', currentUserId, '|', CodeUtil.UPDATE_USER_ERROR);
            return {
                message: UserResponse.returnCode === CodeUtil.DO_NOT_EXIST_USER_ERROR ? `UserId ${userRequest.userId} does not exist` : 'Error updating user',
                returnCode: CodeUtil.UPDATE_USER_ERROR
            };
        }

        const user = UserResponse.user;
        user.firstName = userRequest.firstName;
        user.lastName = userRequest.lastName;
        user.updatedAt = new Date();

        // Validate user object
        const objectErrors = await validate(user);

        if (objectErrors.length) {
            LoggerUtil.error(MethodName, 'Invalid user object | objectErrors :', objectErrors, '|', currentUserId, '|', CodeUtil.UPDATE_USER_ERROR);
            return {
                message: 'Error updating user',
                returnCode: CodeUtil.UPDATE_USER_ERROR
            };
        }

        // Create user
        try {
            const userRepository = getCustomRepository(UserRepository);
            userFromDb = await userRepository.save(user);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error updating user | error :', error.message, '|', currentUserId, '|', CodeUtil.UPDATE_USER_ERROR);
            return {
                message: 'Error updating user',
                returnCode: CodeUtil.UPDATE_USER_ERROR
            };
        }

        if (!userFromDb) {
            LoggerUtil.error(MethodName, 'Error updating user |', currentUserId, '|', CodeUtil.UPDATE_USER_ERROR);
            return {
                message: 'Error updating user',
                returnCode: CodeUtil.UPDATE_USER_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success updating user |', currentUserId, '|', CodeUtil.UPDATE_USER_SUCCESS);
        return {
            user: userFromDb,
            returnCode: CodeUtil.UPDATE_USER_SUCCESS
        };
    }

    /**
     * Update Student User Status To Suspended
     * @param {int} currentUserId
     * @param {string} email
     * @return {object} UserResponse
     */
    public static async updateStudentUserStatusToSuspended(currentUserId: number, email: string): Promise<UserResponse> {
        const MethodName = 'UpdateStudentUserStatusToSuspended |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| email :', email);

        let userFromDb: User = null;

        // // currentUserId is required for all create/update/delete
        // if (!currentUserId) {
        //     LoggerUtil.error(MethodName, 'Null currentUserId | Unauthorized access |', CodeUtil.UNSTUDENTORIZED_ACCESS);
        //     return {
        //         message: 'Unauthorized access',
        //         returnCode: CodeUtil.UNSTUDENTORIZED_ACCESS
        //     };
        // }

        // email must not be null
        if (!email) {
            LoggerUtil.error(MethodName, 'Null email |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: `Field 'student' should be a valid student email`,
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Validate Fields

        // Check if email is invalid
        if (!this.validator.isEmail(email)) {
            LoggerUtil.error(MethodName, 'Invalid email |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: `Field 'student' should be a valid student email`,
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Retrieve user
        const UserResponse = await this.getUserByEmail(currentUserId, email);

        // Check if error retrieving user
        if (UserResponse.returnCode !== CodeUtil.RETRIEVE_USER_SUCCESS) {
            LoggerUtil.error(MethodName, 'Error updating student status to suspended | Unable to retrieve user |', currentUserId, '|', CodeUtil.UPDATE_USER_ERROR);
            return {
                message: UserResponse.returnCode === CodeUtil.DO_NOT_EXIST_USER_ERROR ? `${email} doesn't belong to a student` : 'Error suspending student',
                returnCode: CodeUtil.UPDATE_USER_ERROR
            };
        }

        const user = UserResponse.user;

        // Check if user.accessLevel is not equals to student
        if (user.accessLevel !== ConstantUtil.USER_ACCESS_LEVEL_STUDENT) {
            const message = `${email} doesn't belong to a student`;
            LoggerUtil.error(MethodName, 'Error updating student status to suspended |', message, '|', currentUserId, '|', CodeUtil.UPDATE_USER_ERROR);
            return {
                message,
                returnCode: CodeUtil.UPDATE_USER_ERROR
            };
        }

        user.status = ConstantUtil.USER_STATUS_SUSPENDED_STUDENT;
        user.updatedAt = new Date();

        // Validate user object
        const objectErrors = await validate(user);

        if (objectErrors.length) {
            LoggerUtil.error(MethodName, 'Invalid user object | objectErrors :', objectErrors, '|', currentUserId, '|', CodeUtil.UPDATE_USER_ERROR);
            return {
                message: 'Error suspending student',
                returnCode: CodeUtil.UPDATE_USER_ERROR
            };
        }

        // Create user
        try {
            const userRepository = getCustomRepository(UserRepository);
            userFromDb = await userRepository.save(user);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error updating student status to suspended | error :', error.message, '|', currentUserId, '|', CodeUtil.UPDATE_USER_ERROR);
            return {
                message: 'Error suspending student',
                returnCode: CodeUtil.UPDATE_USER_ERROR
            };
        }

        if (!userFromDb) {
            LoggerUtil.error(MethodName, 'Error updating student status to suspended |', currentUserId, '|', CodeUtil.UPDATE_USER_ERROR);
            return {
                message: 'Error suspending student',
                returnCode: CodeUtil.UPDATE_USER_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success updating student status to suspended |', currentUserId, '|', CodeUtil.UPDATE_USER_SUCCESS);
        return {
            user: userFromDb,
            returnCode: CodeUtil.UPDATE_USER_SUCCESS
        };
    }

    // ----------------------------------------------------------------------
    // Data retrieval section
    // ----------------------------------------------------------------------

    /**
     * Get User By UserId
     * @param {int} currentUserId
     * @param {int} userId
     * @return {object} UserResponse
     */
    public static async getUserByUserId(currentUserId: number, userId: number): Promise<UserResponse> {
        const MethodName = 'GetUserByUserId |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| userId :', userId);

        let userFromDb: User = null;

        // // userId must not be null
        // if (!userId) {
        //     LoggerUtil.error(MethodName, 'Null userId |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
        //     return {
        //         message: 'Invalid parameter',
        //         returnCode: CodeUtil.INVALID_PARAMETER
        //     };
        // }

        // Validate Fields

        if (!Number(userId)) {
            LoggerUtil.error(MethodName, 'Invalid userId |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Retrieve user
        try {
            const userRepository = getCustomRepository(UserRepository);
            userFromDb = await userRepository.findOne(userId);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error retrieving user | error :', error.message, '|', currentUserId, '|', CodeUtil.RETRIEVE_USER_ERROR);
            return {
                message: 'Error retrieving user',
                returnCode: CodeUtil.RETRIEVE_USER_ERROR
            };
        }

        if (!userFromDb) {
            LoggerUtil.error(MethodName, 'userId :', userId, 'does not exist |', currentUserId, '|', CodeUtil.DO_NOT_EXIST_USER_ERROR);
            return {
                message: 'User does not exist',
                returnCode: CodeUtil.DO_NOT_EXIST_USER_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success retrieving user | userId :', userId, '|', currentUserId, '|', CodeUtil.RETRIEVE_USER_SUCCESS);
        return {
            user: userFromDb,
            returnCode: CodeUtil.RETRIEVE_USER_SUCCESS
        };
    }

    /**
     * Get User By Email
     * @param {int} currentUserId
     * @param {string} email
     * @return {object} UserResponse
     */
    public static async getUserByEmail(currentUserId: number, email: string): Promise<UserResponse> {
        const MethodName = 'GetUserByUserId |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| email :', email);

        let userFromDb: User = null;

        // email must not be null
        if (!email) {
            LoggerUtil.error(MethodName, 'Null email |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Validate Fields

        // Check if email is invalid
        if (!this.validator.isEmail(email)) {
            LoggerUtil.error(MethodName, 'Invalid email |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Retrieve user
        try {
            const userRepository = getCustomRepository(UserRepository);
            userFromDb = await userRepository.findOne({
                email
            });
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error retrieving user | error :', error.message, '|', currentUserId, '|', CodeUtil.RETRIEVE_USER_ERROR);
            return {
                message: 'Error retrieving user',
                returnCode: CodeUtil.RETRIEVE_USER_ERROR
            };
        }

        if (!userFromDb) {
            LoggerUtil.error(MethodName, 'userId :', email, 'does not exist |', currentUserId, '|', CodeUtil.DO_NOT_EXIST_USER_ERROR);
            return {
                message: 'User does not exist',
                returnCode: CodeUtil.DO_NOT_EXIST_USER_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success retrieving user | userId :', email, '|', currentUserId, '|', CodeUtil.RETRIEVE_USER_SUCCESS);
        return {
            user: userFromDb,
            returnCode: CodeUtil.RETRIEVE_USER_SUCCESS
        };
    }

    /**
     * Get User List By LstUserId
     * @param {int} currentUserId
     * @param {int[]} lstUserId
     * @return {object} UserListResponse
     */
    public static async getUserListByLstUserId(currentUserId: number, lstUserId: number[]): Promise<UserListResponse> {
        const MethodName = 'GetUserListByLstUserId |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| lstUserId :', lstUserId);

        let lstUserFromDb: User[] = null;

        // Validate Fields

        // Check if lstUserId is not an array
        if (!this.validator.isArray(lstUserId) || !this.validator.arrayNotEmpty(lstUserId)) {
            LoggerUtil.error(MethodName, 'lstUserId is not an array or empty |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        // Retrieve user list
        try {
            const userRepository = getCustomRepository(UserRepository);
            lstUserFromDb = await userRepository.findByIds(lstUserId);
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error retrieving user list | error :', error.message, '|', currentUserId, '|', CodeUtil.RETRIEVE_USER_LIST_ERROR);
            return {
                message: 'Error retrieving users',
                returnCode: CodeUtil.RETRIEVE_USER_LIST_ERROR
            };
        }

        if (!lstUserFromDb || !lstUserFromDb.length) {
            LoggerUtil.error(MethodName, 'Error retrieving user list | No user list found |', currentUserId, '|', CodeUtil.DO_NOT_EXIST_USER_ERROR);
            return {
                message: 'No users found',
                returnCode: CodeUtil.DO_NOT_EXIST_USER_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success retrieving user list | rowsCount :', lstUserFromDb.length, '|', currentUserId, '|', CodeUtil.RETRIEVE_USER_LIST_SUCCESS);
        return {
            lstUser: lstUserFromDb,
            returnCode: CodeUtil.RETRIEVE_USER_LIST_SUCCESS
        };
    }

    /**
     * Get User List By LstEmail
     * @param {int} currentUserId
     * @param {string[]} lstEmail
     * @return {object} UserListResponse
     */
    public static async getUserListByLstEmail(currentUserId: number, lstEmail: string[]): Promise<UserListResponse> {
        const MethodName = 'GetUserListByLstEmail |';
        LoggerUtil.info(MethodName, 'currentUserId :', currentUserId, '| lstEmail :', lstEmail);

        let lstUserFromDb: User[] = null;

        // Validate Fields

        // Check if lstEmail is not an array
        if (!this.validator.isArray(lstEmail) || !this.validator.arrayNotEmpty(lstEmail)) {
            LoggerUtil.error(MethodName, 'lstEmail is not an array or empty |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
            return {
                message: 'Invalid parameter',
                returnCode: CodeUtil.INVALID_PARAMETER
            };
        }

        for (const email of lstEmail) {

            // Check if email is invalid
            if (!this.validator.isEmail(email)) {
                LoggerUtil.error(MethodName, 'Invalid email |', currentUserId, '|', CodeUtil.INVALID_PARAMETER);
                return {
                    message: 'Invalid parameter',
                    returnCode: CodeUtil.INVALID_PARAMETER
                };
            }
        }

        // Retrieve user list
        try {
            const userRepository = getCustomRepository(UserRepository);
            lstUserFromDb = await userRepository.find({
                email: In(lstEmail)
            });
        } catch (error) {
            LoggerUtil.error(MethodName, 'Error retrieving user list | error :', error.message, '|', currentUserId, '|', CodeUtil.RETRIEVE_USER_LIST_ERROR);
            return {
                message: 'Error retrieving users',
                returnCode: CodeUtil.RETRIEVE_USER_LIST_ERROR
            };
        }

        if (!lstUserFromDb || !lstUserFromDb.length) {
            LoggerUtil.error(MethodName, 'Error retrieving user list | No user list found |', currentUserId, '|', CodeUtil.DO_NOT_EXIST_USER_ERROR);
            return {
                message: 'No users found',
                returnCode: CodeUtil.DO_NOT_EXIST_USER_ERROR
            };
        }

        LoggerUtil.info(MethodName, 'Success retrieving user list | rowsCount :', lstUserFromDb.length, '|', currentUserId, '|', CodeUtil.RETRIEVE_USER_LIST_SUCCESS);
        return {
            lstUser: lstUserFromDb,
            returnCode: CodeUtil.RETRIEVE_USER_LIST_SUCCESS
        };
    }

    // ----------------------------------------------------------------------
    // Module specific section
    // ----------------------------------------------------------------------

    // ----------------------------------------------------------------------
    // Generic method section
    // ----------------------------------------------------------------------

}