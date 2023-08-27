<template>
  <ModalTemplate @close="$emit('close')">
    <div class="container-modal">
      <h3>Issue VC</h3>
      <h5>Please agree to publish your data to Issue vc your VC</h5>
      <div class="wrap-content gap-5 mt-4">
        <div v-if="step === 1" class="checkbox-list">
          <Checkbox
            label="Your Name (first and last name)"
            value="name"
            @change="changeName"
          />
          <Checkbox
            label="Wallet Address"
            value="wallet"
            @change="changeWallet"
          />
          <p class="note">
            You need to agree to publish the data described above
          </p>
        </div>
        <ModalLoading v-else :message="$t('prevent_close_window')" />
        <div class="d-flex flex-column gap-2 mt-5">
          <VButton
            v-if="step === 1"
            :text="$t('issue_vc')"
            @click="requestDID"
            class="m-auto"
          ></VButton>
          <VButton
            v-if="step === 1"
            type
            :text="$t('cancel')"
            @click="onCancel"
            class="m-auto"
          ></VButton>
        </div>
      </div>
    </div>
  </ModalTemplate>
</template>
<script>
import VInput from "@/components/UIComponent/Input";
import Checkbox from "@/components/UIComponent/Checkbox";
import VButton from "@/components/Button";
import ModalLoading from "@/components/IssueDid/ModalLoading";
import ModalTemplate from "@/components/ModalTemplate";
import ErrorMessage from "@/components/UIComponent/ErrorMessage";
import { emailRegex } from "@/utils/validations";
import axiosService from "@/services/axiosServices";
import { API_ENDPOINT } from "@/constants/api";

export default {
  name: "ModalIssueDid",
  components: {
    VInput,
    ModalTemplate,
    VButton,
    ModalLoading,
    ErrorMessage,
    Checkbox,
  },
  data() {
    return {
      emailRegex,
      step: 1,
      showSpinner: false,
      nameCheck: false,
      walletCheck: false
    };
  },
  methods: {
    changeName(value) {
      if (value === false) {
        this.nameCheck = false;
      } else if (value === true) {
        this.nameCheck = true;
      } 
    },
    changeWallet(value) {
      if (value === false) {
        this.walletCheck = false;
      } else if (value === true) {
        this.walletCheck = true;
      }
    },
    onCancel() {
      this.$emit("close");
      this.step = 1;
    },
    confirmInfo() {
      this.step = 2;
    },
    async requestDID() {
      this.step = 3;

      // user info
      const vcUserInfo = {
        include_qr_code: false
      }

      if (this.nameCheck) {
        vcUserInfo.first_name = `first name1234`;
        vcUserInfo.last_name = `last name1234`;
        vcUserInfo.email = `last name1234`;
      }

      if (this.walletCheck) {
        vcUserInfo.wallet_address = this.$w3a.userData.address;
      }

      // call /issuer/issuance-request api
      await axiosService.post(`${API_ENDPOINT}/v1/issuer/issuance-request`, vcUserInfo).then(async (res) => {
        console.log(res.data);
        const id = res.data.data.id;
        const url = res.data.data.url;
        console.log("id:", id, "url:" + url);
        const requestUri = url.split("request_uri=")[1];
        console.log("requestUri:" + requestUri);

        // call api to run request URI
        const apiRes = await axiosService.post(`${API_ENDPOINT}/v1/issuer/run-request-uri`, {
          request_uri: requestUri
        });
        const requestUriData = apiRes.data;
        console.log("requestUriData:", requestUriData);
        localStorage.setItem("reearthVC", JSON.stringify(requestUriData.data));

        // check issuance response by /issuer/issuance-response
        const issuanceRes = await axiosService.get(`${API_ENDPOINT}/v1/issuer/issuance-response?id=${id}`);
        const issuanceData = issuanceRes.data;

        console.log("issuanceData:", issuanceData);
        
        this.$emit("close");
        this.step = 1;
        this.$swal({
          title: this.$t("issue_vc"),
          text: this.$t("vc_issue_success"),
          position: "center",
          icon: "success",
        });
      }).catch((e) => {
        console.log(e);

        this.$emit("close");
        this.$swal({
          title: this.$t("issue_vc"),
          text: this.$t("vc_issue_failed"),
          position: "center",
          icon: "error",
        });

        this.step = 1;
      });
    },
  },
};
</script>
<style>
.container-modal {
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
