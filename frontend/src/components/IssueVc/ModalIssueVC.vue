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
          <Checkbox label="Wallet Address" value="wallet" @change="changeWallet" />
          <p class="note">You need to agree to publish the data described above</p>
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
      nameCheck: false,
      walletCheck: false,
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
        include_qr_code: true,
      };

      if (this.nameCheck) {
        vcUserInfo.first_name = localStorage.getItem("first_name");
        vcUserInfo.last_name = localStorage.getItem("last_name");
        vcUserInfo.email = localStorage.getItem("email");
      }

      if (this.walletCheck) {
        vcUserInfo.wallet_address = this.$w3a.userData.address;
      }

      // call /issuer/issuance-request api
      await axiosService
        .post(`${API_ENDPOINT}/v1/issuer/issuance-request`, vcUserInfo)
        .then(async (res) => {
          console.log(res.data);
          const id = res.data.data.id;
          const url = res.data.data.url;
          const pin = res.data.data.pin;
          console.log("id:", id, "url:" + url, "pin:", pin);
          const requestUri = url.split("request_uri=")[1];
          console.log("requestUri:" + requestUri);

          // call api to run request URI
          const apiRes = await axiosService.post(
            `${API_ENDPOINT}/v1/issuer/issue-card`,
            {
              request_uri: requestUri,
            }
          );
          const requestUriData = apiRes.data;
          console.log("requestUriData:", requestUriData);
          localStorage.setItem("reearthVC", JSON.stringify(requestUriData.data));

          const decodeJwt = jwtDecode(requestUriData.data);
          console.log(decodeJwt);

          // TODO
          // Issuer の DID を Resolve
          // client_id discover
          // https://discover.did.msidentity.com/v1.0/identifiers/did:web:6de8-115-162-82-158.ngrok-free.app
          // {"@context":"https://w3id.org/did-resolution/v1","didDocument":{"id":"did:web:6de8-115-162-82-158.ngrok-free.app","@context":["https://www.w3.org/ns/did/v1",{"@base":"did:web:6de8-115-162-82-158.ngrok-free.app"}],"service":[{"id":"#linkeddomains","type":"LinkedDomains","serviceEndpoint":{"origins":["https://6de8-115-162-82-158.ngrok-free.app/"]}},{"id":"#hub","type":"IdentityHub","serviceEndpoint":{"instances":["https://hub.did.msidentity.com/v1.0/766072a8-e18b-4139-b3f4-4bbc875ff40b"]}}],"verificationMethod":[{"id":"#4f179b6f79bc4b7c9b9b617a452ca908vcSigningKey-57bc6","controller":"did:web:6de8-115-162-82-158.ngrok-free.app","type":"EcdsaSecp256k1VerificationKey2019","publicKeyJwk":{"crv":"secp256k1","kty":"EC","x":"e82vEz9LAO1TkJbm-hi3RVA92Cgcu1LZ09IWB001nAU","y":"V8_jnUEPyFwwArHTCuD0TGsgI9Z6iABxvhLdtcJ_jsY"}}],"authentication":["#4f179b6f79bc4b7c9b9b617a452ca908vcSigningKey-57bc6"],"assertionMethod":["#4f179b6f79bc4b7c9b9b617a452ca908vcSigningKey-57bc6"]},"didDocumentMetadata":{"canonicalId":"did:web:6de8-115-162-82-158.ngrok-free.app"}}

          // Credential Manifest をダウンロードします。
          // https://verifiedid.did.msidentity.com/v1.0/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/verifiableCredential/contracts/<VC_NAME>
          // 正しく署名されているか
          // VC を発行する組織のドメインの did-configuration.json を取得するや、Domain Linkage の有効性を検証します

          // (12) ユーザーが Authenticator 上で表示された VC カードの「追加」ボタンをタップします。
          // https://beta.did.msidentity.com/v1.0/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/verifiableCredential/card/issue

          // (13) Authenticator が Authorization Response を MS Verified ID サービスに送信します。

          // (14) MS Verified ID が Authenticator に署名済みの VC を送信します。

          // (15) Authenticator から MS Verified ID に issuance_successful の通知を送信します。
          //   POST https://beta.did.msidentity.com/v1.0/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/verifiableCredentials/issuance

          // {
          //   "state": "xxxxxxxxxxxxxxxxxxxxxxxxx",
          //   "code": "issuance_successful"
          // }



          const completeRequestUri = decodeJwt.redirect_uri;
          console.log("completeRequestUri:", completeRequestUri);

          // Pinコードで完了する
          /*const completeRes = await axiosService.post(
            `${API_ENDPOINT}/v1/issuer/run-request-uri`,
            {
              request_uri: completeRequestUri,
              method: "post",
              state: decodeJwt.state,
              pin: pin,
            }
          );
          console.log("completeRes: ", completeRes.data);
          */

          // (16) MS Verified ID が Web App の Callback エンドポイントに「VC 発行されたよ」のお知らせを送信します。
          // do nothing

          // (17) Web ブラウザーが Polling で状態変更を取得し、ユーザーに知らせます。
          // check issuance response by /issuer/issuance-response
          const issuanceRes = await axiosService.get(
            `${API_ENDPOINT}/v1/issuer/issuance-response?id=${id}`
          );
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
        })
        .catch((e) => {
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
