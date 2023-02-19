import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { CustomLogger } from 'src/domain/helpers';
import { CustomResponse } from 'src/domain/interfaces';
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    CustomLogger('AllExceptionFilter');
    const response = host.switchToHttp().getResponse();
    const message = exception.massage,
      status = 500,
      type = 'Internal Server Error';
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
        log: { exception },
        timestamp: new Date().toUTCString(),
      };
    }

    response.status(customResponse.status).json(customResponse);
  }
}
