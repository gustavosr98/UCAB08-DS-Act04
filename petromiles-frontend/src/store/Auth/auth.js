import httpClient from "@/http/http-client";
import authConstants from "@/constants/authConstants";

export const namespaced = true;
export const state = {
  user: null,
};

export const mutations = {
  setUserLocalStorage(state, userData) {
    state.user = {
      email: userData.email,
      details: userData.userDetails,
      role: userData.role,
      authToken: userData.token,
      federated: userData.federated,
    };

    localStorage.setItem(
      authConstants.USER_LOCAL_STORAGE,
      JSON.stringify(state.user)
    );
  },
  changeLang(state, language) {
    state.user.details.language = language;

    localStorage.setItem(
      authConstants.USER_LOCAL_STORAGE,
      JSON.stringify(state.user)
    );
  },
  updateProfileImage(state, imageURL){
    state.user.details.photo = imageURL;

    localStorage.setItem(
      authConstants.USER_LOCAL_STORAGE,
      JSON.stringify(state.user)
    );
  },
  updateUserData(state, userData){
    state.user.details = userData;

    localStorage.setItem(
      authConstants.USER_LOCAL_STORAGE,
      JSON.stringify(state.user)
    );
  },
  loadUserToken(state) {
    const user = JSON.parse(
      localStorage.getItem(authConstants.USER_LOCAL_STORAGE)
    );

    if (user && user.authToken) {
      console.log(`${user.email} is inside his sesion as ${user.role}`);
      state.user = user;
      httpClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.authToken}`;
    }

    state.user = {
      ...user,
    };
  },

  logout() {
    localStorage.removeItem(authConstants.USER_LOCAL_STORAGE);
    location.reload();
  },
};

export const actions = {
  async signUp({ commit }, credentials) {
    httpClient.post("/auth/signup", credentials).then(data => {
      commit("setUserLocalStorage", data);
      commit("loadUserToken");
      location.reload();
    });
  },
  async logIn({ commit }, credentials) {
    httpClient.post("/auth/login", credentials).then(data => {
      commit("setUserLocalStorage", data);
      commit("loadUserToken");
      location.reload();
    });
  },
  logout({ commit }) {
    commit("logout");
  },
  async checkUserToken({ commit }) {
    commit("loadUserToken");

    httpClient.get("/auth/checkToken", { errorHandle: false }).catch(e => {
      commit("logout");
    });
  },
  async changeLang({ commit }, language) {
    await httpClient.patch("user/language", { language: language.bdName });
    commit("changeLang", language);
  },
  async updateProfileImage({ commit }, imageURL){
    await httpClient.put("user/update-details", { photo : imageURL });
    commit("updateProfileImage", imageURL);
  },
  async changePassword({ commit }, passwords){
    await httpClient.put("user/update-password", {
      currentPassword: passwords.currentPassword,
      password: passwords.newPassword
    });    
  },
  async updateUserData({ commit }, userData){
    const data = JSON.parse(JSON.stringify(userData));
    if(data.birthdate !== null){
      data.birthdate = data.birthdate.replace("-", "/").replace("-", "/");
    }    
    await httpClient.put("user/update-details", data);
    commit("updateUserData", userData);
  }
};

export const getters = {
  loggedIn(state) {
    return !!state.user;
  },

  getUser(state) {
    return state.user;
  },
};
