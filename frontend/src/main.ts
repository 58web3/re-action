import Vue, { createApp } from "vue";
import App from "./App.vue";
import BootstrapVue3 from 'bootstrap-vue-3'

import router from "./router";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import i18n from "./i18n";
import store from "./store";
import Web3AuthPlugin from "@/plugins/web3auth";
import AxiosPlugin from '@/plugins/cacheAxios';
import MasonryWall from '@yeger/vue-masonry-wall'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import mitt from "mitt";
const emitter = mitt();

const app = createApp(App).use(i18n).use(router).use(store).use(VueSweetalert2).use(Web3AuthPlugin).use(AxiosPlugin).use(MasonryWall).use(BootstrapVue3);
app.provide("MAX_POST_CHARACTERS", 400);
app.config.globalProperties.emitter = emitter;
app.mount("#app");
