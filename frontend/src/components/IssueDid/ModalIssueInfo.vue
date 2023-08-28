<template>
  <div class="wrap-info">
    <p>Are those information correct ?</p>
    <div class="d-flex flex-column wrap-content-item">
      <div class="row">
        <div
          class="col-lg-5 col-md-6 col-5 d-flex justify-content-lg-start justify-content-md-start"
        >
          First Name
        </div>
        <div
          class="col-lg-7 col-md-6 col-7 d-flex justify-content-lg-start justify-content-md-start"
        >
          <p class="item-content">{{ firstName }}</p>
        </div>
      </div>
      <div class="row">
        <div
          class="col-lg-5 col-md-6 col-5 d-flex justify-content-lg-start justify-content-md-start"
        >
          Last Name
        </div>
        <div
          class="col-lg-7 col-md-6 col-7 d-flex justify-content-lg-start justify-content-md-start"
        >
          <p class="item-content">{{ lastName }}</p>
        </div>
      </div>
      <div class="row">
        <div
          class="col-lg-5 col-md-6 col-5 d-flex justify-content-lg-start justify-content-md-start"
        >
          Email
        </div>
        <div
          class="col-lg-7 col-md-6 col-7 d-flex justify-content-lg-start justify-content-md-start"
        >
          <p class="item-content">{{ email }}</p>
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
  @media all and (max-width: 750px) {
    width: auto !important;
  }
}
.wrap-content-item {
  width: 65%;
  margin: 0 auto;
  @media all and (max-width: 750px) {
    width: 100%;
  }
}
.item-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
