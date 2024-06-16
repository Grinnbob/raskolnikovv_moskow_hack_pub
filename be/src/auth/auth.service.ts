import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { CreateUserDto } from "src/users/dto/create-user.dto"
import { UsersService } from "src/users/users.service"
import * as bcrypt from "bcryptjs"
import * as nodemailer from "nodemailer"
import {
    MASKED_PASSWORD,
    MASKED_VERIFICATION_CODE,
    User,
} from "src/users/users.model"
import {
    htmlBlankWithEmailPasswordRecover,
    htmlBlankWithEmailValidationCode,
} from "src/utils/utils"
import { PinoLoggerService } from "src/logger/logger.service"

@Injectable()
export class AuthService {
    private NODE_MAILER_CONFIG: object

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly logger: PinoLoggerService
    ) {
        this.NODE_MAILER_CONFIG = {
            auth: {
                user: process.env.EMAIL_FOR_USERS,
                pass: process.env.EMAIL_PASSWORD,
            },
        }
        this.logger.setContext(AuthService.name)
    }

    public async login(
        userDto: CreateUserDto
    ): Promise<{ token: string; user: User }> {
        const user = await this.validateUser(userDto)
        return { ...this.generateToken(user), user }
    }

    public async signup(
        userDto: CreateUserDto
    ): Promise<{ token: string; user: User }> {
        let user = await this.userService.getByEmailAndRoleWithPassword(
            userDto.email,
            userDto.role
        )
        if (user) {
            throw new UnauthorizedException({
                message: `User with email ${userDto.email} and role ${userDto.role} already exists.`,
            })
        }

        try {
            const hashPassword = await bcrypt.hash(userDto.password, 5)
            user = await this.userService.create({
                ...userDto,
                password: hashPassword,
            })

            const role = user.role
            const emailValidationCode = await this.sendEmailValidationCode(
                user.password
            )
            if (emailValidationCode) {
                user = await this.userService.updateEmailValidationInfo(
                    user.id,
                    true,
                    emailValidationCode
                )

                user.emailValidationCode = MASKED_VERIFICATION_CODE
                user.password = MASKED_PASSWORD
            }

            user.role = role
            return { ...this.generateToken(user), user }
        } catch (e) {
            throw new HttpException(
                `Can't signup user: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    public async updatePassword(
        userId: number,
        oldPassword: string,
        newPassword: string
    ): Promise<User> {
        const user = await this.userService.getById(userId)
        if (!user)
            throw new HttpException(
                `User not found!`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )

        const passwordEquals = await bcrypt.compare(user.password, oldPassword)

        if (!passwordEquals)
            throw new UnauthorizedException({ message: "Wrong password" })

        const hashPassword = await bcrypt.hash(newPassword, 5)
        return this.userService.updatePassword(userId, hashPassword)
    }

    public async updateEmail(
        userId: number,
        email: string,
        password: string
    ): Promise<User> {
        let user = await this.userService.getById(userId)
        if (!user)
            throw new HttpException(
                `User not found!`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )

        const passwordEquals = await bcrypt.compare(password, user.password)

        if (!passwordEquals)
            throw new UnauthorizedException({ message: "Wrong password" })

        const users = await this.userService.getAllByEmail(email)
        if (users.length)
            throw new HttpException(
                `User with email ${email} already exists!`,
                HttpStatus.BAD_REQUEST
            )

        const role = user.role
        user = await this.userService.updateEmail(userId, "email")

        const emailValidationCode = await this.sendEmailValidationCode(
            user.email
        )
        if (emailValidationCode) {
            user = await this.userService.updateEmailValidationInfo(
                user.id,
                false,
                emailValidationCode
            )

            user.emailValidationCode = MASKED_VERIFICATION_CODE
            user.password = MASKED_PASSWORD
            user.role = role
            return user
        }
    }

    public async recoverPasswordByEmail(
        email: string,
        role?: string
    ): Promise<boolean> {
        const user = await this.userService.getByEmailAndRoleWithPassword(
            email,
            role
        )
        if (!user)
            throw new UnauthorizedException({
                message: `User with email ${email} and role ${role} did't found`,
            })

        const password = this.generatePassword()
        const hashPassword = await bcrypt.hash(password, 5)
        await this.userService.updatePassword(user.id, hashPassword)
        await this.sendEmailPasswordRecover(email, password)
        return true
    }

    public async sendEmailValidationCodeForUser(id: number): Promise<boolean> {
        const user = await this.userService.getById(id)
        if (!user)
            throw new HttpException(
                `User not found!`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        if (!user.email)
            throw new HttpException(
                `User email is empty!`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        const emailValidationCode = await this.sendEmailValidationCode(
            user.email
        )
        if (emailValidationCode) {
            await this.userService.updateEmailValidationInfo(
                user.id,
                false,
                emailValidationCode
            )
        }
        return !!emailValidationCode
    }

    private async sendEmailValidationCode(email?: string): Promise<string> {
        try {
            const transporter = await nodemailer.createTransport(
                this.NODE_MAILER_CONFIG
            )

            const validationCode =
                `${Math.floor(Math.random() * 10)}` +
                `${Math.floor(Math.random() * 10)}` +
                `${Math.floor(Math.random() * 10)}` +
                `${Math.floor(Math.random() * 10)}`

            await transporter.sendMail({
                from: process.env.EMAIL_FOR_USERS,
                to: email,
                subject: "Подтвердите свою почту на raskolnikovv",
                html: htmlBlankWithEmailValidationCode(validationCode),
            })

            return validationCode
        } catch (e) {
            this.logger.error(
                `Can't send email to ${email} with verification code: ${e}`
            )
            throw new HttpException(
                `Can't send email to ${email} with verification code: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    private async sendEmailPasswordRecover(
        email: string,
        password: string
    ): Promise<boolean> {
        try {
            const transporter = await nodemailer.createTransport(
                this.NODE_MAILER_CONFIG
            )

            await transporter.sendMail({
                from: process.env.EMAIL_FOR_USERS,
                to: email,
                subject: "Восстановление пароля в raskolnikovv",
                html: htmlBlankWithEmailPasswordRecover(password),
            })

            return true
        } catch (e) {
            this.logger.error(
                `Can't send email to ${email} with recover password: ${e}`
            )
            return false
        }
    }

    private generateToken(user: User) {
        const payload = {
            email: user.email,
            id: user.id,
            role: user.role.value,
            financeAccountId: user.financeAccountId,
            isBanned: user.isBanned,
        }
        return {
            token: this.jwtService.sign(payload, { expiresIn: "1d" }),
        }
    }

    private async validateUser(userDto: CreateUserDto): Promise<User> {
        const user = await this.userService.getByEmailAndRoleWithPassword(
            userDto.email,
            userDto.role
        )

        if (!user)
            throw new UnauthorizedException({
                message: `User with email ${userDto.email} and role ${userDto.role} did't found`,
            })

        const passwordEquals = await bcrypt.compare(
            userDto.password,
            user.password
        )

        if (!passwordEquals)
            throw new UnauthorizedException({ message: "Wrong password" })

        user.password = MASKED_PASSWORD
        user.emailValidationCode = user.emailValidationCode
            ? MASKED_VERIFICATION_CODE
            : null
        return user
    }
}
