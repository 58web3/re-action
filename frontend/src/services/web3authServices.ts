import $WEB3AUTH from "@/constants/web3auth";
import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import RPC from "../web3RPC";

const clientId: any = process.env.VUE_APP_WEB3AUTH_CLIENT_ID;
interface IUserData {
  data: {};
  address: string;
  chainId: string;
  // balance: string;
}

class Web3AuthServiceClass {
  private static instance: Web3AuthServiceClass;
  protected rpc: RPC;
  protected provider: SafeEventEmitterProvider | any;
  public web3Auth: Web3Auth;
  public userData: IUserData;

  public static getInstance(): Web3AuthServiceClass {
    if (!Web3AuthServiceClass.instance) {
      Web3AuthServiceClass.instance = new Web3AuthServiceClass();
    }
    return Web3AuthServiceClass.instance;
  }

  constructor() {
    this.web3Auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: process.env.VUE_APP_CHAIN_ID,
        rpcTarget: process.env.VUE_APP_RPC_TARGET,
      },
      uiConfig: {
        loginMethodsOrder: ["google", "discord"],
        appLogo: process.env.VUE_APP_W3A_LOGO_DARK,
        defaultLanguage: sessionStorage.lang,
      },
      storageKey: "session",
    });
    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        clientId: clientId,
        network: process.env.VUE_APP_MODE as any,
        uxMode: "popup",
        whiteLabel: {
          defaultLanguage: sessionStorage.lang,
          name: process.env.VUE_APP_W3A_NAME,
          logoLight: process.env.VUE_APP_W3A_LOGO_LIGHT,
          logoDark: process.env.VUE_APP_W3A_LOGO_DARK,
        },
      },
      loginSettings: {
        mfaLevel: "default",
      },
    });
    openloginAdapter.setAdapterSettings({
      sessionTime: Number(process.env.VUE_APP_SESSION_TIME),
    });
    this.web3Auth.configureAdapter(openloginAdapter);

    const oneDay = 86400; // must be greater than or equal to 86400

    if ((window as any).ethereum) {
      const metamaskAdapter = new MetamaskAdapter({
        clientId,
        sessionTime: oneDay,
        web3AuthNetwork: process.env.VUE_APP_MODE as any,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: process.env.VUE_APP_CHAIN_ID,
          rpcTarget: process.env.VUE_APP_RPC_TARGET,
        },
      });

      // it will add/update  the metamask adapter in to web3auth class
      this.web3Auth.configureAdapter(metamaskAdapter);
    }

    this.provider = null as unknown as typeof this.provider | any;
    this.userData = null as unknown as typeof this.userData;
    this.rpc = null as unknown as typeof this.rpc;
    this.init((data) => {
      console.log(data);
    });
  }

  async init(callback: (arg0: {}) => void) {
    try {
      await this.web3Auth.initModal({
        modalConfig: {
          [WALLET_ADAPTERS.METAMASK]: {
            showOnDesktop: true,
            showOnModal: true,
            showOnMobile: true,
            label: "Metamask",
          },
          [WALLET_ADAPTERS.TORUS_EVM]: {
            showOnDesktop: true,
            showOnModal: false,
            showOnMobile: false,
            label: "Torus",
          },
        },
      });
      if (this.web3Auth.provider) {
        this.provider = this.web3Auth.provider;
      }
    } catch (error) {
      console.error(error);
      callback({
        status: $WEB3AUTH.STATUS.INIT.FAILED,
      });
    } finally {
      callback({
        status: $WEB3AUTH.STATUS.INIT.SUCCESS,
      });
    }
  }

  private resetUserInfo() {
    console.log("web3authService: resetting user info");
    this.userData = {
      data: null as unknown as Partial<{}>,
      address: null as unknown as string,
      chainId: null as unknown as string,
      // balance: null as unknown as string,
    };
    sessionStorage.removeItem("token");
  }

  async login(callback: (arg0: {}) => void) {
    if (!this.web3Auth) {
      console.error("web3auth not initialized yet");
      return;
    }
    try {
      this.provider = await this.web3Auth.connect();
      this.rpc = new RPC(this.provider);
      await this.getUserInfo((status: any) => {
        if (status?.status === $WEB3AUTH.STATUS.GET_INFO.SUCCESS) {
          callback({
            status: $WEB3AUTH.STATUS.LOGIN.SUCCESS,
          });
        } else if (status?.status === $WEB3AUTH.STATUS.GET_INFO.FAILED) {
          callback({
            status: $WEB3AUTH.STATUS.LOGIN.FAILED,
          });
        } else {
          callback({
            status: $WEB3AUTH.STATUS.LOGIN.FAILED,
          });
        }
      });
    } catch (e) {
      callback({
        status: $WEB3AUTH.STATUS.LOGIN.FAILED,
      });
      return;
    }
  }

  async logout() {
    if (!this.web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    } else {
      console.log("web3auth is ok, logging out");
    }
    this.web3Auth
      .logout()
      .then(() => {
        this.resetUserInfo();
      })
      .catch((e) => {
        this.resetUserInfo();
        console.error("failed to logout");
      });
  }

  async isNotLoggedIn(userData: any) {
    try {
      const authUser = await this.web3Auth.authenticateUser();
      return authUser == null ? true : false;
    } catch (e) {
      return true;
    }
  }

  async getUserInfo(callback: (arg0: {}) => void) {
    let userData = null as any;
    try {
      userData = await this.web3Auth?.getUserInfo();
      const address = await this.rpc?.getAccounts();
      const chainId = await this.rpc?.getChainId();
      // const balance = await this.rpc.getBalance();
      this.userData = {
        data: userData,
        address,
        chainId,
        // balance,
      };
      callback({
        status: $WEB3AUTH.STATUS.GET_INFO.SUCCESS,
      });
    } catch (e) {
      console.error("getUserInfo error:", e);
      callback({
        status: $WEB3AUTH.STATUS.GET_INFO.FAILED,
      });
    }
  }
}

export default Web3AuthServiceClass.getInstance();
