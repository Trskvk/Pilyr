<template>
  <div class="auth-container">
    <div class="box">
      <div v-if="title.length" class="header">{{ title }}</div>
      <form @submit.prevent="$emit('process')">
        <slot></slot>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Auth",
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 100px);

  .box {
    display: block;
    width: 400px;
    //height: 300px;
    box-shadow: 0 0 20px 2px #1b1b1b;
    border-radius: 5px;
    padding: 20px;

    &.box-large {
      height: 500px;
    }

    .header {
      font-size: 25px;
      color: #fff;
      text-align: center;
    }

    form {
      margin-top: 20px;

      .form-group {
      }
    }
  }
}
</style>