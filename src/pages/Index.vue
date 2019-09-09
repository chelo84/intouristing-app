<template>
  <q-page class="flex flex-center">
    <div class="shadow-13"
      style="padding: 2% 2% 2% 2%; width: 500px;">
      <div class="row flex flex-center login-field">
        <img alt="Quasar logo"
          src="~assets/quasar-logo-full.svg"
          style="height: 200px;">
      </div>
      <q-form
        @submit="onSubmit"
        class="q-gutter-md"
      >
        <div class="row flex flex-center login-field">
          <q-input
            class="col-10"
            v-model="username"
            :label="$t('username')"
            color="dark-purple"
            :rules="[val => !!val || 'Field is required']"
          />
        </div>
        <div class="row flex flex-center login-field">
          <q-input v-model="password"
            type="password"
            class="col-10"
            :label="$t('password')"
            color="dark-purple"
            :rules="[val => !!val || 'Field is required']"
          />
        </div>
        <div class="row flex">
          <div class="col-5 offset-3 flex flex-center">
            <a href="#" >Forgot password</a>
            <strong>&nbsp;|&nbsp;</strong>
            <a href="#">Sign up</a>
          </div>
          <q-btn
            color="dark-purple"
            class="col-2 offset-2"
            :label="$t('login')"
            type="submit"
          />
      </div>
    </q-form>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    onSubmit() {
      this.$q.loading.show();
      console.log(`username == ${this.username}`);
      console.log(`password == ${this.password}`);
      console.log(process.env);
      this.$q.loading.hide();
    },
  },
};
</script>

<style scoped>
.login-field {
  padding-bottom: 20px;
  width: 100%;
}
</style>
