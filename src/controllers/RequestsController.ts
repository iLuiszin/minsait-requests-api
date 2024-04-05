import Requests from '../models/Requests'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from "express";
import { getToken } from '../utils/getToken';
import axios from 'axios';

export default class RequestsController {
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

  static async getRequests(req: Request, res: Response) {

    const token = await getToken()
    const response = await axios.post('https://api.sae1.pure.cloud/api/v2/analytics/users/details/query', {
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
    })

    if (!response.data) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Nenhum registro encontrado'
      })
    }

    if (response.data.error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: response.data.error
      })
    }

    for (const userDetail of response.data.userDetails) {
      try {
        const request = new Requests(userDetail)

        await request.save()
      } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: error
        })
      }
    }

    return res.status(StatusCodes.OK).json(response.data)
  }

  static async getUserByUserId(req: Request, res: Response) {

    const { userId } = req.params

    const token = await getToken()
    const response = await axios.get(`https://api.sae1.pure.cloud/api/v2/analytics/reporting/dashboards/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.data) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Nenhum registro encontrado'
      })
    }

    if (response.data.error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: response.data.error
      })
    }

    return res.status(StatusCodes.OK).json(response.data)

  }

  static async getAllRequests(req: Request, res: Response) {
    const requests = await Requests.find()

    if (!requests) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Nenhum registro encontrado'
      })
    }

    return res.status(StatusCodes.OK).json(requests)
  }

}