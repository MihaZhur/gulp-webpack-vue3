<template>
  <button class="button" @click="inc">click {{ count }}</button>
</template>
<script>
import { ref } from "vue";
export default {
  name: "App",
  setup() {
    let count = ref(0);
    const inc = () => count.value++;

    return {
      count,
      inc,
    };
  },
};
</script>
