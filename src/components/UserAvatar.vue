<template>
  <q-avatar :size="size">
    <q-img
      :src="avatarUrl + userId"
      class="full-height"
      spinner-color="accent"
    >

      <template v-slot:error>
        <div class="absolute-full text-white flex justify-center" style="padding: 0;">
          <q-icon
            name="account_circle"
            class="full-height"
            :style="`font-size: ${size}`"/>
        </div>
      </template>
    </q-img>
  </q-avatar>
</template>

<script>
export default {
  props: {
    userId: Number,
    size: {
      type: String,
      default: '60px',
    },
  },
  data() {
    return {
      avatarUrl: `${process.env.API_URL}users/avatar/`,
    };
  },
};
</script>
