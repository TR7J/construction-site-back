"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMiddleware = void 0;
const AdminMiddleware = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(401).send({ message: "Invalid Admin Token" });
    }
};
exports.AdminMiddleware = AdminMiddleware;
