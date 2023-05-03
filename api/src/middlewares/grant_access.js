const UserWalletModel = require("../models/user_wallet");
const UserModel = require("../models/user");
const AccessControl = require('accesscontrol');
const { Role, Resource } = require("../util/constant");
const NodeCache = require( "node-cache" );
// cache time: 1hour
const cache = new NodeCache( { stdTTL: 3600 } );
const ADMIN_ROLE_ID = "99999";

const grantsObject = {
  [Role.Admin]: {
    [Resource.User]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    [Resource.Token]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    [Resource.Wallet]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    [Resource.CSRF]: {
      'read:any': ['*'],
    }
  },
  [Role.Member]: {
    [Resource.User]: {
      'create:own': ['*'],
      'read:any': ['*'],
      'update:own': ['*'],
      'delete:own': ['*']
    },
    [Resource.Token]: {
      'create:any': ['*'],
      'read:any': ['*'],
    },
    [Resource.Wallet]: {
      'read:any': ['*'],
    },
    [Resource.CSRF]: {
      'read:any': ['*'],
    }
  },
  [Role.LoginUser]: {
    [Resource.User]: {
      'create:own': ['*']
    },
    [Resource.Token]: {
      'create:any': ['*'],
      'read:any': ['*'],
    },
    [Resource.Wallet]: {
      'read:any': ['*'],
    },
    [Resource.CSRF]: {
      'read:any': ['*'],
    }
  },
  [Role.Guest]: {
  }
};
const ac = new AccessControl(grantsObject);

const isAdmin = async (req) => {
  let isAdmin = false;

  const userWallet = await getUserWalletByPublicKey(req.user.wallets[0].public_key);
  if (!userWallet) return false;
  const user = await UserModel.getUserByKey(userWallet.user_id);

  if (user && user.user_role_ids && ADMIN_ROLE_ID &&
    user.user_role_ids.includes(ADMIN_ROLE_ID)) {
    isAdmin = true;
  }

  return isAdmin;
};

const isMember = async (req) => {
  let isMember = false;

  const userWallet = await getUserWalletByPublicKey(req.user.wallets[0].public_key);
  if (!userWallet) return false;

  return isMember;
};

const isLoginUser = async (req) => {
  // If have token
  let isLoginUser = req.user.wallets ? true : false;
  return isLoginUser;
}


const getUserWalletByPublicKey = async (publicKey) => {
  const key = "userWallet" + publicKey;
  if (cache.has(key)) {
    return cache.get(key);
  } else {
    const userWallet = await UserWalletModel.getUserWalletByPublicKey(publicKey);
    if (userWallet && userWallet.wallet_address) {
      cache.set(key, userWallet);
    }
    return userWallet;
  }
}

module.exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      req.user.role = 'Guest';

      if (await isAdmin(req)) {
        req.user.role = 'Admin';
      } else if (await isMember(req)) {
        req.user.role = 'Member'
      } else if (await isLoginUser(req)) {
        req.user.role = 'LoginUser'
      }
      const permission = ac.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(403).json({
          message: "Forbidden"
        });
      }
      next();
    } catch (error) {
      logger.error(error);
      next(error)
    }
  }
}


