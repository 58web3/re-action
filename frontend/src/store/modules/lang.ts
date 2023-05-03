interface IStateLanguage {
  lang: string;
}

export default {
  namespaced: true,
  state: {
    lang: sessionStorage.lang,
  } as IStateLanguage,
  actions: {},
  mutations: {
    SET_LANG(state: IStateLanguage, lang: string) {
      state.lang = lang;
    },
  },
};
