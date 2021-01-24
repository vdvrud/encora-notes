import { compare, genSalt, hash } from "bcryptjs";

const createPassword = async (password) => {
  try {
    const salt = await genSalt(10);
    const hashed = await hash(password, salt);
    return {
      payload: hashed,
      success: true,
    };
  } catch (error) {
    return {
      payload: error,
      success: false,
    };
  }
};

const matchpassword = async (password, user_password) => {
  const match = await compare(password, user_password);
  return match;
};

export { createPassword, matchpassword };
