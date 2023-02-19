import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject } from '@nestjs/common';
import { CustomResponse } from 'src/domain/interfaces';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LogFormat } from 'src/domain/interfaces/log-format.interface';
import { CustomLogger } from 'src/domain/helpers';
@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    CustomLogger('HttpExceptionFilter', { exception });
    const response = host.switchToHttp().getResponse();
    const { code, detail } = exception as any;
    let message = exception['response'] && exception['response']['message'],
      status = exception['status'] ?? '400',
      type = exception['error'];
    if (!message) message = 'something went wrong';
    let customResponse: CustomResponse;
    if (process.env.NEST_ENV == 'production') {
      customResponse = {
        status,
        message,
        timestamp: new Date().toUTCString(),
      };
    } else {
      customResponse = {
        status,
        message,
        type,
        log: [{ code: code, detail, exception }],
        timestamp: new Date().toUTCString(),
      };
    }
    this.logger.error([{ code: code, message: message, detail, exception }]);

    response.status(customResponse.status).json(customResponse);
  }
}
