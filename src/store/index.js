import {store} from 'quasar/wrappers'
import {createStore} from 'vuex'

import {firebaseDB, firebaseAuth} from 'boot/firebase.js'
import {ref, set, onValue} from "firebase/database";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    state: {
      statusDialogWaste: false,
      invalidEmail: false,
      wrongPassword: false,
      emailAlreadyInUse: false,
      invalidRegEmail: false,
      userDetails: {},
    },
    getters: {
      statusDialogWaste: (state) => state.statusDialogWaste,
      invalidEmail: (state) => state.invalidEmail,
      wrongPassword: (state) => state.wrongPassword,
      emailAlreadyInUse: (state) => state.emailAlreadyInUse,
      invalidRegEmail: (state) => state.invalidRegEmail,
      userDetails: (state) => state.userDetails,
    },
    mutations: {
      setStatusDialogWaste: (state, status) => {
        state.statusDialogWaste = status
      },
      setInvalidEmail: (state, status) => {
        state.invalidEmail = status
      },
      setWrongPassword: (state, status) => {
        state.wrongPassword = status
      },
      setEmailAlreadyInUse: (state, status) => {
        state.emailAlreadyInUse = status
      },
      setInvalidRegEmail: (state, status) => {
        state.invalidRegEmail = status
      },
      setUserDetails: (state, status) => {
        state.userDetails = status
      },
    },
    actions: {
      registrationUser(cntx, user) {
        cntx.commit('setEmailAlreadyInUse', false)
        cntx.commit('setInvalidRegEmail', false)
        createUserWithEmailAndPassword(firebaseAuth, user.email.value, user.pas.value)
          .then(response => {
            let userID = response.user.uid
            set(ref(firebaseDB, 'users/' + userID), {
              name: user.name.value,
              email: user.email.value
            });
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              cntx.commit('setEmailAlreadyInUse', true)
            }
            if (error.code === 'auth/invalid-email') {
              cntx.commit('setInvalidRegEmail', true)
            }
            console.error("error", error)
            console.error("error.code", error.code)
          })
      },
      loginUser(cntx, user) {
        cntx.commit('setInvalidEmail', false)
        cntx.commit('setWrongPassword', false)
        signInWithEmailAndPassword(firebaseAuth, user.email.value, user.pas.value)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            if (error.code === 'auth/invalid-email') {
              cntx.commit('setInvalidEmail', true)
            }
            if (error.code === 'auth/wrong-password') {
              cntx.commit('setWrongPassword', true)
            }
          })
      },
      handlerAuthStateChange(cntx) {
        onAuthStateChanged(firebaseAuth, (user) => {
          if (user) {
            let userID = user.uid;
            const countRef = ref(firebaseDB, 'users/' + userID);
            onValue(countRef, (snapshot) => {
              const userData = snapshot.val();
              cntx.commit('setUserDetails', {
                name: userData.name,
                email: userData.email,
                id: userID
              })
            });
          } else {
            cntx.commit('setUserDetails', {})
          }
        });

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
