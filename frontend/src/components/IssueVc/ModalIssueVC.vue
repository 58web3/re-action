<template>
  <ModalTemplate @close="$emit('close')">
    <div class="container-modal">
      <h3>Issue VC</h3>
      <h5 v-if="step === 1">Please agree to publish your data to Issue vc your VC</h5>
      <div class="wrap-content gap-5 mt-4">
        <div v-if="step === 1" class="checkbox-list">
          <Checkbox
            label="Your Name (first and last name)"
            value="name"
            @change="changeName"
          />
          <Checkbox
            label="Wallet Address"
            value="wallet" @change="changeWallet"
          />
          <p class="note">
            You need to agree to publish the data described above
          </p>
        </div>
        <div v-else-if="step === 2">
          <img :src="qrCode">
          <p>{{ this.$t("please-scan-using-authenticator") }}</p>
          <p>Pin Code: {{ this.pinCode }}</p>
          <p>Message: {{ this.message }}</p>
        </div>
        <ModalLoading v-else :message="$t('prevent_close_window')" />
        <div class="d-flex flex-column gap-2 mt-5">
          <VButton
            v-if="step === 1"
            :text="$t('issue_vc')"
            @click="requestVC"
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
import { EthrDID } from 'ethr-did';
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'
import jwtDecode from "jwt-decode";

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
      MySelectedValues: [],
      nameCheck: false,
      walletCheck: false,
      qrCode: null,
      pinCode: null,
      message: '',
      statusConfirmMax: 24
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
    async requestVC() {
      // user info
      const vcUserInfo = {
        include_qr_code: true,
      };

      //const keypair = JSON.parse(localStorage.getItem('didKeypair'));
      //const did = new EthrDID({...keypair});
      //const didResolver = new Resolver(getResolver({ rpcUrl: process.env.VUE_APP_RPC_TARGET, name: "localhost"}));
      //const userDidInfo = did.verifyJWT(localStorage.getItem('userDidInfo'), didResolver);
      const userDidInfo = jwtDecode(localStorage.getItem('userDidInfo'));
      console.log(userDidInfo);

      if (this.nameCheck) {
        vcUserInfo.first_name = userDidInfo.firstName;
        vcUserInfo.last_name = userDidInfo.lastName;
        vcUserInfo.email = userDidInfo.email;
      }

      if (this.walletCheck) {
        vcUserInfo.wallet_address = this.$w3a.userData.address;
      }

      // call /issuer/issuance-request api
      await axiosService
        .post(`${API_ENDPOINT}/v1/issuer/issuance-request`, vcUserInfo)
        .then(async (res) => {
          this.step = 2;

          console.log(res.data);
          this.qrCode = res.data.data.qrCode;
          this.pinCode = res.data.data.pinCode;
          const id = res.data.data.id;

          let statusConfirmCount = 0;

          const interval = setInterval(async () => {
            const checkRes = await axiosService.get(`${API_ENDPOINT}/v1/issuer/issuance-response?id=${id}`);
            const checkResData = checkRes.data;
            console.log(checkResData);
            if (checkResData.data.requestStatus === "issuance_successful") {
              clearInterval(interval);
              this.message = checkResData.data.message;

              setTimeout(() => {
                this.$emit("close");
                this.$swal({
                  title: this.$t("issue_vc"),
                  text: this.$t("vc_issue_success"),
                  position: "center",
                  icon: "success",
                });
                this.step = 1;
              }, 2000);
            } else if (checkResData.data.requestStatus === "request_retrieved") {
              this.message = checkResData.data.message;
            }else if (checkResData.data.requestStatus === "issuance_error") {
              clearInterval(interval);
              this.message = checkResData.data.message;
            }

            statusConfirmCount++;

            if (statusConfirmCount >= this.statusConfirmMax) {
              clearInterval(interval);

              this.$emit("close");

              this.$swal({
                title: this.$t("issue_vc"),
                text: this.$t("vc_issue_error"),
                position: "center",
                icon: "error",
              });
            }
          }, 5000);
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

.wrap-content .checkbox-list {
  padding-left: 2rem;
  padding-right: 2rem;

  @media all and (max-width: 450px) {
    padding-left: 0px;
    padding-right: 0px;
  }
}

.checkbox-list .wrapper {
  padding-left: 30px
}

.note {
  text-align: left;
  font-size: 0.9rem;
  color: rgb(249, 176, 177);
}
</style>
