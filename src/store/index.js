import {store} from 'quasar/wrappers'
import {createStore} from 'vuex'

import {firebaseDB, firebaseAuth} from 'boot/firebase.js'

import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    state: {
      statusDialogWaste: false,
      invalidEmail: false,
      wrongPassword: false,
      emailAlreadyInUse: false,
      invalidRegEmail: false
    },
    getters: {
      statusDialogWaste: (state) => state.statusDialogWaste,
      invalidEmail: (state) => state.invalidEmail,
      wrongPassword: (state) => state.wrongPassword,
      emailAlreadyInUse: (state) => state.emailAlreadyInUse,
      invalidRegEmail: (state) => state.invalidRegEmail,
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
    },
    actions: {
      registrationUser(cntx, user) {
        cntx.commit('setEmailAlreadyInUse', false)
        cntx.commit('setInvalidRegEmail', false)
        createUserWithEmailAndPassword(firebaseAuth, user.email.value, user.pas.value)
          .then(response => {
            console.log(response)
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
