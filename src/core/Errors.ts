class Exception extends Error {
  httpCode: number
  code?: string
  detail?: string
  help?: string
  constructor(message: string, code?: string, detail?: string, help?: string) {
    super(message)
    this.name = this.constructor.name
    this.httpCode = 500
    this.code = code
    this.detail = detail
    this.help = help
    Error.captureStackTrace(this, this.constructor)
  }

  toObject () {
    const error: any = { message: this.message }
    if (this.detail) error.detail = this.detail
    if (this.help) error.help = this.help
    if (this.code) error.code = this.code

    if (process.env.NODE_ENV !== 'production') {
      error.track = this.stack
    }

    return { error }
  }
}

export class BadRequestException extends Exception {
  httpCode = 400
}

export class UnauthorizedException extends Exception {
  httpCode = 401
}

export class ForbiddenException extends Exception {
  httpCode = 403
}

export class NotValidException extends Exception {
  httpCode = 412
}

export class InternalException extends Exception {
  httpCode = 500
}
