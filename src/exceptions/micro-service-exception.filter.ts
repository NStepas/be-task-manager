import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import {MicroServiceError} from './micro-service-error/micro-service-error';
import {MicroServiceErrorResponseInterface} from './interfaces/micro-service-error-response.interface';
import {HttpArgumentsHost} from '@nestjs/common/interfaces';
import {MicroServiceExceptionUtil} from './utils/micero-service-exception.util';
import {ILogger} from '../logger/models/app-logger';

@Catch(Error)
export class MicroServiceExceptionFilter implements ExceptionFilter {

    private readonly TAG: string = `${this.constructor.name}`;

    constructor(private readonly appLogger: ILogger) {
    }

    catch(exception: any | {}, host: ArgumentsHost) {

        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response = ctx.getResponse();

        let microServiceErrorResponse: MicroServiceErrorResponseInterface;

        if (exception instanceof MicroServiceError) {
            microServiceErrorResponse = MicroServiceExceptionUtil.buildMicroServiceErrorResponse(exception);
        } else if (exception.status === 401) {
            microServiceErrorResponse = MicroServiceExceptionUtil.buildMicroServiceUnauthorizedErrorResponse();
        } else if (exception.status === 404) {
            microServiceErrorResponse = MicroServiceExceptionUtil.buildNotFoundErrorResponse();
        } else if (exception.status === 400) {
            microServiceErrorResponse = MicroServiceExceptionUtil.buildBadRequestErrorResponse(exception.response.message);
        } else if (exception.status === 413) {
            microServiceErrorResponse = MicroServiceExceptionUtil.buildRequestTooLargeResponse();
        } else {
            microServiceErrorResponse = MicroServiceExceptionUtil.buildUnknownErrorResponse();
        }

        this.appLogger.error(exception.stack, this.TAG);
        this.appLogger.error(exception.response, this.TAG);

        const status: number = microServiceErrorResponse.statusCode ? microServiceErrorResponse.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
        response
            .status(status)
            .json({error: microServiceErrorResponse});
    }

}
