<style scoped>

  .notification-user-name {
    margin: auto 0 auto 0;
  }

</style>

<template>
    <q-layout view="hHh Lpr lff"  class="shadow-2 rounded-borders">
      <q-header elevated class="dark-purple">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />

          <q-toolbar-title/>

          <q-btn flat round dense icon="mdi-bell" @click="fetchNotificationList">
            <q-badge
              floating
              color="red"
              :label="notificationCount"
              v-show="notificationCount > 0"
            />

            <q-menu anchor="bottom right">
              <div class="row no-wrap q-pa-md"
                v-for="notification in notificationList"
                v-bind:key="notification.id">

                <div class="col-9">
                  <div class="text-subtitle2 notification-user-name">
                    {{ `${notification.senderName} ${notification.senderLastName}` }}
                  </div>
                  <q-btn
                    rounded
                    disable
                    class="disabled bg-primary text-white q-mt-sm"
                    size="sm"
                    :label="$t('viewProfile')"
                  />
                </div>

                <q-separator vertical inset class="q-mx-xs" />

                <div class="col-2 items-right q-ml-xs">
                  <q-btn round color="positive" icon="mdi-check" size="xs"/>
                  <q-btn round class="q-mt-md" color="negative" icon="mdi-close" size="xs"/>
                </div>
              </div>
            </q-menu>
          </q-btn>
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
  created() {
    console.log('CREATED');

    const headers = this.$getStompHeaders();
    headers.id = `${this.user.username}-search`;
    const requestCallback = (message) => {
      console.log(message);

      this.notificationCount = typeof this.notificationCount === 'number' ? this.notificationCount + 1 : 1;
      this.$infoAlert(this.$t('thereAreNewNotifications'), { position: 'bottom-right' });
    };
    const callbackAfterConnectionIsEstablished = () => {
      this.$store.dispatch(
        'stomp/subscribe',
        {
          destination: '/user/queue/request',
          callback: requestCallback,
          headers,
        },
      );
    };
    this.$store.dispatch('stomp/connect', callbackAfterConnectionIsEstablished);

    const OPTIONS = { enableHighAccuracy: true, timeout: 10000, maximumAge: Infinity };
    if ('geolocation' in navigator) {
      const watchPositionCallback = (position) => {
        console.log('Position found');
        if (!this.isUpdated) {
          const userPosition = {
            user: this.userId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          headers.id = `${this.user.username}-update-position`;

          this.$store.dispatch(
            'stomp/send',
            {
              destination: '/ws/update-position',
              body: userPosition,
              headers,
            },
          );
        }
      };
      const watchPosition = () => {
        navigator.geolocation.watchPosition(
          watchPositionCallback,
          (error) => {
            console.error(error);
            watchPosition();
          },
          OPTIONS,
        );
      };
      watchPosition();
    }

    this.$axios.get('requests/count').then((resp) => {
      this.notificationCount = resp.data || 0;
    });
    this.$axios.get('requests').then((resp) => {
      this.notificationList = resp.data;
      console.log(this.notificationList[0]);
    });
  },
  data() {
    return {
      drawer: false,
      miniState: true,
      user: {
        id: this.$store.getters['auth/getAccount'].id,
        username: this.$store.getters['auth/getAccount'].username,
      },
      notificationCount: 0,
      notificationList: this.fetchNotifications,
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
    fetchNotificationList() {
      this.$axios.get('requests').then((resp) => {
        this.notificationList = resp.data;
        console.log(this.notificationList[0]);
      });
    },
  },
};
</script>
