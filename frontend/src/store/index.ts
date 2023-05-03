// store.ts
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import createPersistedState from "vuex-persistedstate";
import user from "./user";

import nft from "./nft";

import lang from "./modules/lang";
// define your typings for the store state
export interface State {
  count: number;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export default createStore({
  modules: {
    user,
    nft,
    lang,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
