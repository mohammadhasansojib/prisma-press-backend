import app from "./app";
import dotenv from "dotenv"
import prisma from "./lib/prisma";
dotenv.config();

const port = process.env.PORT || 5000;

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