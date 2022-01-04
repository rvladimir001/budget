<template>
  <q-layout class="bg-teal-1 text-center" view="lHh Lpr lFf">
    <q-header class="bg-teal text-center" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          YourBudget
        </q-toolbar-title>

        <div></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >

        <EssentialLink/>

    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

import {computed, defineComponent, ref} from 'vue'
import {useStore} from "vuex";

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup() {
    const store = useStore();
    const leftDrawerOpen = ref(false)
    const name = computed(() => store.state.userDetails.name)
    return {
      leftDrawerOpen,
      name,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
