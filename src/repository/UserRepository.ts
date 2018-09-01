/**
 *
 * User Repository
 * Create Update Delete Retrieve
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { EntityRepository, Repository } from 'typeorm';

import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {



}