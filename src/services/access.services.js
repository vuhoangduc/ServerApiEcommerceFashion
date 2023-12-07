const { findByEmail, createUser } = require('./userSchema.services')
const { BadRequestError, StatusCode } = require('../core/error.response');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const bcrypt = require('bcrypt');
const cryto = require('crypto');
const OtpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const KeyTokenService = require('./keyToken.service');
const keytokenModel = require('../models/keytoken.model');
const { insertOtp, validOtp } = require('../services/otp.services');
const otpModel = require('../models/otp.model');
class AccessService {
    static verifyOtp = async ({
        email,
        otp,
        password,
        role
    }) => {
            const otpHolder = await otpModel.find({
                email,
            })
            if (!otpHolder.length){
                throw new BadRequestError('Đã hệt hạn mã OTP!', StatusCode.FORBIDDEN, 'INVALID_EMAIL');
            }
            // get last otp
            const lastOtp = otpHolder[otpHolder.length - 1];
            const isValid = await validOtp({
                otp,
                hashOtp: lastOtp.otp
            })
            if (!isValid) {
                throw new BadRequestError('OTP ko chính xác!', StatusCode.FORBIDDEN, 'INVALID_EMAIL');
            }
            if (isValid && email === lastOtp.email) {
                const passwordHash = await bcrypt.hash(password, 10);
                const newUser = await createUser(email, passwordHash, role);
                if (newUser) return {
                    message: 'Đăng ký tài khoàn thành công!!!',
                    status: 200,
                    newUser
                }
            }
    }
    static signUp = async ({ email, password, role }) => {
        console.log(email, password, role);
        const hodelEmail = await findByEmail(email)
        if (hodelEmail) throw new BadRequestError('Email đã tồn tại!', StatusCode.FORBIDDEN, 'INVALID_EMAIL')
        // const num = Math.floor(Math.random()*(999999 - 100000)+100000);
        // const otp = num.toString();
        // return{
        //     code:200,
        //     element:otp
        // }
        const OTP = OtpGenerator.generate(6,
            {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            })
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ttgvhd@gmail.com', // Điền email của bạn
                pass: 'wuye xlrm lxlp edyd' // Điền mật khẩu email của bạn hoặc sử dụng ứng dụng mật khẩu
            }
        });
        const otp = await insertOtp({
            email,
            otp: OTP});

        const mailOptions = {
            from: 'ttgvhd@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${OTP} sau 60 giây sẽ hết hạn`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        // send otp email
        return {
            code: 200,
        }

    }
    static logIn = async ({ email, password, role }) => {
        const hodelUser = await findByEmail(email);
        console.log(hodelUser);
        if (!hodelUser)
            throw new BadRequestError('Tài khoản chưa tồn tại!', StatusCode.FORBIDDEN, 'INVALID_EMAIL');
        if (hodelUser.disable == true) {
            throw new BadRequestError('Tài khoản của bạn đã bị block hãy liên hệ đến admin để bt thêm chi tiết', StatusCode.FORBIDDEN, 'INVALID_EMAIL');
        }
        if (hodelUser.role != role) {
            throw new BadRequestError('Tài khoản của bạn ko có quyền đăng nhập, hãy tạo tài khoản mới', StatusCode.FORBIDDEN, 'INVALID_EMAIL');
        }
        const match = await bcrypt.compare(password, hodelUser.password)
        if (!match)
            throw new BadRequestError('Mật khẩu chưa chính xác!', StatusCode.FORBIDDEN, 'INVALID_PASSWORD');
        const publicKey = cryto.randomBytes(32).toString('hex');
        const privateKey = cryto.randomBytes(32).toString('hex');
        const tokens = await createTokenPair({ userId: hodelUser._id, email, password: hodelUser.password }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            userId: hodelUser._id,
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey
        });
        return {
            message: 'Đăng nhập thành công',
            userId: hodelUser._id,
            accessToken: tokens.accessToken
        }
    }


    static signOut = async ({ userId }) => {
        const res = await keytokenModel.findOneAndDelete({ user: userId });
        if (!res) {
            return { message: 'Đăng xuất thất bại' }
        }
        return { message: 'Đăng xuất thành công' };
    }

}

module.exports = AccessService;