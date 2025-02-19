import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: string | undefined;
    mongodbURL: string;
    jwtSecret: string | undefined;
}

const port: string | undefined = process.env.PORT;
const mongodbURL: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsbi62n.mongodb.net/savejobs`;

const jwtSecret: string | undefined = process.env.JWT_SECRET_KEY;
const refreshSecret: string | undefined = process.env.REFRESH_TOKEN_KEY;

const smtpHost: string | undefined = process.env.SMTP_HOST;
const smtpPort: string | undefined = process.env.SMTP_PORT;

const geminiApi: string | undefined = process.env.GEMINI_API

const betterAuth: string | undefined = process.env.BETTER_AUTH_SECRET



export{
    port,
    mongodbURL,
    jwtSecret,
    smtpHost,
    smtpPort,
    refreshSecret,
    geminiApi,
    betterAuth,
}