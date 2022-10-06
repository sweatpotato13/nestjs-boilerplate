// Error Codes
export enum ErrorCodes {
    /**
     * The request could not be completed because it was malformed. Cases include:
     * - a required property was missing
     *  - an invalid value was provided in request
     */
    BAD_REQUESTS = "bad_request",
    /**
     * The client could not be authenticated, because the request JWS could not be verified
     * using the DID keys of the DID provided in the iss property.
     */
    AUTHENTICATION_FAILED = "authentication_failed",
    /**
     * The request is denied because the DID in the iss field has not be granted sufficient
     * permission to perform the operation.
     */
    PERMISSIONS_REQUIRED = "permissions_required",
    /**
     * The resource requested could not be found in the hub.
     */
    NOT_FOUND = "not_found",
    /**
     * The client is being throttled, and should wait before retrying any requests.
     */
    TOO_MANY_REQUESTS = "too_many_requests",
    /**
     * An unexpected or unhandled error occurred on the hub.
     */
    SERVER_ERROR = "server_error",
    /**
     * The operation requested includes a standard hub feature that is not supported by this
     * implementation of the hub.
     */
    NOT_IMPLEMENTED = "not_implemented",
    /**
     * The hub service is temporarily not available and requests should not be retried.
     */
    SERVICE_UNAVAILBLE = "service_unavailable",
    /**
     * The hub service experienced a transient error and the request should be retried at a later time.
     */
    TEMPORARILY_UNAVAILABLE = "temporarily_unavailable",
    /**
     * This error happens on create/update commits
     */
    WRITE_ERROR = "write_error",
    /**
     * This error happens on query commits/objects
     */
    READ_ERROR = "read_error",
    /**
     * This error happens on delete commits/objects
     */
    DELETE_ERROR = "delete_error"
}
