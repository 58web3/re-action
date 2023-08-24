<template>
  <div class="auth-container">
    <div class="d-flex flex-column">
      <span class="head-title">{{ $t("mypage") }}</span>
      <div class="wallet mt-4" v-if="userWallet">
        <img src="@/assets/img/icon-wallet.png" />
        <span>{{ userWallet }}</span>
      </div>

      <div
        v-if="toChunks"
        id="carouselExampleControls"
        class="carousel-block carousel slide"
        data-bs-ride="carousel"
      >
        <div class="carousel-indicators" v-if="NFTS.length > 1">
          <button
            v-for="(item, idx) in NFTS.length"
            type="button"
            :key="'SlideID' + item"
            data-bs-target="#carouselExampleIndicators"
            :data-bs-slide-to="item"
            :class="{ active: idx === currentSlider }"
            @click="currentSlider = idx"
            aria-current="true"
          ></button>
        </div>
        <div class="carousel-inner">
          <div
            class="carousel-item"
            v-for="(items, idx) in NFTS"
            :key="idx"
            :class="{ active: idx === currentSlider }"
          >
            <div class="d-flex flex-wrap justify-content-center nft-container">
              <NFT
                @openIssueDid="nextStep()"
                @openVC="handleShowModalVc()"
                @bottomSheet="handleOpenSelectFile()"
                v-for="item in items"
                :token="item"
                :key="item.token"
              >
              </NFT>
            </div>
          </div>
          <Loading class="p-5" v-if="NFTS.length === 0"></Loading>
        </div>
        <button
          v-if="NFTS.length > 1"
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
          @click="prev()"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button
          v-if="NFTS.length > 1"
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
          @click="next()"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      <div class="info-block">
        <div class="sub-title">{{ $t("about_my_page") }}</div>
        <div class="description">
          {{ $t("section_above") }}
          <div class="link">
            <a
              href="https://revisionartproject.com/articles/642f9b8fd511e51b13679591"
              target="_blank"
              >{{ $t("faq_nft_community") }}</a
            >
          </div>
        </div>
        <div class="foot-img">{{ $t("join_to_com") }}</div>
      </div>
      <div class="contact-block">
        <div class="title">
          {{ $t("section_bellow") }}
        </div>
        <div class="d-flex socials justify-content-center">
          <div class="d-flex justify-content-center align-content-center m-2">
            <img src="@/assets/img/twitter.svg" class="mr-4" />
            <a href="https://twitter.com/REproject_JAPAN" target="_blank">{{
              $t("join_twitter")
            }}</a>
          </div>
          <div class="d-flex justify-content-center align-content-center m-2">
            <img src="@/assets/img/discord.svg" class="mr-4" />
            <a href="https://discord.gg/C9KrKTS5NJ" target="_blank">{{
              $t("join_discord")
            }}</a>
          </div>
        </div>
        <v-button class="m-auto" :text="$t('logout')" @click="logout" />
      </div>
    </div>
  </div>
  <OverlaySpinner
    v-show="showSpinner"
    :message="spinnerMessage"
  ></OverlaySpinner>
  <ModalIssueDid v-show="showModal" @close="close" />
  <ModalIssueVC v-show="showModalVC" @close="close" />
  <ModalPostMedia
    v-show="showModalMedia"
    :name="nameFile"
    :type="typeFile"
    :size="sizeFile"
    @close="close"
    @chooseImage="handleChooseMedia"
  />
  <bottom-sheet :defaultState="sheetState" @setState="setState()">
    <div style="padding-left: 10px; padding-right: 10px">
      <ListOptionSelectFile @onFile="onFile" />
    </div>
  </bottom-sheet>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import $WEB3AUTH from "@/constants/web3auth";
import NFT from "@/components/NFT.vue";
import OverlaySpinner from "@/views/OverlaySpinner.vue";
import { mapActions, mapGetters } from "vuex";
import Web3AuthService from "../services/web3authServices";
import VButton from "@/components/Button.vue";
import Loading from "@/components/Loading.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import ModalIssueDid from "@/components/IssueDid/ModalIssueDid.vue";
import ModalIssueVC from "@/components/IssueVc/ModalIssueVC.vue";
import ModalPostMedia from "@/components/PostMedia/ModalPostMedia.vue";
import ListOptionSelectFile from "@/components/ListOptionSelectFile.vue";
import axiosService from "@/services/axiosServices";
import { API_ENDPOINT } from "@/constants/api";

export default defineComponent({
  name: "MyPageView",
  components: {
    NFT,
    OverlaySpinner,
    VButton,
    Loading,
    ModalIssueDid,
    ModalIssueVC,
    BottomSheet,
    ListOptionSelectFile,
    ModalPostMedia,
  },
  data() {
    return {
      showSpinner: true,
      spinnerMessage: this.$t("checking_nft"),
      page: 1,
      rpc: Web3AuthService,
      NFTS: [],
      userWallet: "",
      currentSlider: 0,
      showModal: false,
      showModalVC: false,
      showModalMedia: false,
      isLoading: false,
      sheetState: "half",
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      imageinfo: null,
      nameFile: "",
      typeFile: "",
      sizeFile: "",
    };
  },
  async mounted() {
    (this as any).$w3a.login(async (callback: any) => {
      if (callback?.status === $WEB3AUTH.STATUS.LOGIN.SUCCESS) {
        try {
          this.userWallet = (this as any).rpc.userData.address;
          if (this.userWallet) {
            await (this as any).fetchUserId({
              wallet_address: this.userWallet,
            });
            await (this as any).fetchUser();
            await (this as any).fetchNFT(this.userWallet);
            await this.toChunks();
          }
        } catch (e) {
          (this as any).handelUnexpectedError();
        }
      } else {
        console.error("w3a login failed");
        if (
          !(this as any).rpc.userData ||
          ((this as any).rpc.userData &&
            (this as any).rpc.userData.chainId !== process.env.VUE_APP_CHAIN_ID)
        ) {
          this.logout();
          return;
        }
        (this as any).handelUnexpectedError();
      }
    });
    // !!: Sometimes w3a login callback not work. Handle that irregular case here
    const _this = this;
    window.setTimeout(function () {
      if (!_this.userWallet || _this.userWallet === "") {
        (_this as any).handelUnexpectedError();
      }
    }, 10000);
  },
  computed: {
    ...mapGetters({
      user: "user/data",
      userNFT: "nft/data",
    }),
  },
  methods: {
    ...mapActions({
      fetchUserId: "user/FETCH_USER_ID",
      fetchUser: "user/FETCH_USER",
      fetchNFT: "nft/FETCH_USER_NFTS",
    }),
    prev() {
      if (this.currentSlider !== 0) {
        this.currentSlider--;
      } else {
        this.currentSlider = this.NFTS.length - 1;
      }
    },
    onFile(file: any) {
      this.imageinfo = file[0];
      this.nameFile = file[0].name;
      this.typeFile = file[0].type;
      this.sizeFile = file[0].size;
      this.showModalMedia = true;
      this.sheetState = "half";
    },
    handleChooseMedia() {
      this.showModalMedia = false;
      this.handleOpenSelectFile();
    },
    setState() {
      this.sheetState = "half";
    },
    handleOpenSelectFile() {
      this.sheetState = "open";
    },
    nextStep() {
      this.showModal = true;
    },
    handleShowModalVc() {
      this.showModalVC = true;
    },
    close() {
      this.showModal = false;
      this.showModalVC = false;
      this.showModalMedia = false;
    },
    next() {
      if (this.currentSlider === this.NFTS.length) {
        this.currentSlider++;
      } else {
        this.currentSlider = 0;
      }
    },
    async logout() {
      (this as any).spinnerMessage = "logging out...";
      (this as any).showSpinner = true;
      try {
        await axiosService.post(`${API_ENDPOINT}/v1/logout`, {}).catch((e) => {
          this.handelUnexpectedError();
        });
        await (this as any).$w3a.logout();
      } catch (e) {
        console.error(e);
      } finally {
        sessionStorage.removeItem("token");
        (this as any).showSpinner = false;
        this.$router.push("/sign-in");
      }
    },
    handelUnexpectedError() {
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
    },
    toChunks() {
      const size = 4;
      if ((this as any).userNFT.result) {
        for (let i = 0; i < (this as any).userNFT.result.length; i += size) {
          (this as any).NFTS.push(
            (this as any).userNFT.result.slice(i, i + size)
          );
        }
        this.showSpinner = false;
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.nft-container {
  padding-bottom: 40px;
}
.wallet {
  display: flex;
  align-content: center;
  justify-content: center;
  img {
    width: 25px;
    height: 25px;
    margin-right: 5px;
  }
  span {
    line-height: 25px;
  }
}
.info-block {
  background-color: $white;
  width: 100%;
  text-align: center;
  padding: 50px;
  color: $black;
  flex-direction: column;
  @media all and (max-width: 750px) {
    padding: 30px;
  }
  .title {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 210%;
    /* or 29px */

    text-align: center;

    color: $black;
    @media all and (max-width: 750px) {
      text-align: left;
      font-size: 13px;
    }
  }
  .sub-title {
    font-style: normal;
    font-weight: 700;
    font-size: 48px;
    line-height: 107.5%;
    /* identical to box height, or 52px */

    letter-spacing: 0.03em;

    color: $black;
    @media all and (max-width: 750px) {
      text-align: left;
      font-size: 40px;
    }
  }
  .description {
    margin: 0 auto;
    margin-top: 17px;
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 180%;
    /* or 23px */
    max-width: 450px;
    text-align: center;

    color: $black;
    @media all and (max-width: 750px) {
      text-align: left;
    }
  }
  .foot-img {
    width: fit-content;
    position: relative;
    background: $black;
    font-family: "DotGothic16";
    font-style: normal;
    font-weight: 400;
    font-size: 38px;
    line-height: 55px;
    text-align: center;
    color: $white;
    padding: 0 10px;
    top: 70px;
    margin: 0 auto;
    @media all and (max-width: 750px) {
      font-size: 38px;
      line-height: 55px;
    }
  }
}
.link {
  cursor: pointer;
  color: blue;
  margin-top: 16px;
  text-decoration: underline;
  @media all and (max-width: 750px) {
    margin-top: 16px;
  }
}
.contact-block {
  text-align: center;
  width: 100%;
  padding: 50px;
  background: #e7e7e7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media all and (max-width: 750px) {
    padding-top: 100px;
  }
  .title {
    max-width: 450px;
    margin: 0 auto;
    text-align: center;
    font-style: normal;
    font-weight: 400;
    color: $black;
    font-size: 14px;
    @media all and (max-width: 750px) {
      font-size: 13px;
    }
  }
  .socials {
    margin-top: 46px;
    margin-bottom: 20px;
    align-content: center;
    align-items: center;
    @media all and (max-width: 750px) {
      flex-direction: column;
    }
    a {
      color: $black;
      margin-left: 5px;
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 210.5%;
      letter-spacing: 0.1em;
      text-decoration-line: underline;
    }
  }
}

.container {
  margin: 200px auto 100px;
}
</style>
