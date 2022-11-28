import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
    algorithm: process.env.JWT_ALGORITHM || "RS256",
    privateKey: (process.env.JWT_PRIVATE_KEY || "").replace(/\\n/gm, "\n"),
    publicKey: (process.env.JWT_PUBLIC_KEY || "").replace(/\\n/gm, "\n"),
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || ""),
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "")
}));
