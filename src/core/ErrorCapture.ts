import {ErrorRequestHandler, Response} from 'express'

type CaptureFunction = (data: any, res: Response) => any

export const createCapture = (onData?: CaptureFunction, onError?: CaptureFunction): ErrorRequestHandler => function (errOrData, req, res, next) {
  if (!(errOrData instanceof Error)) {
    if (typeof onData === 'function') return onData(errOrData, res)
    return res.status(200).json(errOrData)
  } else {
    if (typeof onError === 'function') return onError(errOrData, res)
    return res.status(500).end(errOrData)
  }
}
