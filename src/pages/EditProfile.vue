<template>
  <q-page class="full-width row justify-center  ">

    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
    />
    <div class="shadow-13 q-pa-lg q-ma-lg-lg col-12 col-md-6">
      <div class="row flex flex-center">

        <q-avatar size="100px">
          <q-img :src="avatarUrl" spinner-color="accent" class="fit">
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
                class="fit"
              />
            </template>

            <div class="absolute-full text-subtitle2 flex flex-center disabled">
              {{ $t('change') }}
            </div>|
            <q-input
              @input="changeAvatar"
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
              color="white"
              hidden
              borderless
              class="fit"
            />
          </q-img>
        </q-avatar>

      </div>
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
      ).then((resp) => {
        console.log(resp);
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
  },
};
</script>
