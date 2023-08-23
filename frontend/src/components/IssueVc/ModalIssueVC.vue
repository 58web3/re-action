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
            v-model="MySelectedValues"
          />
          <Checkbox
            label="Wallet Address"
            value="wallet"
            v-model="MySelectedValues"
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
    };
  },
  methods: {
    onCancel() {
      this.$emit("close");
      this.step = 1;
    },
    confirmInfo() {
      this.step = 2;
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
