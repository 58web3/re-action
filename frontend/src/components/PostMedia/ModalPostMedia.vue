<template>
  <ModalTemplate @close="$emit('close')">
    <div class="container-modal">
      <h3>Post Media</h3>
      <div v-if="step === 0 && qrCode">
        <img :src="qrCode" />
        <p>{{ this.$t("please-scan-using-authenticator") }}</p>
      </div>
      <div v-if="step === 1" class="d-flex flex-column">
        <div class="row">
          <div class="col-4 d-flex justify-content-end">File Name:</div>
          <div class="col-8 d-flex justify-content-start">
            {{ name }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 d-flex justify-content-end">Media Type:</div>
          <div class="col-8 d-flex justify-content-start">
            {{ type }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 d-flex justify-content-end">Size:</div>
          <div class="col-8 d-flex justify-content-start">
            {{ size }}
          </div>
        </div>
        <VButton
          :text="$t('post_image')"
          @click="confirmInfo"
          class="m-auto mt-4"
        ></VButton>
        <VButton
          :text="$t('choose_other_image')"
          @click="handleChooseImage"
          class="m-auto mt-4"
          type
        ></VButton>
        <VButton
          :text="$t('cancel')"
          @click="$emit('close')"
          class="m-auto mt-4"
          type
        ></VButton>
      </div>
      <ModalLoading v-else :step="step" :message="$t('prevent_close_window')" />
    </div>
  </ModalTemplate>
</template>
<script>
import VButton from "@/components/Button";
import ModalLoading from "@/components/PostMedia/ModalLoading";
import ModalTemplate from "@/components/ModalTemplate";
import ErrorMessage from "@/components/UIComponent/ErrorMessage";
import { emailRegex } from "@/utils/validations";
import axiosService from "@/services/axiosServices";
import { API_ENDPOINT } from "@/constants/api";

export default {
  name: "ModalPostMedia",
  props: {
    file: {
      type: Object,
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
  },
  components: {
    ModalTemplate,
    VButton,
    ModalLoading,
    ErrorMessage,
  },
  data() {
    return {
      emailRegex,
      step: 1,
      showSpinner: false,
      MySelectedValues: [],
      mediaFile: null,
      qrCode: null,
      message: "",
    };
  },
  methods: {
    onCancel() {
      this.$emit("close");
      this.step = 1;
    },
    async confirmInfo() {
      const res = await axiosService.get(
        `${API_ENDPOINT}/v1/verifier/presentation-request`
      );
      const resData = res.data;
      console.log(resData);
      const id = resData.data.id;
      this.qrCode = resData.data.qrCode;
      this.step = 0;
      if (this.qrCode) {
        // check status
        const interval = setInterval(async () => {
          const checkRes = await axiosService.get(
            `${API_ENDPOINT}/v1/verifier/presentation-response?id=${id}`
          );
          const checkResData = checkRes.data;
          console.log(checkResData);
          if (checkResData.data.requestStatus === "presentation_verified") {
            clearInterval(interval);
            this.message = checkResData.data.message;

            setTimeout(() => {
              this.$emit("close");
              this.$swal({
                title: this.$t("post_media"),
                text: this.message,
                position: "center",
                icon: "success",
              });
              //this.step = 1;

              // Post media
              this.$emit("postMedia");

            }, 2000);
          } else if (checkResData.data.requestStatus === "request_retrieved") {
            this.message = checkResData.data.message;
          }
        }, 5000);
      }

      /*
      this.step = 2;
      setTimeout(() => {
        this.step = 3;
      }, 5000);
      setTimeout(() => {
        this.$swal({
          title: this.$t("post_media"),
          text: this.$t("post_media_success"),
          position: "center",
          icon: "success",
        });
        this.$emit("close");
      }, 6000);*/
    },
    handleChooseImage() {
      this.$emit("chooseImage");
    },
    requestDID() {
      this.step = 3;
      setTimeout(() => {
        this.$emit("close");
        this.$swal({
          title: this.$t("issue_vc"),
          text: this.$t("vc_issue_success"),
          position: "center",
          icon: "success",
        });
        this.step = 1;
      }, 5000);
    },
  },
};
</script>
<style>
.container-modal {
  width: 400px;
  background-color: #fff;
  padding: 2rem;
  border-radius: 5px;
}
.checkbox-list {
  padding-left: 10rem;
  padding-right: 10rem;

  @media all and (max-width: 450px) {
    padding-left: 0px;
    padding-right: 0px;
  }
}
.note {
  text-align: left;
  font-size: 0.9rem;
  color: rgb(249, 176, 177);
}
</style>
