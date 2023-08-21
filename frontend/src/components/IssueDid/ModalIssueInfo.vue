<template>
  <div class="wrap-info">
    <p>Are those information correct ?</p>
    <div class="d-flex flex-column">
      <div class="row">
        <div class="col-lg-6 d-flex justify-content-end">First Name</div>
        <div class="col-lg-6 d-flex justify-content-start">{{ firstName }}</div>
      </div>
      <div class="row">
        <div class="col-lg-6 d-flex justify-content-end">Last Name</div>
        <div class="col-lg-6 d-flex justify-content-start">{{ lastName }}</div>
      </div>
      <div class="row">
        <div class="col-lg-6 d-flex justify-content-end">Email</div>
        <div class="col-lg-6 d-flex justify-content-start">
          {{ email }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ErrorMessage from "@/components/UIComponent/ErrorMessage";
import { emailRegex } from "@/utils/validations";

export default {
  name: "ModalIssueInfo",
  components: {},
  props: {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
};
</script>
<style>
.wrap-info {
  width: 420px;
}
</style>
