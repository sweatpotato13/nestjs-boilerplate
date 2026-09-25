import { HttpStatus } from "@nestjs/common";
import { RequestHandler } from "express";

/**
 * Rejects requests whose raw query string exceeds `maxLength` characters.
 *
 * @param maxLength Maximum query string length, excluding the leading `?`
 * @returns Express middleware responding with 414 when the limit is exceeded
 */
export function queryLengthLimit(maxLength: number): RequestHandler {
    return (req, res, next) => {
        const queryIndex = req.originalUrl.indexOf("?");
        const queryLength =
            queryIndex === -1 ? 0 : req.originalUrl.length - queryIndex - 1;

        if (queryLength > maxLength) {
            res.status(HttpStatus.URI_TOO_LONG).json({
                statusCode: HttpStatus.URI_TOO_LONG,
                message: "Query too large"
            });
            return;
        }
        next();
    };
}
