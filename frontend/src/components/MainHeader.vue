<template>
  <div id="container_">
    <div class="container_inner">
      <div>
        <img
          src="@/assets/img/header-logo-1.png"
          class="logo"
          @click="goHome()"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#container_ {
  backdrop-filter: blur(10px);
  margin-right: 0 !important;
  margin-left: 0 !important;
  /*Fixed header*/
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: unset;
  border-bottom: 1px solid $black;
  .container_inner {
    width: 80% !important;
    display: flex;
    justify-content: start;
    @media all and (max-width: 750px) {
      width: 90% !important;
    }
  }

  .logo {
    cursor: pointer;
    @media all and (max-width: 750px) {
      width: 90px;
    }
  }
  @media all and (max-width: 750px) {
    height: 70px;
  }
}
</style>

<script>
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import Web3AuthService from "../services/web3authServices";
import axiosServices from "../services/axiosServices";
import { API_ENDPOINT } from "@/constants/api";
import { CHAIN_IDS } from "@/constants/chain";

export default defineComponent({
  name: "MainHeader",
  data() {
    return {
      notificationIconImage: this.notificationIconImageNornal,
      didLoadProfile: false,
      profileImage: null,
      w3a: Web3AuthService,
      chainName: "Searching...",
    };
  },
  mounted() {
    this.w3a.getUserInfo(() => {
      var chainId = this.w3a?.web3Auth?.options?.chainConfig?.chainId;
      if (chainId) {
        chainId = parseInt(chainId, 16);
      }
      this.chainName = CHAIN_IDS[chainId] ?? "Searching...";
    });
  },
  computed: {
    ...mapState("user", {
      userData: "data",
      user_id: "user_id",
    }),

    notificationIconImageNornal: function () {
      return require("@/assets/img/icon-bell.png");
    },
    notificationIconImageFlagged: function () {
      return require("@/assets/img/icon-bell-dot.png");
    },
    loaderImageMedium: function () {
      return require("@/assets/img/loader-medium.gif");
    },
    defaultProfileImageUrl: function () {
      return require("@/assets/img/icon-profile.png");
    },
  },
  emits: [
    "click-profile-event",
    "click-share-event",
    "click-notification-event",
  ],
  methods: {
    ...mapActions("user", {
      fetchUser: "FETCH_USER",
    }),
    goHome() {
      if (this.$route.name !== "mypage") {
        this.$router.push("/");
      }
    },
  },
  watch: {
    userData: {
      handler(n, o) {
        if (n) {
          if (this.userData?.profile_image_url) {
            this.$axios
              .get(`${API_ENDPOINT}${this.userData?.profile_image_url}`, {
                responseType: "arraybuffer",
              })
              .then(async (res) => {
                const base64 = Buffer.from(res.data, "binary").toString(
                  "base64"
                );
                this.profileImage = "data:image/jpeg;base64," + base64;
              })
              .catch(async (e) => {
                //
              });
          } else {
            this.profileImage = this.defaultProfileImageUrl;
          }
          if (this.userData?.has_new_notification) {
            this.notificationIconImage = this.notificationIconImageFlagged;
          } else {
            this.notificationIconImage = this.notificationIconImageNornal;
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>
