/**
 *
 * User Request
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

export interface UserRequest {
    userId?: number;
    firstName?: string;
    lastName?: string;
    photo?: string;
    email?: string;
    accessLevel?: number;
    status?: number;
}