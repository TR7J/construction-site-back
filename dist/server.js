"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const supervisorRoutes_1 = __importDefault(require("./routes/supervisorRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
// fetching env variables
dotenv_1.default.config();
// initialise our app
const app = (0, express_1.default)();
// connecting to mongodb
mongoose_1.default
    .connect(process.env.DATABASE_URI)
    .then(() => {
    console.log("Connected to database.");
})
    .catch(() => {
    console.log("Error while connecting to database.");
});
// cors middleware
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:3000",
    // "https://construction-site-frontend.onrender.com"
}));
// middleware for parsing json data
app.use(express_1.default.json());
// middleware for our routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/supervisor", supervisorRoutes_1.default);
app.use("/api/projects", projectRoutes_1.default);
// listening ...
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});
