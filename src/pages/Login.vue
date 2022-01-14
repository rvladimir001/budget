<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 600px">
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
            <div>
              <div class="q-gutter-y-md column q-mx-auto" style="max-width: 300px">
                <q-input
                         v-model="loginEmail"
                         label="Почта"
                         :dense="dense"
                         error-message="Неверно указана почта или не пройдена регистрация."
                         :error="invalidEmail"
                         lazy-rules
                         :rules="valRules"
                />
                <q-input
                         v-model="loginPas"
                         label="Пароль"
                         :dense="dense"
                         :type="isPwd ? 'password' : 'text'"
                         error-message="Неверный пароль."
                         :error="wrongPassword"
                         lazy-rules
                         :rules="valRules">
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <q-btn color="secondary" label="Войти" @click="login" :disable="disabledLogin"/>
          </q-tab-panel>

          <q-tab-panel name="registration" class="bg-teal-1">
            <div class="q-pa-md">
              <div class="q-gutter-y-md column q-mx-auto" style="max-width: 300px">
                <q-input standout="bg-teal
                text-white"
                         v-model="RegName"
                         label="Логин"
                         :dense="dense"
                         lazy-rules
                         :rules="valRules"
                />
                <q-input standout="bg-teal
                text-white"
                         v-model="RegEmail"
                         label="Почта"
                         :dense="dense"
                         error-message="Некорректно указана почта."
                         :error="invalidRegEmail"
                         lazy-rules
                         :rules="valRules"
                />
                <q-input standout="bg-teal text-white"
                         v-model="regPas"
                         label="Пароль"
                         :dense="dense"
                         :type="isPwd ? 'password' : 'text'"
                         error-message="Пароль должен содержать не менее 6 символов."
                         :error="isValidPas"
                         lazy-rules
                         :rules="valRules"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <q-btn color="secondary" label="Регистрация" @click="registration" :disable="disabledReg"/>
          </q-tab-panel>

        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from "vuex";

export default {
  name: "Login",
  setup() {
    const store = useStore();
    const loginEmail = ref("");
    const loginPas = ref("");
    const RegName = ref("");
    const regPas = ref("");
    const RegEmail = ref("");
    const disabledLogin = computed(() => loginEmail.value && loginPas.value || true);
    const disabledReg = computed(() => regPas.value && RegEmail.value && RegName.value || true);
    const registration = () => {
      store.dispatch("registrationUser", {email: RegEmail, name: RegName, pas: regPas});
    }
    const login = () => {
      store.dispatch("loginUser", {email: loginEmail, pas: loginPas});
    }
    const invalidEmail = computed(() => store.state.invalidEmail);
    const wrongPassword = computed(() => store.state.wrongPassword);
    const invalidRegEmail = computed(() => store.state.invalidRegEmail);
    return {
      valRules: [
        val => (val && val.length > 0) || 'Заполните поле.'
      ],
      isValidPas: computed(() => {
        if (regPas.value.length >= 6 || regPas.value === "") {
          return false;
        }
        return true
      }),
      loginEmail,
      loginPas,
      RegName,
      regPas,
      RegEmail,
      isPwd: ref(true),
      dense: ref(false),
      tab: ref('login'),
      registration,
      login,
      disabledLogin,
      disabledReg,
      invalidEmail,
      wrongPassword,
      invalidRegEmail
    }
  }
}
</script>

<style scoped>

</style>
