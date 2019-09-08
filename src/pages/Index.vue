<template>
  <q-page class="flex flex-center">
    <div class="shadow-13" style="padding: 2% 2% 2% 2%; width: 500px;">
      <div class="row flex flex-center login-field">
        <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" style="height: 200px;">
      </div>
      <div class="row flex flex-center login-field">
        <q-input class="col-10" v-model="text" :label="$t('username')" :dense="dense"
        color="dark-purple" />
      </div>
      <div class="row flex flex-center login-field">
        <q-input v-model="password" type="password" class="col-10" :label="$t('password')"/>
      </div>
      <div class="row flex">
        <a href="#" class="col-3 offset-4 self-center">Forgot password</a>
        <q-btn color="dark-purple" class="col-2 offset-3" :label="$t('login')" />
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
};
</script>

<style scoped>
.login-field {
  padding-bottom: 20px;
  width: 100%;
}
</style>
