<template>
  <q-list v-ripple>

    <q-item clickable v-ripple>
      <q-item-section avatar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png">
        </q-avatar>
      </q-item-section>
      <q-item-section>{{ name }}</q-item-section>
    </q-item>

    <q-item clickable>
      <q-item-section avatar>
        <q-icon name="leaderboard"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>Статистика</q-item-label>
      </q-item-section>
    </q-item>

        <q-item clickable>
      <q-item-section avatar>
        <q-icon name="settings"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>Настройки</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable>
      <q-item-section avatar>
        <q-icon name="logout"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>Выход</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import {computed, defineComponent} from 'vue'
import {useStore} from "vuex";

export default defineComponent({
  name: 'EssentialLink',
    setup() {
    const store = useStore();
    const name = computed(() => store.state.userDetails.name)
    return {
      name,
    }
  }
})
</script>
