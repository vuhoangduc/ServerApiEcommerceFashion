const bcrypt = require("bcrypt");
const otpSchema = require("../models/otp.model");
var that = (module.exports = {
  validOtp: async ({
    otp, // user enter
    hashOtp,
  }) => {
    try {
      return await bcrypt.compare(otp, hashOtp);
    } catch (error) {
      console.error(error);
    }
  },
  insertOtp: async ({ otp, email }) => {
    try {
      // const salt = await bcrypt(10);
      const hastOtp = await bcrypt.hash(otp, 10);
      const Otp = await otpSchema.create({
        email,
        otp: hastOtp,
      });
      return Otp.otp;
    } catch (error) {
      console.error(error);
    }
  },
});
