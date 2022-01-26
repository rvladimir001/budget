import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {firebaseAuth, firebaseDB} from "boot/firebase";
import {onValue, push, ref, remove, set, update} from "firebase/database";
import {defaultListCategory, months} from "./utils"

export function registration(user) {
  const today = new Date();
  return createUserWithEmailAndPassword(firebaseAuth, user.email.value, user.pas.value)
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
          list: defaultListCategory
        }
      });
    })
}

export function login(user) {
  return signInWithEmailAndPassword(firebaseAuth, user.email.value, user.pas.value)
}

export function add(userID, category) {
  const outlayListRef = ref(firebaseDB, `users/${userID}/outlays/list`);
  const newOutlayRef = push(outlayListRef);
  return set(newOutlayRef, {
    name: category.category,
    color: category.color,
    deleted: false,
    outlay: 0
  })
}

export function edit(userID, updateCategory) {
  const outlayDateRef = ref(firebaseDB, `users/${userID}/outlays//list/${updateCategory.key}`);
  return update(outlayDateRef, {
    name: updateCategory.category,
    color: updateCategory.color
  })
}

export function setDeleteStatus(userID, key) {
  const outlayListRef = ref(firebaseDB, `users/${userID}/outlays/list/${key}`);
  return update(outlayListRef, {
    deleted: true
  })
}

export function updateDate(userID) {
  const todayUpdate = new Date();
  const outlayDateRef = ref(firebaseDB, `users/${userID}/outlays/`);
  return update(outlayDateRef, {
    update: String(todayUpdate)
  })
}

export function updateBalancePay(userID, oldBalance, newOutlayValue) {
  const outlayDateRef = ref(firebaseDB, `users/${userID}/outlays/`);
  return update(outlayDateRef, {
    balance: Number(oldBalance) - newOutlayValue,
  })
}

export function pay(userID, oldValue, newOutlayValue, newOutlay) {
  const outlayListRef = ref(firebaseDB, `users/${userID}/outlays/list/${newOutlay.currentOutlay.value.key}`);
  return update(outlayListRef, {
    outlay: oldValue + newOutlayValue
  })
}

export function updateBalanceAdd(userID, oldBalance, newMany) {
  const outlayDateRef = ref(firebaseDB, `users/${userID}/outlays/`);
  return update(outlayDateRef, {
    balance: Number(oldBalance) + Number(newMany),
    countBalance: Number(oldBalance) + Number(newMany)
  })
}

export function archive(userID, actualOutlays) {
  const countRef = ref(firebaseDB, `users/${userID}`);
  let yearsData = {}
  onValue(countRef, (snapshot) => {
    const userData = snapshot.val();
    const archive = Object.values(userData.archive)
    for (let elem in archive) {
      const currentDate = new Date(archive[elem].update);
      const outlaysList = Object.values(archive[elem].list);
      archiveDataAdapter(yearsData, months, currentDate, outlaysList)
    }
    const actualDate = new Date(actualOutlays.update)
    archiveDataAdapter(yearsData, months, actualDate, actualOutlays.list)
  })
  return yearsData
}

function archiveDataAdapter(yearsData, months, actualDate, actualOutlays) {
  const actualYear = String(actualDate.getFullYear())
  const actualMonth = months[actualDate.getMonth()];
  let actualOutlayResult = 0;
  for (let category in actualOutlays) {
    actualOutlayResult += actualOutlays[category].outlay
  }
  if (Object.keys(yearsData).includes(actualYear)) {
    yearsData[actualYear]['label'].push(actualMonth)
    yearsData[actualYear]['data'].push(actualOutlayResult)
  } else {
    yearsData[actualYear] = {};
    yearsData[actualYear]['label'] = [actualMonth];
    yearsData[actualYear]['data'] = [actualOutlayResult];
  }
}

export function transferToArchive(userID, userData) {
  const nowDate = new Date()
  const actualYear = nowDate.getFullYear();
  const actualMonth = nowDate.getMonth();
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
}
