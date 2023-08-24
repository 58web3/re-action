<template>
  <div class="wrap-list-item d-flex flex-column">
    <div class="d-flex flex justify-content-between list-item align-self-cente">
      <p>Take Photo or Video</p>
      <div class="wrap-image">
        <img src="@/assets/img/camera.png" />
      </div>
    </div>
    <div class="d-flex justify-content-between list-item align-items-center">
      <div class="upload-btn-wrapper">
        <div class="input-group-append">
          <p class="input-group-text" id="basic-addon2">Photo Library</p>
        </div>
        <input @change="onFileChange" type="file" name="image" />
      </div>
      <div class="wrap-image">
        <img src="@/assets/img/folder.png" />
      </div>
    </div>
  </div>
  <button class="m-auto mt-3 button">Cancel</button>
</template>
<script>
import Vue from "vue";
import VButton from "@/components/Button.vue";

export default {
  name: "ListOptionSelectFile",
  components: {
    VButton,
  },
  methods: {
    onFileChange(e) {
      console.log(e);
      var files = e.target.files || e.dataTransfer.files;
      this.$emit("onFile", files);
    },
  },
};
</script>
<style>
.wrap-list-item {
  padding: 1rem;
  border-radius: 10px;
  background: #fff;
}
.list-item {
  cursor: pointer;
  border-bottom: 0.5px solid rgb(224, 224, 224);
}
.wrap-image {
}
.button {
  width: 100%;
  background: #fff;
  border: none;
  padding: 0.5rem;
  border-radius: 10px;
}
input[type="file"] {
  background-color: #f00;
}

button {
}
.input-group-text {
  padding-left: 0px !important;
  cursor: pointer;
  background: #fff !important;
  padding-top: 13px !important;
  border: none !important;
}
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.btn {
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.upload-btn-wrapper input[type="file"] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
