import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import * as helmet from 'helmet';
import {AppLogger} from './logger/logger';
import * as cors from 'cors';
import {json} from "express";

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule,
        {
            logger: console,
            cors: false,
        });
    app.useGlobalPipes(new ValidationPipe({
        // Show error messages
        disableErrorMessages: false,
        // If user-service-provider-controller-dtos send extra data from the dto the data will be stripped
        whitelist: true,
        // To enable auto-transformation, set transform to true
        transform: true,
    }));
    app.use(json({limit: '1mb'}));

    // todo add here a white list of sites which can send a request to the server
    // app.enableCors({credentials: true, origin: ["http://localhost:3020", "http://localhost:3001"]});

    // app.setGlobalPrefix('api');

    const options = new DocumentBuilder()
        .setTitle('Have A Nice Day Service')
        .setDescription('Have A Nice Day')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/swagger', app, document);
    app.use(cors());
    app.use(helmet());
    // Allow this method on inside routes
    // app.use(csurf());
    app.useLogger(new AppLogger());
    await app.listen(process.env.PORT);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
