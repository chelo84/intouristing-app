<template>
  <q-page class="flex flex-center">

    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />

    <div class="shadow-13 q-pa-lg" style="width: 440px;">
      <div class="row flex flex-center login-img">
        <img alt="Quasar logo"
          src="~assets/quasar-logo-full.svg"
          style="height: 180px;">
      </div>
      <q-form
        @submit="onSubmit"
        class="q-gutter-sm"
      >
        <div class="row flex flex-center q-mb-md">
          <q-input
            class="col-10"
            outlined
            v-model="username"
            :label="$t('username')"
            color="dark-purple"
            :rules="[val => !!val || $t('requiredField')]"
          />
        </div>
        <div class="row flex flex-center q-mb-md">
          <q-input v-model="password"
            outlined
            type="password"
            class="col-10"
            :label="$t('password')"
            color="dark-purple"
            :rules="[val => !!val || $t('requiredField')]"
          />
        </div>
        <div class="row flex">
          <div class="col-6 offset-1 flex flex-center">
            <router-link to="#" class="q-mr-sm" >{{ $t('forgotPassword') }}</router-link>
            <router-link to="sign-up">{{ $t('signUp') }}</router-link>
          </div>
          <q-btn
            color="dark-purple"
            class="col-2 offset-3"
            :label="$t('login')"
            :loading="loginLoading"
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
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      loginLoading: false,
    };
  },
  methods: {
    onSubmit() {
      this.loginLoading = true;
      this.$refs.bar.start();
      // this.$i18n.locale = 'pt-br';

      this.$axios.post('login', {
        username: this.username,
        password: this.password,
      }).then((resp) => {
        this.$q.localStorage.set('accessToken', resp.headers.authorization);
        this.$store.commit('auth/login');

        this.$router.push('/');
      }).catch(() => {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'login failed',
          icon: 'report_problem',
        });
      }).then(() => {
        this.loginLoading = false;
        this.$refs.bar.stop();
      });
    },
  },
};
</script>

<style scoped>
.login-img {
  padding-bottom: 20px;
}
</style>
