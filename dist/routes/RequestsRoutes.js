"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RequestsController_1 = __importDefault(require("../controllers/RequestsController"));
const router = express_1.default.Router();
router.route('/').post(RequestsController_1.default.getRequests).get(RequestsController_1.default.getAllRequests);
router.route('/:userId').get(RequestsController_1.default.getUserByUserId);
exports.default = router;
//# sourceMappingURL=RequestsRoutes.js.map