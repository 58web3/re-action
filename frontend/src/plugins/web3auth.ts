const Web3AuthInstance = {
  install(app: any) {
    if (!app.config.globalProperties.$w3a) {
      const w3a = require("@/services/web3authServices").default;
      app.config.globalProperties.$w3a = w3a;
    }
  },
};

export default Web3AuthInstance;
