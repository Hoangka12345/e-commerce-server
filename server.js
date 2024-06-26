const app = require("./src/app");

const PORT = process.env.DEV_APP_PORT;

const server = app.listen(PORT, () => {
    console.log("server start with port ", PORT);
});

process.on("SIGINT", () => {
    server.close(() => console.log("Exist server express"));
});
