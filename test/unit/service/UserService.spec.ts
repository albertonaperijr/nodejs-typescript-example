/**
 *
 * User Service Unit Test
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

import { User } from '../../../src/entity/User';

import { UserService } from '../../../src/service/UserService';

import { UserResponse } from '../../../src/interface/response/UserResponse';
import { UserListResponse } from '../../../src/interface/response/UserListResponse';

const userResponse: UserResponse = {
    user: new User(),
    message: null,
    returnCode: null
};

const userListResponse: UserListResponse = {
    lstUser: [new User()],
    message: null,
    returnCode: null
};

const expectedUserResponse: UserResponse = userResponse;
let actualUserResponse: UserResponse = userResponse;

const expectedUserListResponse: UserListResponse = userListResponse;
let actualUserListResponse: UserListResponse = userListResponse;

// describe('UserServiceTest @watch', () => {
describe('UserServiceTest', () => {

    before(async () => {
        // Do nothing
    });

    /**
     * Normal Test
     */
    describe('NormalTest', () => {

        describe('updateStudentUserStatusToSuspended', () => {
            it('should update the student user status to suspended using EXISTING student email', async () => {
                expectedUserResponse.returnCode = CodeUtil.UPDATE_USER_SUCCESS;
                actualUserResponse = await UserService.updateStudentUserStatusToSuspended(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.EXISTING_STUDENT_USER_EMAIL);
                assert.equal(actualUserResponse.returnCode, expectedUserResponse.returnCode,
                    'User update must be successful');
            });
        });

        describe('getUserByUserId', () => {
            it('should retrieve the user using EXISTING userId', async () => {
                expectedUserResponse.returnCode = CodeUtil.RETRIEVE_USER_SUCCESS;
                actualUserResponse = await UserService.getUserByUserId(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.EXISTING_USER_ID);
                assert.equal(actualUserResponse.returnCode, expectedUserResponse.returnCode,
                    'User retrieval must be successful');
                assert.isNotNull(actualUserResponse.user,
                    'User object must not be null');
            });
        });

        describe('getUserByEmail', () => {
            it('should retrieve the user using EXISTING email', async () => {
                expectedUserResponse.returnCode = CodeUtil.RETRIEVE_USER_SUCCESS;
                actualUserResponse = await UserService.getUserByEmail(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.EXISTING_EMAIL);
                assert.equal(actualUserResponse.returnCode, expectedUserResponse.returnCode,
                    'User retrieval must be successful');
                assert.isNotNull(actualUserResponse.user,
                    'User object must not be null');
            });
        });

        describe('getUserListByLstUserId', () => {
            it('should retrieve the user list using EXISTING userIds', async () => {
                expectedUserListResponse.returnCode = CodeUtil.RETRIEVE_USER_LIST_SUCCESS;
                actualUserListResponse = await UserService.getUserListByLstUserId(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.EXISTING_USER_IDS);
                assert.equal(actualUserListResponse.returnCode, expectedUserListResponse.returnCode,
                    'User list retrieval must be successful');
                assert.isNotNull(actualUserListResponse.lstUser,
                    'User list object must not be null');
            });
        });

        describe('getUserListByLstEmail', () => {
            it('should retrieve the user list using EXISTING emails', async () => {
                expectedUserListResponse.returnCode = CodeUtil.RETRIEVE_USER_LIST_SUCCESS;
                actualUserListResponse = await UserService.getUserListByLstEmail(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.EXISTING_EMAILS);
                assert.equal(actualUserListResponse.returnCode, expectedUserListResponse.returnCode,
                    'User list retrieval must be successful');
                assert.isNotNull(actualUserListResponse.lstUser,
                    'User list object must not be null');
            });
        });

    });

    /**
     * Error Test
     */
    describe('ErrorTest', () => {

        describe('updateStudentUserStatusToSuspended', () => {
            it('should NOT update the student user status to suspended using NULL student email', async () => {
                expectedUserResponse.returnCode = CodeUtil.INVALID_PARAMETER;
                actualUserResponse = await UserService.updateStudentUserStatusToSuspended(ConstantUtil.DEFAULT_CURRENT_USER_ID, null);
                assert.equal(actualUserResponse.returnCode, expectedUserResponse.returnCode,
                    'Should NOT update user');
            });

            it('should NOT update the student user status to suspended using NON-EXISTING student email', async () => {
                expectedUserResponse.returnCode = CodeUtil.UPDATE_USER_ERROR;
                actualUserResponse = await UserService.updateStudentUserStatusToSuspended(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.NON_EXISTING_EMAIL);
                assert.equal(actualUserResponse.returnCode, expectedUserResponse.returnCode,
                    'Should NOT update user');

            });
        });

        describe('getUserByUserId', () => {
            it('should NOT retrieve the user using NULL userId', async () => {
                expectedUserResponse.returnCode = CodeUtil.INVALID_PARAMETER;
                actualUserResponse = await UserService.getUserByUserId(ConstantUtil.DEFAULT_CURRENT_USER_ID, null);
                assert.equal(actualUserResponse.returnCode, expectedUserResponse.returnCode,
                    'Should NOT retrieve user');
            });

            it('should NOT retrieve the user using NON-EXISTING userId', async () => {
                expectedUserResponse.returnCode = CodeUtil.DO_NOT_EXIST_USER_ERROR;
                actualUserResponse = await UserService.getUserByUserId(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.NON_EXISTING_USER_ID);
                assert.equal(actualUserResponse.returnCode, expectedUserResponse.returnCode,
                    'Should NOT retrieve user');

            });
        });

        describe('getUserByEmail', () => {
            it('should NOT retrieve the user using NULL email', async () => {
                expectedUserResponse.returnCode = CodeUtil.INVALID_PARAMETER;
                actualUserResponse = await UserService.getUserByEmail(ConstantUtil.DEFAULT_CURRENT_USER_ID, null);
                assert.equal(actualUserResponse.returnCode, expectedUserResponse.returnCode,
                    'Should NOT retrieve user');
            });

            it('should NOT retrieve the user using NON-EXISTING email', async () => {
                expectedUserResponse.returnCode = CodeUtil.DO_NOT_EXIST_USER_ERROR;
                actualUserResponse = await UserService.getUserByEmail(ConstantUtil.DEFAULT_CURRENT_USER_ID, TestVariable.NON_EXISTING_EMAIL);
                assert.equal(actualUserResponse.returnCode, expectedUserResponse.returnCode,
                    'Should NOT retrieve user');

            });
        });

    });

});

/**
 * Default Values
 */

// const user: User = new User();
// user.pkUserId = null;
// user.firstName = 'Test';
// user.lastName = 'Account';
// user.gender = ConstantUtil.GENDER_MALE;
// user.photo = null;
// user.status = ConstantUtil.USER_STATUS_ACTIVE;
// user.createdAt = new Date();
// user.updatedAt = new Date();