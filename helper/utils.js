// const checkRequired = async (requiredArr, bodyData) => {
//   const missing = [];
//   requiredArr.forEach((element) => {
//     const item = bodyData?.[element];
//     if (typeof item !== "boolean" && !item) {
//       missing.push(element);
//     } else if (Array.isArray(item) && item.length === 0) {
//         missing.push(element);
//     }else if(!item){
//       missing.push(item)
//     }
//   });
//   return missing;
// };


const validator = require("validator");

const checkRequired = async (requiredArr, bodyData) => {
  const missing = [];
  requiredArr.forEach((element) => {
    const item = bodyData?.[element];
    if (typeof item == "string" && item === "undefined") {
      missing.push(element);
    } else if (typeof item !== "boolean" && !item) {
      missing.push(element);
    } else if (Array.isArray(item) && item.length === 0) {
      missing.push(element);
    } else if (!element) {
      missing.push(element);
    }
  });
  return missing;
};

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};
const isValidEmail = (email) => validator.isEmail(email);

const isValidPhoneNumber = (phoneNumber) => {
  const phone = parsePhoneNumberFromString(phoneNumber);
  return phone && phone.isValid();
};

const getAllowedUpdateObject = (allowedUpdateKeys, bodyData) => {
  let newUpdateObj = {};
  for (let key in bodyData) {
    if (allowedUpdateKeys.includes(key)) {
      newUpdateObj[key] = bodyData[key];
    }
  }
  return newUpdateObj;
};

const checkMongoIdIsInvalid = (mongoIdArr, bodyData) => {
  const invalid = [];
  mongoIdArr.forEach((element) => {
    const item = bodyData?.[element];
    if (item && !item.match(/^[0-9a-fA-F]{24}$/)) {
      invalid.push(element);
    }
  });
  return invalid;
};

module.exports = {
  checkRequired,
  generateOTP,
  isValidEmail,
  isValidPhoneNumber,
  getAllowedUpdateObject,
  checkMongoIdIsInvalid,
};


