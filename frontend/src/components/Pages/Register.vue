<template>
  <Auth title="Register"
        @process="doRegister">

    <div class="form-group">
      <input type="text" name="username" id="username" placeholder=" " class="form-control" v-model="username" required>
      <label for="username">Username</label>
    </div>

    <div class="form-group">
      <input type="password" name="username" id="password" placeholder=" " class="form-control" v-model="password" required>
      <label for="password">Password</label>
    </div>

    <div class="form-group">
      <input type="password" name="username" id="re-password" placeholder=" " class="form-control" v-model="password_re" required>
      <label for="re-password">Password Confirmation</label>
    </div>

    <div class="form-group no-margin">
      <select name="account-type" id="account-type" class="form-control"  v-model="type" required>>
        <option value="" disabled selected>-- Select account type --</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <label for="account-type">Role</label>
    </div>

    <div :class="['error-text', error_message.length ? 'active' : '']">{{ error_message || '...' }}</div>


    <div class="form-group flex-group">
      <button class="form-button" type="submit">Register</button>
      <router-link to="/login">
        <div class="form-button flat">Have an account? Sign in</div>
      </router-link>
    </div>
  </Auth>
</template>

<script>
import Auth from '../Helpers/Auth.vue'

export default {
  name: "Register",
  components: {
    Auth
  },
  data() {
    return {
      username: '',
      password: '',
      password_re: '',
      type: '',
      error_message: '',

      loading: false
    }
  },
  methods: {
    async doRegister() {
      if (this.loading) return;

      if(this.password.length < 6) {
        this.error_message = 'Password must be at least 6 characters long.'
        return;
      }else if(this.password !== this.password_re) {
        this.error_message = 'Passwords do not match';
        return;
      }

      this.loading = true;
      let res = await this.$api.user.register(this.username, this.password, this.type);
      if (!res.user) {
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