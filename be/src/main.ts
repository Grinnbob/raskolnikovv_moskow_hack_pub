import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import { JwtAuthGuard } from "./auth/jwt-auth.guard"
import { ValidationPipe } from "./pipes/validation.pipe"
import helmet from "helmet"
import { v4 as uuidv4 } from "uuid"
import { PinoLoggerService } from "./logger/logger.service"
import { AsyncLocalStorage } from "async_hooks"

async function start() {
    const PORT = process.env.PORT
    const app = await NestFactory.create(AppModule, { bufferLogs: true })

    const config = new DocumentBuilder()
        .setTitle("raskolnikovv")
        .setDescription("REST API Docs")
        .setVersion("1.0.0")
        .addTag("Mr. Green")
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("/api/docs", app, document)

    app.useGlobalGuards(new JwtAuthGuard())

    app.useGlobalPipes(new ValidationPipe())
    app.enableCors()
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" },
        })
    )

    app.useLogger(app.get(PinoLoggerService))

    app.use((req, res, next) => {
        const asyncStorage = app.get(AsyncLocalStorage)
        const traceId = req.headers["x-request-id"] || req.id || uuidv4()
        const store = new Map().set("traceId", traceId)
        asyncStorage.run(store, () => next())
    })

    app.setGlobalPrefix("api")
    await app.listen(PORT, () => console.log(`Server started on ${PORT} ...`))
}

start()
