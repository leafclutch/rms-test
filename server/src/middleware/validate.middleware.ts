import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodSchema } from 'zod'
import { AppError } from '../utils/appError.ts'

export const validate =
    (schema: ZodSchema) =>
        async (req: Request, _res: Response, next: NextFunction) => {
            try {
                const result = await schema.safeParseAsync({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                })

                if (!result.success) {
                   
                    if (!req.body || (typeof req.body === 'object' && Object.keys(req.body).length === 0)) {
                        return next(new AppError('fields are required', 400))
                    }

                    const errorMessage = result.error.issues
                        .map((err: any) => err.message)
                        .join(', ')
                    return next(new AppError(errorMessage, 400))
                }

                return next()
            } catch (error: any) {
                next(error)
            }
        }
