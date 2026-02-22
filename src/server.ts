import app from "./app";
 async function runServer(){
    try {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

runServer();