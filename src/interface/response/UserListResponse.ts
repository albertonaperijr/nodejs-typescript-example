/**
 *
 * User List Response
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { User } from '../../entity/User';
import { ReturnCodeResponse } from './ReturnCodeResponse';

export interface UserListResponse extends ReturnCodeResponse {
    lstUser?: User[];
}