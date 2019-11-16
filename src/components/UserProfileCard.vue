<template>
  <q-dialog v-model="card">
    <q-card style="width:300px;max-width: 350px;">
      <q-img
        :src="avatarUrl + user.id"
        spinner-color="accent"
        style="height: 200px;"
        ref="avatarImg"
      >
        <template v-slot:error>
          <div class="absolute-full text-white flex justify-center" style="padding: 0;">
            <q-icon name="account_circle" style="font-size: 200px;"/>
          </div>
        </template>
      </q-img>

      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="place"
          class="absolute no-pointer-events cursor-none"
          style="top: 0; right: 12px; transform: translateY(-50%);"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ user.name }}&nbsp;{{ user.lastName }}</div>
          <div class="col-auto text-grey q-pt-md">
            <q-icon name="place" /> {{ $toDistance(user.distance) }}
          </div>
        </div>

      </q-card-section>

      <!-- <q-card-section>
        <div class="text-subtitle1">$・Italian, Cafe</div>
        <div class="text-subtitle2 text-grey">
          Small plates, salads & sandwiches in an intimate setting.</div>
      </q-card-section> -->

      <q-separator />

      <q-card-actions v-if="isRequest" class="no-wrap">
        <q-btn
          flat
          color="negative"
          class="fit"
          v-close-popup
          @click="declineRequest"
        >
          {{ $t('decline') }}
        </q-btn>
        <q-btn
          flat
          color="positive"
          class="fit"
          v-close-popup
          @click="acceptRequest"
        >
          {{ $t('accept') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default() {
        return {};
      },
    },
    isRequest: Boolean,
    notification: Number,
  },
  data() {
    return {
      card: false,
      avatarUrl: `${process.env.API_URL}users/avatar/`,
    };
  },
  methods: {
    openCard() {
      this.$forceUpdate();
      this.card = true;
    },
    acceptRequest() {
      this.$emit('acceptRequest', this.notification);
    },
    declineRequest() {
      this.$emit('declineRequest', this.notification);
    },
  },
};
</script>
