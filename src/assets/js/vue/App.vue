<template>
  <div class="">
    <button @click="inc">
      count {{ count }}
  </button>
  </div>
</template>
<script>

import { ref } from 'vue';
export default {
  name: 'App',
  setup() {
    let count = ref(1)
    const inc = () => count.value++

    return {
      count,
      inc
    }
  },

}
</script>
