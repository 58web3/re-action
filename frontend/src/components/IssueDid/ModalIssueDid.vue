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
            @click="signIn"
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
            @click="signIn"
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
      console.log("asdkalsjdkals");
      if (this.firstName === "") {
        this.validationErrorFirstName = "First name is required";
      } else if (this.lastName === "") {
        this.validationErrorLastName = "Last name is required";
      } else if (!this.emailRegex().test(this.email)) {
        this.validationErrorEmail = "Incorrect email format";
      } else {
        this.step = 2;
      }
    },
    requestDID() {
      this.step = 3;
      setTimeout(() => {
        this.$emit("close");
        this.$swal({
          title: this.$t("issue_did"),
          text: this.$t("did_issue"),
          position: "center",
          icon: "success",
        });
      }, 5000);
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
</style>
