<template>
  <q-page class="flex flex-center">
    <q-ajax-bar ref="bar" position="bottom" color="accent" size="10px" skip-hijack />

    <div class="shadow-13 q-pa-lg" style="width: 700px;">
      <div class="row flex q-mb-md">
        <router-link to="/login">
          <q-icon name="arrow_back" />
          {{ $t('loginPage') }}
        </router-link>
      </div>
      <div class="row q-mb-md">
        <div class="offset-1 col-10 row">
          <q-input
            v-model="user.name"
            outlined
            type="text"
            class="col-sm-6 q-pr-sm-sm col-12"
            :label="$t('name')"
            color="dark-purple"
            :rules="[
                val => !!val || $t('requiredField'),
            ]"
            lazy-rules
          />
          <q-input
            v-model="user.lastName"
            outlined
            type="text"
            class="col-sm-6 q-pl-sm-sm col-12"
            :label="$t('lastName')"
            color="dark-purple"
            :rules="[
                val => !!val || $t('requiredField'),
            ]"
            lazy-rules
          />
        </div>
      </div>
      <q-form @submit="onSubmit" class="q-gutter-sm">
        <div class="row flex flex-center q-mb-md">
          <q-input
            class="col-10"
            outlined
            v-model="user.username"
            :label="$t('username')"
            color="dark-purple"
            :rules="[
              val => !!val || $t('requiredField'),
              verifyUsername
            ]"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon class="text-bold" name="done" color="green"
                v-bind:class="{ hidden: (user.username.length == 0 || !validUsername) }" />
            </template>

          </q-input>
        </div>
        <div class="row flex flex-center q-mb-md">
          <q-input
            class="col-10"
            outlined
            type="email"
            v-model="user.email"
            :label="$t('email')"
            color="dark-purple"
            :rules="[
              val => !!val || $t('requiredField'),
              val =>
                  (val.includes('@') && val.indexOf('@') != val.length-1) || $t('malformedEmail'),
              verifyEmail
            ]"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon class="text-bold" name="done" color="green"
                v-bind:class="{ hidden: (user.email.length == 0 || !validEmail) }" />
            </template>

          </q-input>
        </div>
        <div class="row q-mb-md">
          <div class="offset-1 col-10 row">
            <q-input
              v-model="user.password"
              outlined
              type="password"
              class="col-sm-6 q-pr-sm-sm col-12"
              :label="$t('password')"
              color="dark-purple"
              :rules="[
                  val => !!val || $t('requiredField'),
                  val => val.length >= 6 || $t('passwordMinLength'),
              ]"
              autocomplete="new-password"
              @blur="verifyPassword"
              lazy-rules
            />
            <q-input
              ref="repeatPassword"
              v-model="repeatPassword"
              outlined
              type="password"
              class="col-sm-6 q-pl-sm-sm col-12"
              :label="$t('repeatPassword')"
              color="dark-purple"
              :rules="[
                  val => val == user.password || $t('confirmationMatchPassword'),
                  val => !!val || $t('requiredField')
                ]"
              lazy-rules
            />
          </div>
        </div>
        <div class="row flex">
          <q-btn
            color="dark-purple"
            class="offset-1 col-10 q-pa-sm"
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
      user: {
        name: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
      },
      repeatPassword: '',
      validUsername: false,
      validEmail: false,
    };
  },
  methods: {
    onSubmit() {
      this.registerLoading = true;
      this.$refs.bar.start();

      // Mock position
      this.user.userPosition = {
        latitude: 3.2223,
        longitude: 21.223,
        accuracy: 2.232,
        speed: 33.33,
        heading: 99.82,
      };

      this.$axios.post(
        'users',
        this.user,
      ).then(() => {
        this.$refs.bar.stop();
        this.$router.push('/login');
      }).catch((error) => {
        console.error(error);
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Whoops! Something went wrong',
          icon: 'report_problem',
        });
      }).then(() => {
        this.registerLoading = false;
        if (this.$refs.bar) this.$refs.bar.stop();
      });
    },
    verifyPassword() {
      if (this.repeatPassword.length > 0) {
        this.$refs.repeatPassword.validate();
      }
    },
    verifyUsername(val) {
      return new Promise((resolve) => {
        this.$axios.get(`verifications/username/${val}`).then((resp) => {
          if (!resp.data) {
            this.validUsername = true;
            resolve(true);
          } else {
            this.validUsername = false;
            resolve(this.$t('usernameAlreadyBeingUsed'));
          }
        });
      });
    },
    verifyEmail(val) {
      return new Promise((resolve) => {
        this.$axios.get(`verifications/email/${val}`).then((resp) => {
          if (!resp.data) {
            this.validEmail = true;
            resolve(true);
          } else {
            this.validEmail = false;
            resolve(this.$t('emailAlreadyBeingUsed'));
          }
        });
      });
    },
  },
};
</script>
