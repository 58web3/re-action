const Role = {
  Admin: 'Admin',
  Member: 'Member',
  LoginUser: 'LoginUser',
  Guest: 'Guest'
}

const Resource = {
  User: 'User',
  Token: 'Token',
  Wallet: 'Wallet',
  CSRF: 'Csrf',
};

const Action = {
  readAny: 'readAny',
  updateAny: 'updateAny',
  createAny: 'createAny',
  deleteAny: 'deleteAny',
  readOwn: 'readOwn',
  updateOwn: 'updateOwn',
  createOwn: 'createOwn',
  deleteOwn: 'deleteOwn'
}

const ActionName = {
  login: 'login'
}

module.exports = {
  Role,
  Resource,
  Action,
  ActionName,
}
