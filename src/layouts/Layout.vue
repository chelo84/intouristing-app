<template>
    <q-layout view="hHh Lpr lff"  class="shadow-2 rounded-borders">
      <q-header elevated class="dark-purple">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above

        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"

        :width="200"
        :breakpoint="500"
        bordered
        content-class="bg-grey-3"
      >
        <q-scroll-area class="fit">
          <q-list padding>

            <q-item clickable v-ripple to="/search">
              <q-item-section avatar>
                <q-icon name="mdi-map-marker-radius" />
              </q-item-section>

              <q-item-section>
                {{ $t('search') }}
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple to="/edit-profile">
              <q-item-section avatar>
                <q-icon name="account_circle" />
              </q-item-section>

              <q-item-section>
                {{ name }} {{ lastName }}
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple to="#">
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>

              <q-item-section>
                Star
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple to="#">
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>
                Send
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple to="#">
              <q-item-section avatar>
                <q-icon name="drafts" />
              </q-item-section>

              <q-item-section>
                Drafts
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple @click="logout" to="#">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>

              <q-item-section>
                {{ $t('logout') }}
              </q-item-section>
            </q-item>

          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
      <router-view />
    </q-page-container>

    </q-layout>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      miniState: true,
    };
  },
  computed: {
    name() {
      return (this.$store.getters['auth/getAccount'].name || '');
    },
    lastName() {
      return (this.$store.getters['auth/getAccount'].lastName || '');
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
  },
};
</script>
