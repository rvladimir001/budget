<template>
  <router-view />
</template>
<script>
import {defineComponent, onMounted} from 'vue';
import {useStore} from "vuex";

export default defineComponent({
  name: 'App',
  setup(){
    const store = useStore();
    onMounted(() => {
      store.dispatch("handlerAuthStateChange");
    });
  }
})
</script>
