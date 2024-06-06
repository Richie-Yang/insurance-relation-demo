import { Context, Next } from 'koa';
import { throwError } from '../utils/responses.util';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AnyObject } from '../types';

const ERROR_STATUS = 422;

export function validateSchema(schema: ClassConstructor<AnyObject>) {
  return async function (ctx: Context, next: Next) {
    const instance = plainToClass(schema, ctx.request.body);
    const errors = await validate(instance);
    if (errors.length > 0) throwError(ctx, ERROR_STATUS, errors);
    return next();
  };
}
