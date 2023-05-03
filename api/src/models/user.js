const uuid = require('uuid');
const UserSchema = require("../schemas/user");

// Get model using schema
const User = dynamoose.model("User", UserSchema);

const getUserByKey = async (userId) => {
  return User.get({ user_id: userId });
};

const createUser = async (requestBody, idTokenUser) => {
  const systemDate = new Date().getTime();
  const userId = uuid.v4();
  let nickname = idTokenUser.name;
  if (nickname && nickname.includes("@")) {
    nickname = nickname.split('@')[0];
    if (nickname.length > 24) {
      nickname = nickname.substring(0, 24);
    }
  }
  const user = await User.create({
    user_id: userId,
    wallets: [{
      wallet_address: requestBody.wallet_address,
      wallet_public_key: idTokenUser.wallets[0].public_key
    }],
    nickname: nickname,
    type_of_login: idTokenUser.type_of_login,
    is_admin: false,
    is_sent_token: false,
    user_role_ids: [],
    created_at: systemDate,
    created_by: userId,
    updated_at: systemDate,
    updated_by: userId,
    delete_flg: false
  });
  return user;
};

const updateUser = async (userId, requestBody) => {
  const systemDate = new Date().getTime();
  const user = await User.update({ user_id: userId }, {
    nickname: requestBody?.nickname,
    profile_image_url: requestBody?.profile_image_url,
    updated_at: systemDate,
    updated_by: userId,
  });
  return user;
}

const updateUserLoginState = async (userId, loginState) => {
  const systemDate = new Date().getTime();
  const user = await User.update({ user_id: userId }, {
    is_logged_in: loginState,
    updated_at: systemDate,
    updated_by: userId,
  });
  return user;
}

module.exports = {
  getUserByKey,
  createUser,
  updateUser,
  updateUserLoginState,
  User
};
