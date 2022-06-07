<template>
  <Menu />
  <slot />
</template>

<script>
import Menu from './Menu.vue';

export default {
  name: 'Layout',
  components: {
    Menu
  }
}
</script>