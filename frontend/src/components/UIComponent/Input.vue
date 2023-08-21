<template>
  <div>
    <input
      :placeholder="placeholder"
      :type="type"
      aria-autocomplete="none"
      autocomplete="off"
      :value="modelValue"
      @input="updateValue"
      :maxlength="maxLength"
    />
    <div v-if="validationError">{{ validationError }}</div>
  </div>
</template>

<script>
export default {
  name: "Input",
  props: {
    placeholder: {
      type: String,
      default: "Input text",
    },
    type: {
      type: String,
      default: "text",
    },
    modelValue: {
      type: String,
      default: "",
    },
    regex: {
      type: RegExp,
      default: () => /.*/,
    },
    validationErrorMessage: {
      type: String,
      default: "error message",
    },
    maxLength: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      validationError: "",
    };
  },
  methods: {
    updateValue(event) {
      const newValue = event.target.value;
      if (this.regex.test(newValue)) {
        this.validationError = "";
      } else {
        this.validationError = this.validationErrorMessage;
      }
      this.$emit("update:modelValue", newValue);
    },
  },
};
</script>

<style scoped lang="scss">
input {
  width: 420px;
  height: 48px;
  padding: 15px 0;
  border: none;
  border-bottom: 1px solid #333;
  // color: $green;
  border-radius: 0px;
  font-variation-settings: "wdth" 125;
  @media all and (max-width: 750px) {
    width: 280px;
  }

  background: none;
  outline: none;
  &::placeholder {
    font-family: "Archivo";
    font-variation-settings: "wdth" 125;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    // color: $green;
    text-align: left;
  }
}
</style>
