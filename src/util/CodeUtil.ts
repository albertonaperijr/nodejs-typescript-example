/**
 *
 * Code Util
 *
 * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr. *
 * * * * * * * * * * * * * * * *
 *
 */

export const CodeUtil = {

    /**
     * STATUSES
     * 1 Sucess
     * Error
     * Generic Error
     * Database Error
     * Duplicate Error
     *
     * EVENTS ID
     * 00
     * 01 Create
     * 02 Update
     * 03 Retrieve
     * 04 Delete
     * 05 - Do not exist
     * 06 - Validation
     * 07 - Disabled user
     * 08 - Blocked user
     * 09 - Generic event
     * 10 - Invalid parameter
     * 11 - Database generic error
     *
     * CLASS IDS
     * 1	account
     * 2	student
     * 3	user
     *
     * NON-CLASS
     * Validation
     *
     */

    /**
     * Success Codes
     */

    LOGIN_SUCCESS: 10000,

    CREATE_STUDENT_SUCCESS: 10101,
    CREATE_OR_UPDATE_STUDENT_SUCCESS: 10101,
    UPDATE_STUDENT_SUCCESS: 10102,
    RETRIEVE_STUDENT_SUCCESS: 10103,
    RETRIEVE_STUDENT_LIST_SUCCESS: 10103,
    DELETE_STUDENT_SUCCESS: 10104,

    CREATE_USER_SUCCESS: 10201,
    UPDATE_USER_SUCCESS: 10202,
    RETRIEVE_USER_SUCCESS: 10203,
    RETRIEVE_USER_LIST_SUCCESS: 10203,
    DELETE_USER_SUCCESS: 10204,

    /**
     * Mapping Tables
     */

    /**
     * Configuration Classes
     */

    /**
     * Combined Objects
     */

    CREATE_ACCOUNT_SUCCESS: 14101,
    UPDATE_ACCOUNT_SUCCESS: 14102,
    RETRIEVE_ACCOUNT_SUCCESS: 14103,
    DELETE_ACCOUNT_SUCCESS: 14104,

    // Generic

    /**
     * Error Codes
     */

    LOGIN_ERROR: 20000,

    CREATE_STUDENT_ERROR: 20101,
    CREATE_OR_UPDATE_STUDENT_ERROR: 20101,
    UPDATE_STUDENT_ERROR: 20102,
    RETRIEVE_STUDENT_ERROR: 20103,
    RETRIEVE_STUDENT_LIST_ERROR: 20103,
    DELETE_STUDENT_ERROR: 20104,
    DO_NOT_EXIST_STUDENT_ERROR: 20105,

    CREATE_USER_ERROR: 20201,
    UPDATE_USER_ERROR: 20202,
    RETRIEVE_USER_ERROR: 20203,
    RETRIEVE_USER_LIST_ERROR: 20203,
    DELETE_USER_ERROR: 20204,
    DO_NOT_EXIST_USER_ERROR: 20205,

    /**
     * Mapping Tables
     */

    /**
     * Configuration Classes
     */

    /**
     * Combined Objects
     */

    CREATE_ACCOUNT_ERROR: 24101,
    UPDATE_ACCOUNT_ERROR: 24102,
    RETRIEVE_ACCOUNT_ERROR: 24103,
    DELETE_ACCOUNT_ERROR: 24104,
    DO_NOT_EXIST_ACCOUNT_ERROR: 24105,

    // Generic

    /**
     * Generic Codes
     */

    INVALID_PARAMETER: 30001,
    UNAUTHORIZED_ACCESS: 30002,

    // Error codes
    UNAUTHORIZED_ERROR_CODE: 401,

    // Error names
    AUTHORIZATION_REQUIRED_ERROR_NAME: 'AuthorizationRequiredError',

    // HTTP Status Codes
    HTTP_STATUS_CODE_BAD_REQUEST: 400,
    HTTP_STATUS_CODE_UNPROCESSABLE_ENTITY: 422,
    HTTP_STATUS_CODE_NOT_FOUND: 404,
    HTTP_STATUS_CODE_CONFLICT_OF_DATA_EXISTS: 409,
    HTTP_STATUS_CODE_EXPECTATION_FAILED: 417,

    HTTP_STATUS_CODE_UNAUTHORIZED: 401,
    HTTP_STATUS_CODE_FORBIDDEN: 403,

    HTTP_STATUS_CODE_OK: 200,
    HTTP_STATUS_CODE_OK_BUT_NO_CONTENT: 204,
    HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR: 500,

    // Return codes
    RETURN_CODE_STATUS_ID_SUCCESS: 1,
    RETURN_CODE_STATUS_ID_ERROR: 2,
    RETURN_CODE_STATUS_ID_GENERIC: 3,

};