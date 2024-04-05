"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Requests_1 = __importDefault(require("../models/Requests"));
const http_status_codes_1 = require("http-status-codes");
const getToken_1 = require("../utils/getToken");
const axios_1 = __importDefault(require("axios"));
class RequestsController {
    // static async register(req: Request, res: Response) {
    //   const { phoneNumber, cpf, protocol, projectId } = req.body
    //   if (!phoneNumber || !cpf || !protocol || !projectId) {
    //     return res.status(StatusCodes.BAD_REQUEST).json({
    //       message: 'Preencha todos os campos',
    //       body: req.body
    //     })
    //   }
    //   const registerExists = await Requests.findOne({ protocol: protocol })
    //   if (registerExists) {
    //     return res.status(StatusCodes.BAD_REQUEST).json({
    //       message: 'Protocolo ja registrado'
    //     })
    //   }
    //   const register = new Requests({ phoneNumber, cpf, protocol, projectId })
    //   try {
    //     await register.save()
    //     return res.status(StatusCodes.CREATED).json({
    //       message: 'Protocolo criado com sucesso'
    //     })
    //   } catch (error) {
    //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //       message: error
    //     })
    //   }
    // }
    static getRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield (0, getToken_1.getToken)();
            const response = yield axios_1.default.post('https://api.sae1.pure.cloud/api/v2/analytics/users/details/query', {
                "order": "desc",
                "orderBy": "conversationStart",
                "paging": {
                    "pageSize": 50,
                    "pageNumber": 1
                },
                "segmentFilters": [
                    {
                        "type": "or",
                        "predicates": [
                            {
                                "dimension": "direction",
                                "value": "inbound"
                            }
                        ]
                    }
                ],
                "conversationFilters": [],
                "evaluationFilters": [],
                "surveyFilters": [],
                "interval": "2023-01-01T03:00:00.000Z/2023-01-06T03:00:00.000Z"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.data) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    message: 'Nenhum registro encontrado'
                });
            }
            if (response.data.error) {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: response.data.error
                });
            }
            for (const userDetail of response.data.userDetails) {
                try {
                    const request = new Requests_1.default(userDetail);
                    yield request.save();
                }
                catch (error) {
                    console.log(error);
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: error
                    });
                }
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json(response.data);
        });
    }
    static getUserByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const token = yield (0, getToken_1.getToken)();
            const response = yield axios_1.default.get(`https://api.sae1.pure.cloud/api/v2/analytics/reporting/dashboards/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.data) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    message: 'Nenhum registro encontrado'
                });
            }
            if (response.data.error) {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: response.data.error
                });
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json(response.data);
        });
    }
    static getAllRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield Requests_1.default.find();
            if (!requests) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    message: 'Nenhum registro encontrado'
                });
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json(requests);
        });
    }
}
exports.default = RequestsController;
//# sourceMappingURL=RequestsController.js.map