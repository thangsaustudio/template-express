import {NextFunction, Request, Response} from "express";
import FastestValidator from 'fastest-validator'
import {BadRequestException} from "./Errors";
import glob from 'glob'
import path from 'path'

interface Context<T extends any> {
  params: T
  req: Request
  res: Response
}
type ControllerOptions = {
  validateSchema?: GeneralObject,
  swaggerSchema?: GeneralObject
}
type ControllerHandler<T> = (params: Context<T>) => any
type GeneralObject = { [key: string]: any }

export const createController = <T>(handler: ControllerHandler<T>, options?: ControllerOptions) => async (req: Request, res: Response, next: NextFunction) => {
  const params = { ...req.query, ...req.params, ...req.body }
  if (options && options.validateSchema) {
    const v = new FastestValidator()
    const checker = v.compile(options.validateSchema)
    const result = checker(params)
    if (result !== true) {
      return next(new BadRequestException('Input params is invalid.'))
    }
  }
  try {
    const context = {
      params,
      req,
      res
    }
    const data = await handler(context)
    if (data) return next(data)
  } catch (e) {
    return next(e)
  }
}

export const Controllers: any = {}
export const load = (action: string) => {
  return Controllers[action]
}
export const autoload = () => {
  const controllerDir = path.join(__dirname, '..', 'controllers')
  const files = glob.sync('*', { cwd: controllerDir })
  for (const file of files) {
    const controllerPath = path.join(controllerDir, file)
    const data = require(controllerPath)
    const { actions, name } = data.default
    if (actions) {
      Object.entries(actions).forEach(entry => {
        const [key, func] = entry as [string, any]
        const actionName = `${name}.${key}`
        Controllers[actionName] = createController(func)
      })
    }
  }
}
