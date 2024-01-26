import {Controller, Get, HttpCode, HttpStatus} from '@nestjs/common';
import {ApiResponse, ApiTags} from '@nestjs/swagger';


@ApiTags('Application')
@Controller('health')
export class HealthController {
    constructor() {
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK
    })
    async login(): Promise<any> {
        return HttpStatus.OK
    }
}
