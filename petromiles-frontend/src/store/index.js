import Vue from "vue";
import Vuex from "vuex";
import * as auth from "@/store/modules/auth";
import * as bankAccount from "@/store/modules/bankAccount";
import * as errors from "@/store/modules/errors";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    bankAccount,
    errors,
  },
});