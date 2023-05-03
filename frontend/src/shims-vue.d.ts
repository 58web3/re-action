import { ComponentCustomProperties } from "vue";

/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module "mitt" {
  const dumb: any;
  export default dumb;
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: Function,
  }
}