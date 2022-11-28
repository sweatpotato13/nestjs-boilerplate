import { registerAs } from "@nestjs/config";

export default registerAs("google", () => ({
    clientId: process.env.OAUTH_GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET || "",
    redirect: process.env.OAUTH_GOOGLE_REDIRECT || ""
}));
