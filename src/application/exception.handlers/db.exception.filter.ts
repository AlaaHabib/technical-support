import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { CustomResponse } from 'src/domain/interfaces';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CustomException } from 'src/domain/exceptions/custom.exception';
import { CustomLogger } from 'src/domain/helpers';

@Catch(TypeORMError, QueryFailedError, EntityNotFoundError, CustomException)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
  catch(exception: TypeORMError | QueryFailedError | EntityNotFoundError, host: ArgumentsHost) {
    CustomLogger('TypeOrmExceptionFilter', { exception });
    const response = host.switchToHttp().getResponse();
    const { status, friendlyMsg, error, typeError } = exception as any;

    // set response with friendly message, status and type
    let message = friendlyMsg ?? 'something went wrong';
    let type = typeError ?? 'Bad Request';

    let customResponse: CustomResponse;
    if (process.env.NEST_ENV == 'production') {
      customResponse = {
        status: status ?? 400,
        message,
        timestamp: new Date().toUTCString(),
      };
    } else {
      customResponse = {
        status: status ?? 400,
        message,
        type,
        log: [{ status: status ?? 400, message, type, error }],
        timestamp: new Date().toUTCString(),
      };
    }

    this.logger.error([{ status: status ?? 400, message, type, error }]);
    response.status(customResponse.status).json(customResponse);
  }
}
