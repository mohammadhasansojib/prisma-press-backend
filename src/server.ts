import app from "./app";
import dotenv from "dotenv"
import prisma from "./lib/prisma";
import config from "./config";
dotenv.config();

const port = config.port;

async function main() {
    try {
        // await prisma.$connect();
        console.log("Database connected successfully");


        app.listen(port, () => console.log(`Server running at port ${port}...`));

    } catch (error) {
        console.log("Server can't start: ", error);
        // await prisma.$disconnect();
        process.exit(1);
    }
}

main();