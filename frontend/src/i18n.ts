import { createI18n } from "vue-i18n";

let locale = "en",
  message: any = {};
const language = window.navigator.language;
if (language.startsWith("ja")) {
  const lang = language.toLowerCase().split("-");
  locale = lang[0];
}
sessionStorage.setItem("lang", locale);

message[locale] = require(`./assets/i18n/${locale}.json`);

const i18n = createI18n({
  legacy: false,
  locale: locale,
  globalInjection: true,
  globalInstall: true,
  messages: message,
});

export default i18n;
