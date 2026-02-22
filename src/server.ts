import app from "./app";
import { envConfig } from "./config/envConfig";
 async function runServer(){
    try {
        app.listen(envConfig.PORT, () => {
            console.log(`Server is running on port ${envConfig.PORT}`);
        })
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

runServer();