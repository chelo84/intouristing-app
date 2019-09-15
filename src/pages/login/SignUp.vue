<template>
  <q-page class="flex flex-center">
    <q-ajax-bar ref="bar" position="bottom" color="accent" size="10px" skip-hijack />

    <div class="shadow-13 q-pa-lg" style="width: 400px;">
      <div class="row flex q-mb-md">
        <router-link to="/login">
          <q-icon name="arrow_back" />
          {{ $t('loginPage') }}
        </router-link>
      </div>
      <q-form @submit="onSubmit" class="q-gutter-sm">
        <div class="row flex flex-center q-mb-md">
          <q-input
            class="col-10"
            outlined
            v-model="username"
            :label="$t('username')"
            color="dark-purple"
            :rules="[
              val => !!val || $t('requiredField'),
              verifyUsername
            ]"
          />
        </div>
        <div class="row flex flex-center q-mb-md">
          <q-input
            v-model="password"
            outlined
            type="password"
            class="col-10"
            :label="$t('password')"
            color="dark-purple"
            :rules="[val => !!val || $t('requiredField')]"
            @keyup="verifyPassword"
          />
        </div>
        <div class="row flex flex-center q-mb-md">
          <q-input
            v-model="repeatPassword"
            outlined
            ref="repeatPassword"
            type="password"
            class="col-10"
            :label="$t('repeatPassword')"
            color="dark-purple"
            :rules="[
                val => val == password || $t('confirmationMatchPassword'),
                val => !!val || $t('requiredField')
              ]"
          />
        </div>
        <div class="row flex">
          <q-btn
            color="dark-purple"
            class="col-10 offset-1"
            :label="$t('register')"
            :loading="registerLoading"
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
  name: 'SignUp',
  data() {
    return {
      registerLoading: false,
      username: '',
      password: '',
      repeatPassword: '',
    };
  },
  methods: {
    onSubmit() {},
    verifyPassword() {
      if (this.repeatPassword.length > 0) {
        this.$refs.repeatPassword.validate();
      }
    },
    verifyUsername(val) {
      this.$i18n.locale = 'pt-br';

      return new Promise((resolve) => {
        this.$axios.get(`verifications/username/${val}`).then((resp) => {
          resolve(!resp.data || this.$t('usernameAlreadyBeingUsed'));
        });
      });
    },
    verifyEmail(val) {
      return new Promise((resolve) => {
        this.$axios.get(`verifications/email/${val}`).then((resp) => {
          resolve(!resp.data || this.$t('emailAlreadyBeingUsed'));
        });
      });
    },
  },
};
</script>
