<template>
  <router-view />
</template>
<script>
import {computed, defineComponent, onMounted} from 'vue';
import {useStore} from "vuex";

export default defineComponent({
  name: 'App',
  setup(){
    const store = useStore();
    const user = computed(() => store.state.userDetails)
    onMounted(() => {
      store.dispatch("handlerAuthStateChange");
    });
  }
})
</script>
