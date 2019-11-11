<template>
  <q-page class="full-width row justify-center  ">

    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
    />

    <div class="shadow-13 q-pa-lg q-ma-lg-lg col-12 col-md-6">
      <q-form @submit="onSubmit" class="q-gutter-sm">
        <div class="row flex flex-center q-mb-md">
          <q-avatar size="100px">
            <q-img :src="avatarUrl" spinner-color="accent" class="fit" ref="avatarImg">
              <template v-slot:error>
                <div class="absolute-full text-white" style="padding: 0;">
                  <q-icon name="account_circle" style="font-size: 101px;"/>
                </div>
                <div class="absolute-full text-subtitle2 flex flex-center disabled">
                  {{ $t('change') }}
                </div>
                <q-input
                  @input="changeAvatar"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  color="white"
                  hidden
                  borderless
                  class="fit cursor-pointer"
                />
              </template>

              <div class="absolute-full text-subtitle2 flex flex-center disabled">
                {{ $t('change') }}
              </div>
              <q-input
                @input="changeAvatar"
                type="file"
                accept="image/x-png,image/gif,image/jpeg"
                color="white"
                hidden
                borderless
                class="fit cursor-pointer"
              />
            </q-img>
          </q-avatar>
        </div>

        <div class="row">
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

        <div class="row flex">
            <q-btn
              color="dark-purple"
              class="offset-md-11 col-md-1 offset-9 col-3 q-pa-sm"
              :label="$t('save')"
              :loading="buttonLoading"
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
      account: this.$store.getters['auth/getAccount'] || {},
      avatarUrl: `${process.env.API_URL}users/avatar/${this.$store.getters['auth/getAccount'].id}`,
      buttonLoading: false,
      user: {
        name: this.$store.getters['auth/getAccount'].name || '',
        lastName: this.$store.getters['auth/getAccount'].lastName || '',
        username: this.$store.getters['auth/getAccount'].username || '',
        email: this.$store.getters['auth/getAccount'].email || '',
      },
    };
  },
  methods: {
    changeAvatar(input) {
      const fd = new FormData();
      fd.append('avatar', input[0]);

      this.$axios.post(
        `users/avatar/${this.account.id}`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      ).then(() => {
        this.avatarUrl = (`${process.env.API_URL}users/avatar/${this.$store.getters['auth/getAccount'].id}?${new Date().getTime()}`);
      }).catch((error) => {
        console.error(error);
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Unable to upload image',
          icon: 'report_problem',
        });
      });
    },
    onSubmit() {
      this.buttonLoading = true;

      this.$axios.put(
        'users',
        this.user,
      ).then(() => {
        this.$q.notify({
          color: 'positive',
          position: 'bottom',
          message: this.$t('saved'),
          icon: 'check_circle',
        });
        this.updateToken();
      }).catch((error) => {
        console.error(error);
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Whoops! Something went wrong',
          icon: 'report_problem',
        });
      }).then(() => {
        this.buttonLoading = false;
      });
    },
    updateToken() {
      this.$axios.get('users/token/update').then((resp) => {
        this.$q.localStorage.set('accessToken', resp.data);
        this.$store.commit('auth/login');
      });
    },
  },
};
</script>
