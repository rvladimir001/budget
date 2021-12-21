import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import { firebaseDB, firebaseAuth } from 'boot/firebase.js'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    state: {
      statusDialogWaste: false,
    },
    getters: {
      statusDialogWaste: (state) => state.statusDialogWaste
    },
    mutations: {
      setStatusDialogWaste: (state, status) => {state.statusDialogWaste = status}
    },
    actions: {
      registrationUser(cntx, user) {
        createUserWithEmailAndPassword(firebaseAuth, user.email.value, user.pas.value)
          .then( response => {
            console.log(response)
          })
          .catch(error => {
            console.error(error)
          })
      },
      loginUser(cntx, user) {
        signInWithEmailAndPassword(firebaseAuth, user.email.value, user.pas.value)
          .then( response => {
            console.log(response)
          })
          .catch(error => {
            console.error(error)
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
