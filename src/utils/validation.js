const validator = require("validator");
const validatorFunction = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    if (!firstName || !lastName) {
      throw new Error("First name and last name are required");
    }
    const validateEmailId = validator.isEmail(emailId);
    if (!validateEmailId) {
      throw new Error("Please enter a valid email address");
    }
    const validatePassword = validator.isStrongPassword(password);
    if (!validatePassword) {
      throw new Error(
        "Password must be at least 8 characters long, contain a number, a lowercase letter, an uppercase letter, and a special character"
      );
    }
  } catch (error) {
    return error.message;
  }
};

const validateEdit = (req) => {
  try {
    const user = req.body;
    const validateItem = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "profilePic",
      "skills",
    ];
    const isValid = Object.keys(user).every((key) =>
      validateItem.includes(key)
    );
    if (!isValid) {
      throw new Error("Invalid user data");
    }
    return isValid;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
};

module.exports = { validatorFunction, validateEdit };
