<template>
  <router-view />
  <AddCategory/>
</template>
<script>
import {computed, defineComponent, onMounted} from 'vue';
import {useStore} from "vuex";
import AddCategory from 'components/AddCategory.vue'

export default defineComponent({
  name: 'App',
  components: {AddCategory},
  setup(){
    const store = useStore();
    const user = computed(() => store.state.userDetails)
    onMounted(() => {
      store.dispatch("handlerAuthStateChange");
    });
  }
})
</script>
