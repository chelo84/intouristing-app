<style scoped>
  .btn-search {
    font-size: 24px;
    height: 160px;
    width: 160px;
  }

  .search-spinner {
    position: absolute;
    bottom: 34px;
  }
  .search-cancel-text {
    position: absolute;
    bottom: 8px;
    font-size: 12px;
    color: red;;
  }

  .found-user {
    padding: 14px;
    border: 1px solid #c876f873 !important;
    /* border-width: 1px 0 1px 0 !important; */
  }
  /* .found-user:hover {
    background-color: #4b367b2e;
    cursor: pointer;
  } */

  .send-request-btn {
    align-self: center;
  }
  .send-request-btn button {
    float: right;
  }

  .users-section {
    padding: 14px !important;
  }
</style>

<template>
  <q-page class="flex justify-center items-center">

    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />

    <div class="flex column items-center">
      <q-btn
        round
        class="btn-search"
        :color="searchBtnColor"
        :text-color="searchBtnTextColor"
        @click="onSearchBtnClick"
        :label="searchBtnText"
        >
        <small class="text-weight-bolder" :class="isSearching ? 'search-cancel-text' : 'hidden'">
          {{ $t('cancel') }}
        </small>
        <q-spinner-dots
          ref="search-loading"
          color="dark-purple"
          size="1em"
          :class="isSearching ? 'search-spinner' : 'hidden'"
        />
      </q-btn>
    </div>

    <q-dialog
      v-model="dialog"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-deep-purple-1">
        <q-bar class="bg-dark-purple">
          <q-space/>

          <q-btn dense flat icon="close" text-color="white" v-close-popup>
            <q-tooltip content-class="bg-dark-purple text-white">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6 text-center text-primary">{{ $t('usersFound') }}</div>
        </q-card-section>

        <q-card-section v-if="!foundUsers || foundUsers.length === 0">
          <div class="text-h5 text-center text-primary">
            <q-icon name="mdi-package-variant"/>
            {{ $t('noUserFound') }}
          </div>
        </q-card-section>
        <q-card-section class="users-section q-gutter-y-md bg-white">
          <div
            class="found-user bg-grey-1 q-my-lg"
            v-for="user in foundUsers"
            v-bind:key="user.id"
          >
            <div class="row">
              <div class="col-sm-1 col-2">
                <q-avatar size="60px">
                  <q-img
                    :src="avatarUrl + user.id"
                    spinner-color="accent"
                    class="fit"
                    ref="avatarImg"
                  >
                    <template v-slot:error>
                      <div class="absolute-full text-white" style="padding: 0;">
                        <q-icon name="account_circle" style="font-size: 60px;"/>
                      </div>
                    </template>
                  </q-img>
                </q-avatar>
              </div>
              <div class="q-pl-lg col-6 row">
                <span class="text-bold col-12">{{ user.name + ' ' + user.lastName }}</span>
                <span class=col-12>
                  {{ $t('distanceOf', { distance: this.$toDistance(user.distance) }) }}
                </span>
              </div>

              <div class="send-request-btn offset-sm-2 col-sm-3 col-12 q-pt-xs-sm q-pt-sm-none">
                <q-btn
                  outline
                  color="positive"
                  class="full-width"
                  :label="$t('sendRequest')"
                  :ref="`button${user.id}`"
                  @click="sendFriendRequest(user)"
                >
                  <q-icon
                    :ref="`buttonIcon${user.id}`"
                    name="mdi-check-circle-outline"
                    class="hidden"
                  />
                </q-btn>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data() {
    return {
      maxZoom: 15,
      minZoom: 10,
      user: {
        id: this.$store.getters['auth/getAccount'].id,
        username: this.$store.getters['auth/getAccount'].username,
      },
      isUpdated: false,
      userList: null,
      isSearching: false,
      searchBtnColor: 'dark-purple',
      searchBtnTextColor: 'white',
      searchBtnText: this.$t('search'),
      dialog: false,
      avatarUrl: `${process.env.API_URL}users/avatar/`,
      foundUsers: [],
    };
  },
  methods: {
    $_updateBtnStyle() {
      this.searchBtnColor = this.isSearching ? 'white' : 'dark-purple';
      this.searchBtnTextColor = this.isSearching ? 'dark-purple' : 'white';
      this.searchBtnText = this.$t(this.isSearching ? 'searching' : 'search');
    },
    onSearchBtnClick() {
      if (this.isSearching) {
        this.$_onCancel();
      } else {
        this.$_onSearch();
      }
    },
    $_onCancel() {
      this.$q.loading.show();
      try {
        this.$store.dispatch('stomp/cancelSearch');
        this.isSearching = false;
        this.$_updateBtnStyle();
      } finally {
        this.$q.loading.hide();
      }
    },
    $_onSearch() {
      if ('geolocation' in navigator) {
        this.$q.loading.show();
        navigator.geolocation.getCurrentPosition((/* position */) => {
          this.$q.loading.hide();
          const searchDelay = 500;
          const headers = this.$getStompHeaders();
          headers.id = `${this.user.username}-search`;

          this.isSearching = true;
          this.$_updateBtnStyle();
          this.$store.dispatch(
            'stomp/subscribe',
            {
              name: 'search',
              destination: '/user/queue/search',
              callback: (message, context) => {
                const body = JSON.parse(message.body);
                const { counter } = context.getters.getSearch;

                context.dispatch('insertResult', body.users);

                if (counter > 2) context.dispatch('finishSearch');

                if (!context.getters.getSearch.cancelled && !context.getters.getSearch.finished) {
                  setTimeout(() => {
                    context.dispatch('incrementSearchCounter');
                    context.dispatch(
                      'send',
                      {
                        destination: '/ws/search',
                        body: context.getters.getSearch.counter * 0.5,
                        headers,
                      },
                    );
                  }, searchDelay);
                } else if (context.getters.getSearch.finished) {
                  this.isSearching = false;
                  this.$_updateBtnStyle();
                  this.foundUsers = context.getters.getSearch.result;
                  this.dialog = true;
                } else if (context.getters.getSearch.cancelled) {
                  this.$warningAlert(this.$t('searchCancelled'));
                }
              },
              headers,
              afterSubscription: (context) => {
                context.dispatch('startSearch');
              },
            },
          );

          this.$store.dispatch(
            'stomp/send',
            {
              destination: '/ws/search',
              body: this.$store.getters['stomp/getSearch'].counter * 0.175,
              headers,
            },
          );
        },
        (error) => {
          console.error(error);
          if (error.code === error.PERMISSION_DENIED) {
            this.$errorAlert(this.$t('permissionGeolocationRequired'));
          }
        }, { enableHighAccuracy: false, maximumAge: Infinity });
      } else {
        this.$errorAlert(this.$t('browserNotSupported'));
      }
    },
    sendFriendRequest(userToSend) {
      const $button = this.$refs[`button${userToSend.id}`][0].$el;
      const $buttonIcon = this.$refs[`buttonIcon${userToSend.id}`][0].$el;
      if (!$button.classList.contains('disabled')) {
        const headers = this.$getStompHeaders();
        headers.id = `${this.user.username}-request`;
        this.$store.dispatch(
          'stomp/send',
          {
            destination: '/ws/request',
            body: { destinationId: userToSend.id },
            headers,
          },
        );

        this.$successAlert(this.$t('requestSent'));
        $button.classList.add('disabled');
        $buttonIcon.classList.remove('hidden');
      }
    },
  },
};
</script>
