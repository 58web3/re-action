<template>
  <div class="auth-container">
    <span class="main-title">{{ $t("signup") }}</span>

    <div class="self-card">
      <span class="card-title underline">{{ $t("signup") }}</span>
      <v-button @click="handleLogin" :text="$t('signin')" />
      <span class="switch-alert">{{ $t("switch_network") }}</span>
      <span class="link">
        <a href="https://revisionartproject.com/articles/642f9b8fd511e51b13679591" target="_blank">{{
        $t("faq_connect_astar")
      }}</a>
      </span>
    </div>
  </div>
  <OverlaySpinner :message="text" v-show="showSpinner"></OverlaySpinner>
</template>

<script lang="ts">
import VButton from "@/components/Button.vue";
import { defineComponent } from "vue";
import { mapMutations, mapState } from "vuex";
import { getPublicCompressed } from "@toruslabs/eccrypto";
import $WEB3AUTH from "@/constants/web3auth";
import jwt_decode from "jwt-decode";
import OverlaySpinner from "@/views/OverlaySpinner.vue";
import axiosService from "@/services/axiosServices";
import { API_ENDPOINT } from "@/constants/api";

export default defineComponent({
  name: "SignUpView",
  data() {
    return {
      user_id: null as unknown as string,
      showSpinner: false,
      text: this.$t("loading"),
      isCalled: false,
    };
  },
  components: {
    VButton,
    OverlaySpinner,
  },
  computed: {
    ...mapState("user", {
      userData: "data",
    }),
    ...mapState("lang", {
      lang: "lang",
    }),
  },
  mounted() {
    document.body.className = "sign-in";
    if(navigator.userAgent.toLowerCase().includes("metamask")) {
      document.body.classList.add("metamask-login");
    }
    this.logout();
  },
  unmounted() {
    document.body.className = "";
  },
  methods: {
    ...mapMutations({
      setUserData: "user/SET_USER_DATA",
    }),
    ...mapMutations({
      setUserId: "user/SET_USER_ID",
    }),
    async handelUnexpectedError() {
      const _this = this;
      this.showSpinner = false;
      await (this as any)
        .$swal({
          title: (this as any).$t("sorry_something_went_wrong"),
          text: (this as any).$t("please_try_again"),
          position: "center",
          icon: "error",
          timer: 2500,
        })
        .then(async () => {
          await _this.logout();
        });
    },
    async nftReceive() {
      if (!this.isCalled) {
        this.isCalled = true;
        this.showSpinner = true;
        if (!(this as any).$w3a?.userData?.address) {
          this.handelUnexpectedError();
          return;
        }

        await axiosService
          .get(
            `${API_ENDPOINT}/v1/wallet/${
              (this as any).$w3a.userData.address
            }/user_id`,
            {}
          )
          .then(async (res: any) => {
            if (!res.data.user_id) {
              /** No User ID, CREATE USER */
              const _this = this;
              let verificationCode =
                (this as any).$w3a.userData.data.verification_code ||
                sessionStorage.getItem("verification_code");
              if (!verificationCode) {
                (this as any).$swal({
                  title: (this as any).$t("error_not_verified_code"),
                  text: (this as any).$t("error_not_verified_code_description"),
                  position: "center",
                  icon: "error",
                  timer: 2500,
                });
                _this.$router.push({ name: "code-verification" });
                return;
              }
              await axiosService
                .post(`${API_ENDPOINT}/v1/user`, {
                  wallet_address: (this as any).$w3a.userData.address,
                  verification_code: verificationCode,
                })
                .then(async (res: any) => {
                  if (res.status === 201) {
                    this.user_id = res.data.id_info.value;
                    this.setUserId({ user_id: this.user_id });
                    await axiosService
                      .post(`${API_ENDPOINT}/v1/login`, {})
                      .then(() => {
                        this.showSpinner = false;
                        (this as any).$router.push("/mypage");
                      })
                      .catch((e: any) => {
                        sessionStorage.token = null;
                        if (e.response.status === 400) {
                          (this as any).$swal({
                            title: (this as any).$t("error_not_verified_code"),
                            text: (this as any).$t(
                              "error_not_verified_code_description"
                            ),
                            position: "center",
                            icon: "error",
                            timer: 2500,
                          });
                        } else {
                          this.handelUnexpectedError();
                        }
                      });
                    this.showSpinner = false;
                  } else {
                    this.handelUnexpectedError();
                  }
                })
                .catch(async (e: any) => {
                  this.showSpinner = false;
                  console.error("Failed to create a user", e);
                  sessionStorage.token = null;
                  if (e.response.status === 400) {
                    await (this as any).$swal({
                      title: (this as any).$t("already_used_title"),
                      text: (this as any).$t("already_used_body"),
                      position: "center",
                      icon: "error",
                      timer: 2500,
                    });
                    await _this.logout();
                    sessionStorage.removeItem("verification_code");
                  } else if (e.response.status === 403) {
                    (this as any)
                      .$swal({
                        title: (this as any).$t("error_not_verified_code"),
                        text: (this as any).$t(
                          "error_not_verified_code_description"
                        ),
                        position: "center",
                        icon: "error",
                        timer: 2500,
                      })
                      .then(async function (result: any) {
                        try {
                          await _this.logout();
                        } catch (e) {
                          console.error("logout fail", e);
                        } finally {
                          sessionStorage.removeItem("token");
                          _this.$router.push({ name: "code-verification" });
                        }
                      });
                  } else if (e.response.status === 404) {
                    await (this as any).$swal({
                      title: (this as any).$t(
                        "error_verification_code_not_found"
                      ),
                      text: (this as any).$t("start_from"),
                      position: "center",
                      icon: "error",
                      timer: 2500,
                    });
                    await this.$router.push({ name: "code-verification" });
                  } else if (e.response.status === 409) {
                    await (this as any).$swal({
                      title: (this as any).$t("different_account"),
                      text: (this as any).$t("different_account_description"),
                      position: "center",
                      icon: "error",
                      timer: 2500,
                    });
                  } else {
                    sessionStorage.token = null;
                    this.handelUnexpectedError();
                  }
                });
            } else {
              /** User exists, logging in */
              this.user_id = res.data.user_id;
              this.setUserId({ user_id: this.user_id });
              await axiosService
                .post(`${API_ENDPOINT}/v1/login`, {})
                .then(() => {
                  this.showSpinner = false;
                  (this as any).$router.push("/mypage");
                })
                .catch((e) => {
                  sessionStorage.token = null;
                  this.handelUnexpectedError();
                });
            }
          })
          .catch(async (e: any) => {
            this.handelUnexpectedError();
          });
      }
    },
    async logout() {
      await (this as any).$w3a.logout();
      this.showSpinner = false;
      sessionStorage.token = "";
    },
    async handleLogin() {
      try {
        await (this as any).$w3a.web3Auth.walletAdapters.metamask.disconnect();
      } catch (e) {
        console.error("failed to logout", e);
      }
      try {
        await (this as any).$w3a.web3Auth.walletAdapters[
          "openlogin"
        ].openloginInstance.logout();
      } catch (e) {
        console.error("failed to logout", e);
      }
      try {
        await (this as any).$w3a.web3Auth.logout();
      } catch (e) {
        console.error("failed to logout", e);
      }
      this.isCalled = false;
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      if (isSafari) {
        try {
          await (this as any).$w3a.login(() => {});
        } catch (e) {
          console.error("failure", e);
        } finally {
          let app_scoped_privkey;
          let user: any = {};
          let app_pub_key;
          const _this: any = this;

          const userInfo = (await (
            this as any
          ).$w3a.web3Auth.authenticateUser()) as any;
          let idToken = userInfo.idToken;
          user.idToken = idToken;
          const jwtDecoded: any = jwt_decode(idToken);
          app_pub_key = jwtDecoded.wallets[0].address;
          if (!app_pub_key) {
            app_scoped_privkey = (await (
              this as any
            ).$w3a.web3Auth.provider?.request({
              method: "eth_private_key",
            })) as any;
            user = await (this as any).$w3a.web3Auth.getUserInfo();
            app_pub_key = getPublicCompressed(
              Buffer.from(app_scoped_privkey?.padStart(64, "0"), "hex")
            ).toString("hex");
          }
          if (!app_pub_key) {
            // retry
            // console.log("retry", app_scoped_privkey);
            let _this: any = this;
            (this as any)
              .$swal({
                title: (this as any).$t("sorry_something_went_wrong"),
                text: (this as any).$t("please_try_again"),
                position: "center",
                icon: "error",
                timer: 2500,
              })
              .then(async function (result: any) {
                await _this.logout();
                _this.handleLogin();
              });
            return;
          }
          // set axios default header
          const userIdToken = {
            idToken: user.idToken,
            app_pub_key: app_pub_key,
          };
          sessionStorage.setItem("token", JSON.stringify(userIdToken));
          this.nftReceive();
        }
      } else {
        (this as any).$w3a.login(async (info: any) => {
          if (info.status === $WEB3AUTH.STATUS.LOGIN.SUCCESS) {
            sessionStorage.removeItem("iWeb3Auth-cachedAdapter");
            let app_scoped_privkey;
            let user: any = {};
            let app_pub_key;
            try {
              const userInfo = (await (
                this as any
              ).$w3a.web3Auth.authenticateUser()) as any;
              let idToken = userInfo.idToken;
              user.idToken = idToken;
              const jwtDecoded: any = jwt_decode(idToken);
              app_pub_key = jwtDecoded.wallets[0].address;
              if (!app_pub_key) {
                app_scoped_privkey = (await (
                  this as any
                ).$w3a.web3Auth.provider?.request({
                  method: "eth_private_key",
                })) as any;
                user = await (this as any).$w3a.web3Auth.getUserInfo();
                app_pub_key = getPublicCompressed(
                  Buffer.from(app_scoped_privkey?.padStart(64, "0"), "hex")
                ).toString("hex");
              }

              // set axios default header
              const userIdToken = {
                idToken: user.idToken,
                app_pub_key: app_pub_key,
              };
              sessionStorage.setItem("token", JSON.stringify(userIdToken));
            } catch (e) {
              await (this as any).$w3a.web3Auth.connect();
              app_scoped_privkey = await (
                this as any
              ).$w3a.web3Auth.authenticateUser();

              const app_pub_key = await getPublicCompressed(
                Buffer.from(
                  app_scoped_privkey.idToken?.padStart(64, "0"),
                  "hex"
                )
              ).toString("hex");

              // set axios default header
              const userIdToken = {
                idToken: user.idToken,
                app_pub_key: app_pub_key,
              };
              sessionStorage.setItem("token", JSON.stringify(userIdToken));
            }

            this.nftReceive();
          } else {
            const _this = this;
            (this as any)
              .$swal({
                title: (this as any).$t("sorry_something_went_wrong"),
                text: (this as any).$t("please_try_again"),
                position: "center",
                icon: "error",
                timer: 2500,
              })
              .then(function (result: any) {
                _this.logout();
              });
          }
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.underline {
  margin-bottom: 47px;
}
.border-vertical {
  position: absolute;
  width: 0;
  height: 40px;
  left: 50vw;
  top: 195px;
  z-index: 1;
  border: 1px solid $black;
}
.switch-alert {
  margin-top: 20px;
  font-family: "Noto Sans", sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: 0.1em;
  color: $black;
  font-size: 12px;
  line-height: 18px;
}
.link {
  cursor: pointer;
  color: blue;
  margin-top: 20px;
  text-decoration: underline;
  @media all and (max-width: 750px) {
    margin-top: 20px;
  }
}
</style>
