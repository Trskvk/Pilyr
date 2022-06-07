<template>
  <Auth title="Sign In"
        @process="doLogin">
    <div class="form-group">
      <input type="text" name="username" v-model="username" id="username" placeholder=" " class="form-control" required>
      <label for="username">Username</label>
    </div>

    <div class="form-group no-margin">
      <input type="password" name="username" v-model="password" id="password" placeholder=" " class="form-control"
             required>
      <label for="password">Password</label>
    </div>

    <div :class="['error-text', error_message.length ? 'active' : '']">{{ error_message || '...' }}</div>


    <div class="form-group flex-group">
      <button class="form-button">Login</button>
      <router-link to="/register">
        <div class="form-button flat">Don't have an account?</div>
      </router-link>
    </div>

  </Auth>
</template>

<script>
import Auth from '../Helpers/Auth.vue'

export default {
  name: "Login",
  components: {
    Auth
  },
  data() {
    return {
      username: '',
      password: '',
      error_message: '',

      loading: false
    }
  },
  methods: {
    async doLogin() {
      if (this.loading) return;
      this.loading = true;
      let res = await this.$api.user.login(this.username, this.password);
      if (!res.success) {
        this.error_message = res.message;
      }else{
        this.$store.commit('user', {
          logged_in: true,
          username: res.user.username,
          _id: res.user._id,
          role: res.user.role,
          token: res.user.accessToken
        });
        this.$api.ajax.token = res.user.accessToken;
        await this.$router.push('/');
      }

      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
.error-text {
  display: block;
  color: #b23434;
  text-align: center;
  margin: 10px;

  transition: all .3s ease;
  max-height: 0;
  overflow: hidden;

  height: 40px;
  line-height: 40px;

  &.active {
    max-height: 40px;
  }
}

.no-margin {


  margin: 0 !important;
}
</style>