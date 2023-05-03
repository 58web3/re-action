import { Store } from "vuex";
import mitt from "mitt";
import Swal from "sweetalert2/dist/sweetalert2.js";
declare type TVueSwalInstance = typeof Swal & typeof Swal.fire;

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    count: number;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
    emitter: mitt;
    $swal: TVueSwalInstance;
  }
}
