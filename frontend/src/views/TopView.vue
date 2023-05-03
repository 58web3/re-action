<template>
  <div class="main-layout">
    <div class="head-mag">
      <img src="@/assets/img/desc-back.png" class="desk w-100" alt="" />
      <img src="@/assets/img/back-mob.png" class="mob w-100" alt="" />
      <div class="web3-info">
        <div>{{ $t("web3_and_the") }}</div>
        <div>{{ $t("future_of") }}</div>
        <div>{{ $t("social_good") }}</div>
      </div>
    </div>
    <div class="sub-container">
      <div class="description">
        {{ $t("description_top_view") }}
      </div>
      <div class="d-flex justify-content-around mt-5 routes">
        <div class="grad-btn" @click="goCodeCheckView">
          {{ $t("receive-nft") }}
        </div>
        <div class="link" @click="goToSignIn">
          {{ $t("already_sign_up") }}
          <span class="underline">{{ $t("login") }}</span>
        </div>
      </div>
      <div class="link faq underline">
        <a href="https://revisionartproject.com/articles/642f9b8fd511e51b13679591" target="_blank">{{
        $t("faq_nft")
      }}</a>
      </div>

      <div class="d-flex justify-content-center web3">
        <img src="@/assets/img/web3.png" alt="" />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.head-mag {
  .mob {
    display: none;
  }

  .desk {
    display: block;
  }

  @media all and (max-width: 750px) {
    .desk {
      display: none;
    }
    .mob {
      display: block;
    }
  }
}

.main-layout {
  max-width: 100vw !important;
  margin: 0 !important;
  padding-top: 125px;
  padding-bottom: 100px;
  background-image: url("@/assets/img/new-bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  @media all and (max-width: 750px) {
    padding-top: 80px;
    background-image: url("@/assets/img/new-bg-mob.png");
  }
  .web3-info {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 35vw;
    left: 10vw;

    div {
      width: fit-content;
      padding: 0 10px;
      margin-top: 20px;
      text-align: left;
      background: $black;
      font-family: "DotGothic16";
      font-style: normal;
      font-weight: 400;
      font-size: 53px;
      line-height: 77px;
      color: $white;

      @media all and (max-width: 850px) {
        font-size: 38px;
        margin-top: 5px;
        line-height: 55px;
      }
    }

    @media all and (max-width: 850px) {
      top: 28vh;
    }

    @media all and (max-width: 750px) {
      font-size: 20px;
      top: 59vh !important;
      left: 25px;
    }

    @media all and (max-width: 320px) {
      font-size: 20px;
      top: 42vh !important;
      left: 25px;
    }
  }
  .sub-container {
    display: flex;
    flex-direction: column;
    margin-left: 10vw;
    margin-right: 10vw;

    .description {
      text-align: left;
      width: 50vw;
      @media all and (max-width: 750px) {
        font-size: 20px;
        width: 100%;
        margin-top: -35px;
      }
    }
    .routes {
      align-items: center;
      @media all and (max-width: 750px) {
        flex-direction: column;
      }
    }
    .grad-btn {
      cursor: pointer;
      width: 500px;
      padding: 15px 70px;
      border-radius: 62px;
      color: $white;
      font-size: 32px;
      background: linear-gradient(268.27deg, #FF6422 3.12%, #B55BFD 46.69%, #4E4BF5 97.1%);
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 100px;

      @media all and (max-width: 750px) {
        width: auto;
        font-size: 24px;
        padding: 15px 50px;
        text-align: center;
      }
    }

    .link {
      cursor: pointer;
      color: $black;
      font-size: 25px;
      @media all and (max-width: 750px) {
        margin-top: 20px;
        font-size: 18px;
      }
    }
    .faq {
      margin-top: 28px;
      font-size: 16px;
      color: blue;
    }

    .underline {
      text-decoration: underline;
    }

    .web3 {
      margin-top: 60px;
      @media all and (max-width: 750px) {
        img {
          width: 80vw;
        }
      }
    }
  }
}
.top {
  &-title {
    font-weight: bold !important;
    color: $black;
  }

  &-img {
    width: 40%;
  }

  &-btn {
    cursor: pointer;
    width: 308px;
    padding: 15px 10px;
    background-color: $black;
    font-weight: bold;
    color: $white;
    border: 2px solid $white;
    border-radius: 8px !important;
  }

  &-btn:disabled {
    opacity: 0.5;
  }
}

@media all and (max-width: 480px) {
  .top {
    &-img {
      width: 80%;
    }

    &-btn {
      width: 100%;
    }
  }
}

.description {
  font-size: 22px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TopView",
  data() {
    return {};
  },
  methods: {
    goCodeCheckView() {
      this.$router.push("code-verification");
    },
    goToSignIn() {
      this.$router.push("sign-in");
    },
  },
});
</script>
