<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-card>
        <q-tabs
          v-model="tab"
          class="bg-teal text-white"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Login"/>
          <q-tab name="registration" label="Registration"/>
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="tab" animated class="bg-teal-1 text-center">
          <q-tab-panel name="login">
            <div class="q-pa-md">
              <div class="q-gutter-y-md column" style="max-width: 300px">
                <q-input standout="bg-teal text-white" v-model="loginEmail" label="Почта" :dense="dense"/>
                <q-input standout="bg-teal text-white" v-model="loginPas" label="Пароль" :dense="dense"/>
              </div>
            </div>
            <q-btn color="secondary" label="Войти" @click="login"/>
          </q-tab-panel>

          <q-tab-panel name="registration" class="bg-teal-1">
            <div class="q-pa-md">
              <div class="q-gutter-y-md column" style="max-width: 300px">
                <q-input standout="bg-teal text-white" v-model="regName" label="Логин" :dense="dense"/>
                <q-input standout="bg-teal text-white" v-model="regPas" label="Пароль" :dense="dense"/>
                <q-input standout="bg-teal text-white" v-model="email" label="Почта" :dense="dense"/>
              </div>
            </div>
            <q-btn color="secondary" label="Регистрация" @click="registration"/>
          </q-tab-panel>

        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from "vuex";

export default {
  name: "Login",
  setup() {
    const store = useStore();
    const loginEmail = ref("");
    const loginPas = ref("");
    const regName = ref("");
    const regPas = ref("");
    const email = ref("");
    const registration = () => {
      store.dispatch("registrationUser", {email: loginEmail, pas: regPas});
    }
    const login = () => {
      store.dispatch("loginUser", {email: loginEmail, pas: loginPas});
    }
    return {
      loginEmail,
      loginPas,
      regName,
      regPas,
      email,
      dense: ref(false),
      tab: ref('login'),
      registration,
      login
    }
  }
}
</script>

<style scoped>

</style>
