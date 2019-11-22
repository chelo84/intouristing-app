<style scoped>

  .notification-user-name {
    margin: auto 0 auto 0;
  }

</style>

<template>
    <q-layout view="hHh Lpr lff"  class="shadow-2 rounded-borders">
      <q-header elevated class="dark-purple">
        <q-toolbar >
          <q-btn v-if="!showBackButton"
            flat @click="drawer = !drawer"
            round
            dense
            icon="menu"
          />
          <q-btn v-else
            flat
            @click="onBack"
            round
            dense
            icon="mdi-arrow-left"
          />

          <q-toolbar-title v-if="titleParams">
            <user-avatar size="40px" :user-id="titleParams.avatar"/>
            {{ titleParams.title }}
          </q-toolbar-title>

          <q-toolbar-title v-else />

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
                    {{ `${notification.sender.name} ${notification.sender.lastName}` }}
                  </div>
                  <q-btn
                    rounded
                    class="bg-primary text-white q-mt-sm"
                    size="sm"
                    @click="showProfile(notification)"
                    :label="$t('profile')"
                  />
                </div>

                <q-separator vertical inset class="q-mx-xs" />

                <div class="col-2 items-right q-ml-xs">
                  <q-btn
                    round
                    color="positive"
                    @click="acceptRequest(notification.id)"
                    icon="mdi-check"
                    size="xs"
                    v-close-popup
                  />
                  <q-btn
                    round
                    class="q-mt-md"
                    @click="declineRequest(notification.id)"
                    color="negative"
                    icon="mdi-close"
                    size="xs"
                    v-close-popup
                  />
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
        content-class="bg-white"
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

            <q-item clickable v-ripple to="/chat">
              <q-item-section avatar>
                <q-icon name="mdi-comment-text" />
              </q-item-section>

              <q-item-section>
                Chat
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

      <q-page-container
        class="bg-deep-purple-1"
      >
      <router-view />
    </q-page-container>

    <user-profile-card
      ref="profileCard"
      :is-request="true"
      :notification="currNotification ? currNotification.id : undefined"
      @acceptRequest="acceptRequest"
      @declineRequest="declineRequest"
      :user="currNotification ? currNotification.sender : undefined"
    />

    </q-layout>

</template>

<script>
import UserProfileCard from '../components/UserProfileCard';
import UserAvatar from '../components/UserAvatar';

export default {
  components: {
    UserProfileCard,
    UserAvatar,
  },
  created() {
    this.$root.$on('addBackButton', (backCallback) => {
      this.showBackButton = true;
      this.backButtonCallback = backCallback;
    });

    this.$root.$on('addTitle', (titleParams) => {
      this.titleParams = titleParams;
    });

    const headers = this.$getStompHeaders();
    headers.id = `${this.user.username}-search`;
    const requestCallback = () => {
      this.notificationCount = typeof this.notificationCount === 'number' ? this.notificationCount + 1 : 1;
      this.$infoAlert(this.$t('thereAreNewNotifications'), { position: 'bottom-right' });
    };
    const callbackAfterConnectionIsEstablished = () => {
      this.$store.dispatch(
        'stomp/subscribe',
        {
          name: 'request',
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
        if (!this.isUpdated) {
          setTimeout(() => { this.isUpdated = false; }, 3000);
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
          this.isUpdated = true;
        }
      };
      const watchPosition = () => {
        this.watchId = navigator.geolocation.watchPosition(
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
  },
  data() {
    this.fetchNotificationList();
    return {
      drawer: false,
      miniState: true,
      user: {
        id: this.$store.getters['auth/getAccount'].id,
        username: this.$store.getters['auth/getAccount'].username,
      },
      notificationCount: 0,
      notificationList: this.fetchNotifications,
      currNotification: Object,
      isUpdated: false,
      watchId: null,
      showBackButton: false,
      backButtonCallback: null,
      titleParams: null,
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
      navigator.geolocation.clearWatch(this.watchId);
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    fetchNotificationList() {
      this.$axios.get('requests/count').then((resp) => {
        this.notificationCount = resp.data || 0;
      });
      this.$axios.get('requests').then((resp) => {
        this.notificationList = resp.data;
      });
    },
    showProfile(notification) {
      this.currNotification = notification;
      this.$refs.profileCard.openCard();
    },
    acceptRequest(notificationId) {
      this.answerRequest('accept-request', notificationId);
    },
    declineRequest(notificationId) {
      this.answerRequest('decline-request', notificationId);
    },
    answerRequest(destination, notificationId) {
      const headers = this.$getStompHeaders();
      headers.id = `${this.user.username}-${destination}`;
      this.$store.dispatch(
        'stomp/send',
        {
          destination: `/ws/${destination}`,
          body: notificationId,
          headers,
        },
      );
      this.notificationCount -= 1;
    },
    onBack() {
      if (typeof this.backButtonCallback === 'function') {
        this.backButtonCallback();
      }

      if (this.titleParams && this.titleParams.clearOnBack) {
        this.titleParams = null;
      }

      this.showBackButton = false;
    },
  },
};
</script>
