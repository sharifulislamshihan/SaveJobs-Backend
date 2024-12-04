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


export{
    port,
    mongodbURL,
    jwtSecret,
}