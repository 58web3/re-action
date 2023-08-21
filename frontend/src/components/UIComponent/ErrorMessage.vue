<template>
  <div v-if="message" class="error-message">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "ErrorMessage",
  props: {
    message: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.error-message {
  text-align: left;
  font-size: 0.7rem;
  color: rgb(249, 176, 177);
}
</style>
