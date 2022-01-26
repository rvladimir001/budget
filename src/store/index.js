import {store} from 'quasar/wrappers'
import {createStore} from 'vuex'

import {firebaseDB, firebaseAuth} from 'boot/firebase.js'
import {ref, onValue} from "firebase/database";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {
  add, archive,
  edit,
  login,
  pay,
  registration,
  setDeleteStatus, transferToArchive,
  updateBalanceAdd,
  updateBalancePay,
  updateDate
} from "src/api/api";

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    state: {
      statusDialogWaste: false,
      statusDialogCategory: false,
      statusDialogBalance: false,
      delCategory: null,
      invalidEmail: false,
      wrongPassword: false,
      emailAlreadyInUse: false,
      invalidRegEmail: false,
      userID: null,
      userDetails: {},
      outlays: [],
      currentOutlay: {},
      pallets: [
        '#ff0000', '#ff8000', '#ffff00', '#00ff00',
        '#00ffff', '#0080ff', '#0000ff', '#ff00ff',
        '#019A9D', '#D9B801', '#E8045A', '#B2028A',
        '#2A0449', '#019A9D', '#00BFFF', '#BC8F8F',
        '#9ACD32', '#9932CC', '#FF1493', '#778899',
        '#b2b2b2', '#7f7f7f', '#4c4c4c', '#191919'
      ],
      actualPallets: [],
      editCategory: null,
      archiveData: null
    },
    getters: {
      statusDialogWaste: (state) => state.statusDialogWaste,
      statusDialogCategory: (state) => state.statusDialogCategory,
      statusDialogBalance: (state) => state.statusDialogBalance,
      delCategory: (state) => state.delCategory,
      invalidEmail: (state) => state.invalidEmail,
      wrongPassword: (state) => state.wrongPassword,
      emailAlreadyInUse: (state) => state.emailAlreadyInUse,
      invalidRegEmail: (state) => state.invalidRegEmail,
      userID: (state) => state.userID,
      userDetails: (state) => state.userDetails,
      outlays: (state) => state.outlays,
      currentOutlay: (state) => state.currentOutlay,
      pallets: (state) => state.pallets,
      actualPallets: (state) => state.actualPallets,
      editCategory: (state) => state.editCategory,
      archiveData: (state) => state.archiveData,
    },
    mutations: {
      setStatusDialogWaste: (state, status) => {
        state.statusDialogWaste = status;
      },
      setStatusDialogAddCategory: (state, status) => {
        state.statusDialogCategory = status;
      },
      setStatusDialogBalance: (state, status) => {
        state.statusDialogBalance = status;
      },
      setDelCategory: (state, status) => {
        state.delCategory = status;
      },
      setInvalidEmail: (state, status) => {
        state.invalidEmail = status;
      },
      setWrongPassword: (state, status) => {
        state.wrongPassword = status;
      },
      setEmailAlreadyInUse: (state, status) => {
        state.emailAlreadyInUse = status;
      },
      setInvalidRegEmail: (state, status) => {
        state.invalidRegEmail = status;
      },
      setUserID: (state, userID) => {
        state.userID = userID;
      },
      setUserDetails: (state, user) => {
        state.userDetails = user;
      },
      setOutlays: (state, outlays) => {
        state.outlays = outlays;
      },
      setCurrentOutlay: (state, currentOutlay) => {
        state.currentOutlay = currentOutlay;
      },
      setPallets: (state, pallets) => {
        state.pallets = pallets;
      },
      setActualPallets: (state, actualPallets) => {
        state.actualPallets = actualPallets;
      },
      setEditCategory: (state, editCategory) => {
        state.editCategory = editCategory;
      },
      setArchiveData: (state, data) => {
        state.archiveData = data;
      },
    },
    actions: {
      registrationUser(cntx, user) {
        cntx.commit('setEmailAlreadyInUse', false);
        cntx.commit('setInvalidRegEmail', false);
        registration(user)
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              cntx.commit('setEmailAlreadyInUse', true);
            }
            if (error.code === 'auth/invalid-email') {
              cntx.commit('setInvalidRegEmail', true);
            }
          })
      },
      loginUser(cntx, user) {
        cntx.commit('setInvalidEmail', false);
        cntx.commit('setWrongPassword', false);
        login(user)
          .catch(error => {
            if (error.code === 'auth/invalid-email') {
              cntx.commit('setInvalidEmail', true);
            }
            if (error.code === 'auth/wrong-password') {
              cntx.commit('setWrongPassword', true);
            }
          });
      },
      logoutUser() {
        signOut(firebaseAuth).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      },
      handlerAuthStateChange(cntx) {
        onAuthStateChanged(firebaseAuth, (user) => {
          if (user) {
            let userID = user.uid;
            cntx.commit('setUserID', userID);
            const countRef = ref(firebaseDB, `users/${userID}`);
            onValue(countRef, (snapshot) => {
              const userData = snapshot.val();
              transferToArchive(userID, userData)
              cntx.commit('setUserDetails', {
                name: userData.name,
                email: userData.email,
                id: userID
              })
              cntx.commit('setOutlays', userData.outlays)
              const usedColors = Object.keys(userData.outlays.list).map(function (outlay) {
                return userData.outlays.list[outlay].color;
              });
              const actualColors = this.state.pallets.filter(function (color) {
                return !usedColors.includes(color);
              });
              cntx.commit('setActualPallets', actualColors)
            });
            this.$router.push('/home');
          } else {
            cntx.commit('setUserDetails', {});
            this.$router.replace('/login');
          }
        });
      },
      addCategory(cntx, category) {
        const userID = this.getters.userID;
        add(userID, category)
          .then(() => {
            cntx.commit('setStatusDialogAddCategory', false);
          })
      },
      editCategory(cntx, updateCategory) {
        const userID = this.getters.userID;
        return edit(userID, updateCategory)
      },
      delCategory(cntx, key) {
        const userID = this.getters.userID;
        setDeleteStatus(userID, key)
          .then(() => updateDate(userID))
          .then(() => {
            cntx.commit('setStatusDialogWaste', false);
          })
      },
      addOutlay(cntx, newOutlay) {
        const oldValue = Number(newOutlay.currentOutlay.value.outlay.outlay);
        const userID = this.getters.userID;
        const oldBalance = this.getters.outlays.balance
        const newOutlayValue = Number(newOutlay.value.value)
        pay(userID, oldValue, newOutlayValue, newOutlay).then(() => updateBalancePay(userID, oldBalance, newOutlayValue))
          .then(() => updateDate(userID))
          .then(() => {
            cntx.commit('setStatusDialogWaste', false);
          })
      },
      addBalance(cntx, newMany) {
        const userID = this.getters.userID;
        const oldBalance = this.getters.outlays.balance;
        return updateBalanceAdd(userID, oldBalance, newMany)
      },
      getArchive(cntx) {
        const userID = this.getters.userID;
        const actualOutlays = this.getters.outlays;
        const arch = archive(userID, actualOutlays)
        cntx.commit('setArchiveData', arch);
      }
    },
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
