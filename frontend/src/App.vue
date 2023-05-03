<template>
  <MainHeader />
  <div class="body-content">
    <router-view />
  </div>
  <MainFooter />
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { API_ENDPOINT } from "./constants/api";
import $WEB3AUTH from "./constants/web3auth";
import axiosServices from "./services/axiosServices";
import Web3AuthService from "./services/web3authServices";
import moment from "moment";
import { mapState } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { watch } from "vue";
import jwt_decode from "jwt-decode";
import { useI18n } from "vue-i18n";
import MainHeader from "@/components/MainHeader.vue";
import MainFooter from "@/components/MainFooter.vue";

export default defineComponent({
  data() {
    return {
      w3a: Web3AuthService,
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();
    document.body.classList.add(sessionStorage.getItem("lang") as string);
    async function checkExp(callback: (arg0: {}) => void) {
      const config = JSON.parse(sessionStorage.getItem("token") as string);
      if (!config || !config?.idToken) {
        callback(false);
        return;
      }
      const jwtDecoded: any = jwt_decode(config?.idToken);
      const exp: number = jwtDecoded?.exp;
      const systemDateUnix: number = new Date().getTime() / 1000;
      if (exp < systemDateUnix) {
        callback(false);
      } else {
        callback(true);
      }
      return;
    }

    watch(
      () => route.name,
      async () => {
        if (route?.name === "sign-in") {
          document
            .getElementById("w3a-container")
            ?.classList?.remove("w3a-display-none");
        } else {
          document
            .getElementById("w3a-container")
            ?.classList?.add("w3a-display-none");
        }
        if (
          route?.name === "/" ||
          route?.name === "email-verification" ||
          route?.name === "code-verification"
        ) {
          return;
        }
        checkExp(async (result) => {
          if (result) {
            if (route?.name === "sign-in") {
              router.push("/mypage");
            }
          } else {
            if (route?.name === "sign-in") {
              // stay
            } else {
              try {
                await (this as any).$w3a.logout();
              } catch (e) {
              } finally {
                if (route?.name != "/") {
                  router.push("/");
                }
              }
            }
          }
        });
      }
    );
    return { route };
  },
  components: {
    MainHeader,
    MainFooter,
  },
});
</script>
<style lang="scss">
body {
  margin: 0px !important;
}

.ja {
  font-family: "Noto Sans JP";
}
.en {
  font-family: "Noto Sans";
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
