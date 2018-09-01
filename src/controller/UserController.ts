/**
 *
 * User Controller
 * Create Update Delete Retrieve
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { Body, BodyParam, ContentType, Get, JsonController, Param, Post, Put, Res } from 'routing-controllers';
import { Response } from 'express';

import { CurrentUserId } from '../decorator/CurrentUserIdDecorator';

import { CodeManagerUtil } from '../util/CodeManagerUtil';
import { CodeUtil } from '../util/CodeUtil';

import { UserService } from '../service/UserService';

import { UserRequest } from '../interface/request/api/UserRequest';

import { UserResponse } from '../interface/response/UserResponse';
import { UserListResponse } from '../interface/response/UserListResponse';

@JsonController('/users')
export class UserController {

    private userService = UserService;

    @Post('/createtestusers')
    @ContentType('application/json')
    async createTestUser(
        @BodyParam('users') lstUserRequest: UserRequest[],
        @Res() response: Response
    ) {

        // Create test user list
        const UserListResponse = await this.userService.createTestUserList(lstUserRequest);

        // Check if error creating test user list
        if (UserListResponse.returnCode !== CodeUtil.CREATE_USER_SUCCESS) {
            response.statusCode = CodeManagerUtil.getHttpStatusCode(UserListResponse.returnCode);
            return response.send({
                message: UserListResponse.message
            });
        }

        response.statusCode = CodeUtil.HTTP_STATUS_CODE_OK_BUT_NO_CONTENT;
        return response.send();
    }

    @Put('')
    @ContentType('application/json')
    async updateUser(
        @CurrentUserId() currentUserId: number,
        @Body() userRequest: UserRequest,
        @Res() response: Response
    ) {

        // Update user
        const UserResponse = await this.userService.updateUser(currentUserId, userRequest);

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

}