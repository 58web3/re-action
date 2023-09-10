<template>
  <ModalTemplate @close="$emit('close')">
    <div class="container-modal">
      <h3>Issue DID</h3>
      <div class="wrap-content gap-5">
        <div v-if="step === 1" class="forms">
          <VInput
            placeholder="First Name"
            class="mt-3"
            v-model="firstName"
          ></VInput>
          <ErrorMessage :message="validationErrorFirstName" />
          <VInput
            placeholder="Last Name"
            class="mt-3"
            v-model="lastName"
          ></VInput>
          <ErrorMessage :message="validationErrorLastName" />
          <VInput
            placeholder="Email(Optional)"
            class="mt-3"
            v-model="email"
          ></VInput>
          <ErrorMessage :message="validationErrorEmail" />
        </div>
        <ModalIssueInfo
          v-else-if="step === 2"
          :firstName="firstName"
          :lastName="lastName"
          :email="email"
        />
        <ModalLoading v-else :message="$t('prevent_close_window')" />
        <div class="d-flex flex-column gap-2 mt-5">
          <VButton
            v-if="step === 2"
            :text="$t('correct_did')"
            @click="requestDID"
            class="m-auto"
          ></VButton>
          <VButton
            type
            v-if="step === 2"
            :text="$t('back')"
            @click="handleBack"
            class="m-auto"
          ></VButton>
          <VButton
            v-if="step === 1"
            :text="$t('issue_did')"
            @click="confirmInfo"
            class="m-auto"
          ></VButton>
          <VButton
            v-if="step !== 3"
            type
            :text="$t('cancel')"
            @click="handleCancel"
            class="m-auto"
          ></VButton>
        </div>
      </div>
    </div>
  </ModalTemplate>
</template>
<script>
import VInput from "@/components/UIComponent/Input";
import VButton from "@/components/Button";
import ModalIssueInfo from "@/components/IssueDid/ModalIssueInfo";
import ModalLoading from "@/components/IssueDid/ModalLoading";
import ModalTemplate from "@/components/ModalTemplate";
import ErrorMessage from "@/components/UIComponent/ErrorMessage";
import { emailRegex } from "@/utils/validations";
import { EthrDID } from 'ethr-did';
import Web3 from 'web3';
import { ethers } from 'ethers';

export default {
  name: "ModalIssueDid",
  components: {
    VInput,
    ModalIssueInfo,
    ModalTemplate,
    VButton,
    ModalLoading,
    ErrorMessage,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      validationErrorFirstName: "",
      validationErrorLastName: "",
      validationErrorEmail: "",
      emailRegex,
      step: 1,
      showSpinner: false,
    };
  },
  methods: {
    confirmInfo() {
      if (this.firstName === "") {
        this.validationErrorFirstName = "First name is required";
      } else if (this.lastName === "") {
        this.validationErrorLastName = "Last name is required";
      } else if (this.email && !this.emailRegex().test(this.email)) {
        this.validationErrorEmail = "Incorrect email format";
      } else {
        this.step = 2;
      }
    },
    async requestDID() {
      this.step = 3;

      // save to localstorage
      await this.generateAndEncrypt(this.lastName, this.firstName, this.email);

      setTimeout(() => {
        this.$emit("close");
        this.$swal({
          title: this.$t("issue_did"),
          text: this.$t("did_issue"),
          position: "center",
          icon: "success",
        });
        this.step = 1;
        (this.firstName = ""), (this.lastName = ""), (this.email = "");
      }, 2000);
    },
    handleBack() {
      this.step = 1;
    },
    handleCancel() {
      this.$emit("close");
      this.step = 1;
      (this.firstName = ""), (this.lastName = ""), (this.email = "");
    },
    async generateAndEncrypt(lastName, firstName, email) {

      const keypair = EthrDID.createKeyPair()
      const ethrDid = new EthrDID({...keypair});

      const userJwt = await ethrDid.signJWT({lastName: lastName, firstName: firstName, email: email})

      localStorage.setItem('didKeypair', JSON.stringify(keypair));
      localStorage.setItem('did', JSON.stringify(ethrDid));
      localStorage.setItem('userDidInfo', userJwt);
    },
  }
};
</script>
<style>
.container-modal {
  background-color: #fff;
  padding: 2rem;
  border-radius: 5px;
}

.forms input {
  width: 100%;
}

.wrap-info {
  width: 100%;
}

.wrap-info .wrap-content-item {
  width: 100%;
}
</style>
