import {store} from 'quasar/wrappers'
import {createStore} from 'vuex'

import {firebaseDB, firebaseAuth} from 'boot/firebase.js'
import {ref, set, onValue, update, push, remove} from "firebase/database";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";

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
        const today = new Date();
        createUserWithEmailAndPassword(firebaseAuth, user.email.value, user.pas.value)
          .then(response => {
            let userID = response.user.uid;
            set(ref(firebaseDB, `users/${userID}`), {
              name: user.name.value,
              email: user.email.value,
              calculation: 1,
              creation: String(today),
              archive: false,
              outlays: {
                update: String(today),
                creation: String(today),
                balance: 0,
                countBalance: 0,
                list: [
                  {
                    name: "Продукты",
                    outlay: 0,
                    color: '#ff0000',
                    deleted: false
                  },
                  {
                    name: "Транспорт",
                    outlay: 0,
                    color: '#ff8000',
                    deleted: false
                  },
                  {
                    name: "Развлечения",
                    outlay: 0,
                    color: '#ffff00',
                    deleted: false
                  },
                  {
                    name: "Услуги",
                    outlay: 0,
                    color: '#00ff00',
                    deleted: false
                  }
                ]
              }
            });
          })
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
        signInWithEmailAndPassword(firebaseAuth, user.email.value, user.pas.value)
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
              const actualYear = new Date().getFullYear();
              const actualMonth = new Date().getMonth();
              const creationYear = new Date(userData.outlays.creation).getFullYear();
              const creationMonth = new Date(userData.outlays.creation).getMonth();
              if (actualYear > creationYear || (actualYear === creationYear && actualMonth > creationMonth)) {
                const outlayArchiveRef = ref(firebaseDB, `users/${userID}/archive/${userData.outlays.creation}`);
                update(outlayArchiveRef, Object.assign({}, userData.outlays))
                const outlayDateRef = ref(firebaseDB, `users/${userID}/outlays/`);
                update(outlayDateRef, {
                  creation: String(new Date()),
                  countBalance: 0
                })
                for (let key in userData.outlays.list) {
                  const outlayListRef = ref(firebaseDB, `users/${userID}/outlays/list/${key}`);
                  if (userData.outlays.list[key].deleted) {
                    remove(outlayListRef);
                  } else {
                    update(outlayListRef, {
                      outlay: 0
                    });
                  }
                }
              }
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
        const outlayListRef = ref(firebaseDB, `users/${userID}/outlays/list`);
        const newOutlayRef = push(outlayListRef);
        set(newOutlayRef, {
          name: category.category,
          color: category.color,
          deleted: false,
          outlay: 0
        }).then(() => {
          cntx.commit('setStatusDialogAddCategory', false);
        })
      },
      editCategory(cntx, updateCategory) {
        const userID = this.getters.userID;
        const outlayDateRef = ref(firebaseDB, `users/${userID}/outlays//list/${updateCategory.currentCategory}`);
        update(outlayDateRef, {
          name: updateCategory.category,
          color: updateCategory.color
        })
      },
      delCategory(cntx, key) {
        const userID = this.getters.userID;
        const todayUpdate = new Date();
        const outlayListRef = ref(firebaseDB, `users/${userID}/outlays/list/${key}`);
        update(outlayListRef, {
          deleted: true
        }).then(() => {
          const outlayDateRef = ref(firebaseDB, `users/${userID}/outlays/`);
          update(outlayDateRef, {
            update: String(todayUpdate)
          })
        }).then(() => {
          cntx.commit('setStatusDialogWaste', false);
        })
      },
      addOutlay(cntx, newOutlay) {
        const oldValue = Number(newOutlay.currentOutlay.value.outlay.outlay);
        const userID = this.getters.userID;
        const todayUpdate = new Date();
        const outlayListRef = ref(firebaseDB, `users/${userID}/outlays/list/${newOutlay.currentOutlay.value.key}`);
        update(outlayListRef, {
          outlay: oldValue + Number(newOutlay.value.value)
        }).then(() => {
          const oldBalance = this.getters.outlays.balance
          const outlayDateRef = ref(firebaseDB, `users/${userID}/outlays/`);
          update(outlayDateRef, {
            balance: Number(oldBalance) - Number(newOutlay.value.value),
          })
        }).then(() => {
          const outlayDateRef = ref(firebaseDB, `users/${userID}/outlays/`);
          update(outlayDateRef, {
            update: String(todayUpdate)
          })
        }).then(() => {
          cntx.commit('setStatusDialogWaste', false);
        })
      },
      addBalance(cntx, newMany) {
        const userID = this.getters.userID;
        const oldBalance = this.getters.outlays.balance;
        const outlayDateRef = ref(firebaseDB, `users/${userID}/outlays/`);
        update(outlayDateRef, {
          balance: Number(oldBalance) + Number(newMany),
          countBalance: Number(oldBalance) + Number(newMany)
        })
      },
      getArchive(cntx) {
        const userID = this.getters.userID;
        const countRef = ref(firebaseDB, `users/${userID}`);
        const months = {
          0: "Январь",
          1: "Февраль",
          2: "Март",
          3: "Апрель",
          4: "Мая",
          5: "Июнь",
          6: "Июль",
          7: "Август",
          8: "Сентябрь",
          9: "Октябрь",
          10: "Нояборь",
          11: "Декабрь"
        }
        let yearsData = {}
        onValue(countRef, (snapshot) => {
          const userData = snapshot.val();
          const archive = Object.values(userData.archive)
          for(let elem in archive) {
            const currentDate = new Date(archive[elem].update);
            let year = String(currentDate.getFullYear());
            let month = months[currentDate.getMonth()];
            const outlaysList = Object.values(archive[elem].list);
            let outlayResult = 0;
            for(let category in outlaysList) {
              outlayResult+=outlaysList[category].outlay
            }
            if(Object.keys(yearsData).includes(year)) {
              yearsData[year]['label'].push(month)
              yearsData[year]['data'].push(outlayResult)
            } else {
              yearsData[year] = {};
              yearsData[year]['label'] = [month];
              yearsData[year]['data'] = [outlayResult];
            }
          }
          const actualOutlays = this.getters.outlays;
          const actualDate = new Date(actualOutlays.update)
          const actualYear = String(actualDate.getFullYear())
          const actualMonth = months[actualDate.getMonth()];
          let actualOutlayResult = 0;
            for(let category in actualOutlays.list) {
              actualOutlayResult+=actualOutlays.list[category].outlay
            }
          if(Object.keys(yearsData).includes(actualYear)) {
              yearsData[actualYear]['label'].push(actualMonth)
              yearsData[actualYear]['data'].push(actualOutlayResult)
            } else {
              yearsData[actualYear] = {};
              yearsData[actualYear]['label'] = [actualMonth];
              yearsData[actualYear]['data'] = [actualOutlayResult];
            }
        })
        cntx.commit('setArchiveData', yearsData);
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
