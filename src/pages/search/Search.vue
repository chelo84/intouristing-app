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
    font-weight: 600;
    font-size: 12px;
    color: red;;
  }

  .found-user {
    padding: 14px;
  }
  .found-user:hover {
    background-color: #4b367b2e;
    cursor: pointer;
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
        <small :class="isSearching ? 'search-cancel-text' : 'hidden'">
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
      <q-card class="">
        <q-bar class="bg-dark-purple">
          <q-space/>

          <q-btn dense flat icon="close" text-color="white" v-close-popup>
            <q-tooltip content-class="bg-dark-purple text-white">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">;Users found</div>
        </q-card-section>

        <q-card-section class="found-user" v-for="user in foundUsers" v-bind:key="user.id">
          <div class="flex">
            <div ref="userImg" >
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
            <div ref="userName" class="q-pl-lg row">
              <span class="text-bold col-12">{{ user.name + ' ' + user.lastName }}</span>
              <span class=col-12>{{ $t('radiusOfMeters', { distance: user.distance }) }} </span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style>
</style>

<script>
// import Vue from 'vue';
// import UserList from '../components/UserList';

export default {
  name: 'PageIndex',
  mounted() {
    // this.$refs.map.mapObject.on('locationfound', this.onLocationFound);
    // this.$refs.map.mapObject.locate({ setView: true, watch: true });
  },
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
      foundUsers: [this.$store.getters['auth/getAccount']],
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
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position);
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
                console.log(body);

                context.dispatch('insertResult', body.users);

                if (counter > 3) context.dispatch('finishSearch');

                if (!context.getters.getSearch.cancelled && !context.getters.getSearch.finished) {
                  setTimeout(() => {
                    context.dispatch('incrementSearchCounter');
                    context.dispatch(
                      'send',
                      {
                        destination: '/ws/search',
                        body: context.getters.getSearch.counter * 0.175,
                        headers,
                      },
                    );
                  }, searchDelay);
                } else if (context.getters.getSearch.finished) {
                  this.$infoAlert(this.$t('Search finished'));
                  this.isSearching = false;
                  this.$_updateBtnStyle();
                  this.foundUsers = context.getters.getSearch.result;
                  this.dialog = true;
                  // const UserListClass = Vue.extend(UserList);
                  // this.userList = new UserListClass({
                  //   propsData: {
                  //     users: ['something', 'anotherSomething'],
                  //   },
                  // });
                  // this.userList.$mount();
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
          if (error.code === error.PERMISSION_DENIED) {
            this.$errorAlert('Permission for geolocation is required!');
          }
        }, { enableHighAccuracy: true, timeout: 3000, maximumAge: Infinity });
      } else {
        this.$errorAlert('Browser not supported!');
      }
    },
  },
};
</script>
