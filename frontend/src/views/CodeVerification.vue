<template>
  <div class="auth-container">
    <span class="main-title">{{ $t("verify_code") }}</span>
    <div class="self-card">
      <div class="d-flex justify-content-center digits-input-wrapper">
        <input class="input-uuid" :placeholder="$t('enter_verification_code')" v-model="code" />
      </div>
      <VButton :text="$t('verify')" @click="verify" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { API_ENDPOINT } from "@/constants/api";
import VButton from "@/components/Button.vue";

export default defineComponent({
  name: "CodeVerificationView",
  components: {
    VButton,
  },
  data() {
    return {
      digits: [0, 1, 2, 3, 4, 5],
      isCodeValid: true,
      code: [],
      emailAddr: "",
      dataFromPaste: [],
      keysAllowed: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      unavailableResend: false,
      interval: null,
    };
  },
  async mounted() {
    await (this as any).$w3a.logout();
  },
  unmounted() {
    clearInterval((this as any).interval);
  },
  methods: {
    resendCodeTimer() {
      clearInterval((this as any).interval);
      const min = 1; // set minutes
      let sec = min * 60;
      (this as any).interval = setInterval(() => {
        sec -= 1;
        if (sec === 0) {
          this.unavailableResend = false;
          clearInterval((this as any).interval);
        } else {
          this.unavailableResend = true;
        }
      }, 1000);
    },
    resendCode() {
      if (!this.unavailableResend) {
        axios
          .post(API_ENDPOINT + "/v1/verification-code", {
            lang: "en",
          })
          .then(() => {
            this.$swal({
              title: (this as any).$t("verification_code_sent"),
              position: "center",
              icon: "success",
              timer: 2500,
            });
            this.resendCodeTimer();
          });
      }
    },
    verify() {
      const regex = new RegExp(
        "^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$"
      );
      if (regex.test((this as any).code)) {
        axios
          .put(API_ENDPOINT + "/v1/verification-code/verify", {
            verification_code: this.code,
          })
          .then(async () => {
            await this.$swal({
              title: (this as any).$t("valid_verification_code"),
              text: (this as any).$t("valid_verification_code_body"),
              position: "center",
              icon: "success",
              timer: 2500,
            });
            sessionStorage.setItem("verification_code", (this as any).code);
            await this.$router.push("sign-in");
          })
          .catch((e: any) => {
            if (e.response.status === 404) {
              this.$swal({
                title: (this as any).$t("invalid_verification_code"),
                text: (this as any).$t("enter_valid_code"),
                position: "center",
                icon: "error",
                timer: 2500,
              });
            }
            if (e.response.status === 400) {
              this.$swal({
                title: (this as any).$t("already_used_title"),
                text: (this as any).$t("already_used_body"),
                position: "center",
                icon: "error",
                timer: 2500,
              }).then(()=> {
                this.$router.push("sign-in");
              });
            }
          });
      } else {
        this.$swal({
          title: (this as any).$t("invalid_verification_code"),
          position: "center",
          icon: "error",
          timer: 2500,
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.link {
  text-decoration: underline;
  margin-bottom: 22px;
}

.border-vertical {
  position: absolute;
  width: 0;
  height: 40px;
  left: 50vw;
  top: 195px;
  z-index: 1;
  border: 1px solid $black;
}
</style>
