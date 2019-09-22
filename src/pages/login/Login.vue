<template>
  <q-page class="flex flex-center">

    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
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
        <div class="row q-mb-md">
          <q-input
            class="offset-1 col-10"
            outlined
            v-model="username"
            :label="$t('username')"
            color="dark-purple"
            :rules="[val => !!val || $t('requiredField')]"
            autocomplete="username"
          />
        </div>
        <div class="row flex q-mb-md">
          <q-input v-model="password"
            outlined
            type="password"
            class="offset-1 col-10"
            :label="$t('password')"
            color="dark-purple"
            :rules="[val => !!val || $t('requiredField')]"
            autocomplete="current-password"
          />
        </div>
        <div class="row items-center">
          <div class="col-4">
            <!-- <router-link to="#" class="q-mr-sm" >{{ $t('forgotPassword') }}</router-link> -->
            <router-link to="sign-up">{{ $t('signUp') }}</router-link>
          </div>
          <div class="col-4">
            <q-select
              v-model="locale"
              dense
              options-dense
              :options="locales"
              :label="$t('language')"
              @input="localeChange"
            />
          </div>
          <q-btn
            color="dark-purple"
            class="col-2 offset-2"
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
      username: this.$q.localStorage.getItem('rememberUsername') || '',
      password: '',
      loginLoading: false,
      locale: this.$q.localStorage.getItem('locale') || this.$i18n.locale,
      remember: !!this.$q.localStorage.getItem('rememberUsername') || false,
    };
  },
  computed: {
    locales() {
      return this.$i18n.availableLocales;
    },
  },
  methods: {
    localeChange() {
      this.$i18n.locale = this.locale;
      this.$q.localStorage.set('locale', this.locale);
    },
    onSubmit() {
      this.loginLoading = true;

      this.$axios.post('login', {
        username: this.username,
        password: this.password,
      }).then((resp) => {
        this.$q.localStorage.set('accessToken', resp.headers.authorization);
        this.$store.commit('auth/login');

        if (this.remember) {
          this.$q.localStorage.set('rememberUsername', this.username);
        } else {
          this.$q.localStorage.remove('rememberUsername');
        }

        this.$router.push('/');
      }).catch((error) => {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: error.response.status === 403 ? this.$t('wrongUsernameOrPassword') : this.$t('loginFailed'),
          icon: 'report_problem',
        });
      }).then(() => {
        this.loginLoading = false;
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
