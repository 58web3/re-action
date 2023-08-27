<template>
  <ModalTemplate @close="$emit('close')">
    <div class="container-modal">
      <h3>Post Media</h3>
      <div v-if="step === 1" class="d-flex flex-column">
        <div class="row">
          <div class="col-6 d-flex justify-content-end">File Name</div>
          <div class="col-6 d-flex justify-content-start">
            {{ name }}
          </div>
        </div>
        <div class="row">
          <div class="col-6 d-flex justify-content-end">Media Type</div>
          <div class="col-6 d-flex justify-content-start">
            {{ type }}
          </div>
        </div>
        <div class="row">
          <div class="col-6 d-flex justify-content-end">Size</div>
          <div class="col-6 d-flex justify-content-start">
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
    };
  },
  methods: {
    onCancel() {
      this.$emit("close");
      this.step = 1;
    },
    async confirmInfo() {
      this.step = 2;

      /*
      setTimeout(() => {
        this.step = 3;
      }, 5000);
      */
      // verify vc
      const vpRes = await axiosService.get(
        `${API_ENDPOINT}/v1/verifier/presentation-request?include_qr_code=false`
      );
      const vpData = vpRes.data;
      console.log("vpData:", vpData);

      const id = vpData.data.id;
      const url = vpData.data.url;
      console.log("id:", id, "url:" + url);
      const requestUri = url.split("request_uri=")[1];
      console.log("requestUri:" + requestUri);

      const apiRes = await axiosService.post(
        `${API_ENDPOINT}/v1/issuer/run-request-uri`,
        {
          request_uri: requestUri,
        }
      );
      const requestUriData = apiRes.data;
      console.log("requestUriData:", requestUriData);
      localStorage.setItem("reearthVP", JSON.stringify(requestUriData.data));

      // vpResponse
      const vpResponseRes = await axiosService.get(
        `${API_ENDPOINT}/v1/verifier/presentation-response?id=${id}`
      );
      const vpResponseData = vpResponseRes.data;
      console.log("vpResponseData:", vpResponseData);

      let vpResult = false;

      if (vpResult) {
        // to call post notion API
        // TODO

        // alert message
        this.$swal({
          title: this.$t("post_media"),
          text: this.$t("post_media_success"),
          position: "center",
          icon: "success",
        });
        this.$emit("close");
      } else {
        // alert error
        this.$swal({
          title: this.$t("post_media"),
          text: this.$t("post_media_failed"),
          position: "center",
          icon: "error",
        });
        this.$emit("close");
        this.step = 1;
      }
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
