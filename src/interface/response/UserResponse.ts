/**
 *
 * User Response
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { User } from '../../entity/User';
import { ReturnCodeResponse } from './ReturnCodeResponse';

export interface UserResponse extends ReturnCodeResponse {
    user?: User;
}