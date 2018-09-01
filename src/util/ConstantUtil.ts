/**
 *
 * Constant Util
 *
 * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr. *
 * * * * * * * * * * * * * * * *
 *
 */

export const ConstantUtil = {

    EXISTING_USER_ID: 1,

    DEFAULT_CURRENT_USER_ID: 0,

    AUTHORIZATION_HEADER_PREFIX: 'Bearer ',

    STUDENT_STATUS_ACTIVE: 1,
    STUDENT_STATUS_INACTIVE: 2,
    // STUDENT_STATUS_SUSPENDED: 3,

    USER_ACCESS_LEVEL_TEACHER: 1,
    USER_ACCESS_LEVEL_STUDENT: 2,

    USER_STATUS_ACTIVE: 1,
    USER_STATUS_INACTIVE: 2,
    USER_STATUS_BLOCKED: 3,
    USER_STATUS_SUSPENDED_STUDENT: 4,

    // Config
    APP_NAME: process.env.APP_NAME,

    // Postgres Config
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: Number(process.env.MYSQL_PORT),
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_USERNAME: process.env.MYSQL_USERNAME,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,

    // JWT | Token Config
    PASSWORD_SALT_ROUNDS: 10,
    JWT_AUTH_SECRET_KEY: process.env.JWT_AUTH_SECRET_KEY,
    JWT_RESET_PASSWORD_SECRET_KEY: process.env.JWT_RESET_PASSWORD_SECRET_KEY,
    DEFAULT_AUTH_EXPIRATION: '7d',
    DEFAULT_EMAIL_TOKEN_EXPIRATION: null,
    DEFAULT_RESET_PASSWORD_TOKEN_EXPIRATION: null,

    // Password
    PASSWORD_MIN_LENGTH: 8,

};