<template>
  <q-layout class="bg-teal-1 text-center" view="lHh Lpr lFf">
    <q-header class="bg-teal text-center" elevated>
      <q-toolbar>
        <q-btn
          v-if="name"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Мои расходы
        </q-toolbar-title>
        <q-btn
          v-if="name"
          flat
          dense
          round
          icon="logout"
          aria-label="Menu"
          @click="logout"
        />
        <div></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="name"
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
    let leftDrawerOpen = ref(false);
    const name = computed(() => store.state.userDetails.name);
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };
    const logout = () => {
      leftDrawerOpen.value = false;
      store.dispatch("logoutUser");
    };
    return {
      leftDrawerOpen,
      name,
      toggleLeftDrawer,
      logout
    }
  }
})
</script>
