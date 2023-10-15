const { findByEmail,createUser } = require('./userSchema.services')
const { BadRequestError, StatusCode } = require('../core/error.response');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const bcrypt = require('bcrypt');
const cryto = require('crypto');
const KeyTokenService = require('./keyToken.service');
class AccessService {
    static signUp = async ({ email, password, role }) => {
        console.log(email, password, role);
        const hodelEmail = await findByEmail(email)
        if (hodelEmail) throw new BadRequestError('Email đã tồn tại!', StatusCode.FORBIDDEN, 'INVALID_EMAIL')
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await createUser(email,passwordHash);
        if(newUser) return{
            message:'Đăng ký tài khoàn thành công!!!',
            status:200,
            newUser
        }
    }
    static logIn = async ({email,password}) =>{
        const hodelUser = await findByEmail(email);
        if(!hodelUser)
            throw new BadRequestError('Tài khoản chưa tồn tại!',StatusCode.FORBIDDEN,'INVALID_EMAIL');
        const match = await bcrypt.compare(password,hodelUser.password)
        if (!match)
            throw new BadRequestError('Mật khẩu chưa chính xác!',StatusCode.FORBIDDEN,'INVALID_PASSWORD');
        const publicKey = cryto.randomBytes(32).toString('hex');
        const privateKey = cryto.randomBytes(32).toString('hex');
        const tokens = await createTokenPair({userId: hodelUser._id, email,password:hodelUser.password},publicKey,privateKey);
        await KeyTokenService.createKeyToken({
            userId:hodelUser._id,
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey
        });
        return{
            message: 'Đăng nhập thành công',
            userId: hodelUser._id,
            accessToken: tokens.accessToken
        }
    }

}

module.exports = AccessService;