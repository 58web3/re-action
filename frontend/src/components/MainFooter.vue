<template>
  <div id="main-footer">
    <div class="container_inner d-flex flex-column align-items-flex-start">
      <a href="https://revisionartproject.com/" target="_blank">{{
        $t("donation_site")
      }}</a>
      <a href="https://revisionartproject.com/terms" target="_blank">{{
        $t("terms")
      }}</a>
      <a href="https://revisionartproject.com/privacy" target="_blank">{{
        $t("privacy")
      }}</a>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdzrCEliuSeMPJfZaI3XCAiPfLgnfJH3C8ZUQvNoxB6zlzoOg/viewform?usp=sf_link"
        target="_blank"
        >{{ $t("contact") }}</a
      >
      <a href="https://revisionartproject.com/law" target="_blank">{{
        $t("individual")
      }}</a>

      <a href="https://revisionartproject.com/articles/642f9b8fd511e51b13679591" target="_blank">{{
        $t("about_nft")
      }}</a>
    </div>
    <p id="copyright">©︎2023 SEAMES</p>
  </div>
</template>

<style scoped lang="scss">
#main-footer {
  padding: 32px;
  background-color: $black;
}
#main-footer a {
  color: $white;
  text-align: left;
}
#copyright {
  color: $white;
  font-size: 16px;
  margin-top: 48px;
}
.flex-column {
  flex-direction: column !important;
  gap: 12px;
}
.align-items-flex-start {
  align-items: flex-start;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainFooter",
});
</script>
