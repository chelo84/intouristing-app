<style scoped>
  .btn-search {
    font-size: 24px;
    height: 160px;
    width: 160px;
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
        color="dark-purple"
        text-color="white"
        @click="onSearch"
        ><span class="col-12">{{ $t('search') }}</span>
        <q-spinner-dots ref="search-loading" color="white" size="1em" class="hidden"/>
      </q-btn>
    </div>

    <!-- <div class="row relative-position absolute-bottom">
      <q-btn
        class="col-12"
        color="dark-purple"
        style="padding: 12px;"
        @click="search"
        >{{ $t('search') }}
      </q-btn>
    </div> -->
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
    // const icon = L.icon({
    //   iconUrl: '/statics/icons/map-pin.png',
    //   iconSize: [38, 40],
    //   popupAnchor: [-3, -76],
    //   iconAnchor: [20, 33],
    // });

    return {
      maxZoom: 15,
      minZoom: 10,
      // icon,
      user: {
        id: this.$store.getters['auth/getAccount'].id,
        username: this.$store.getters['auth/getAccount'].username,
        // latlng: L.latLng(0, 0),
      },
      isUpdated: false,
      userList: null,
    };
  },
  methods: {
  //   onLocationFound(e) {
  //     this.user.latlng = e.latlng;

    //     this.updateLocation(e);
    //   },
    //   search() {
    //     const searchDelay = 2000;
    //     const headers = this.$getStompHeaders();
    //     headers.id = `${this.user.username}-search`;

    //     this.$store.dispatch(
    //       'stomp/subscribe',
    //       {
    //         name: 'search',
    //         destination: '/user/queue/search',
    //         callback: (message, context) => {
    //           const body = JSON.parse(message.body);
    //           const { counter } = context.getters.getSearch;
    //           console.log(body);

    //           context.dispatch('insertResult', body.users);

    //           if (counter > 3) context.dispatch('finishSearch');

    //           if (!context.getters.getSearch.cancelled && !context.getters.getSearch.finished) {
    //             setTimeout(() => {
    //               context.dispatch('incrementSearchCounter');
    //               context.dispatch(
    //                 'send',
    //                 {
    //                   destination: '/ws/search',
    //                   body: context.getters.getSearch.counter * 0.175,
    //                   headers,
    //                 },
    //               );
    //             }, searchDelay);
    //           } else if (context.getters.getSearch.finished) {
    //             const UserListClass = Vue.extend(UserList);
    //             this.userList = new UserListClass({
    //               propsData: {
    //                 users: ['something', 'anotherSomething'],
    //               },
    //             });
    //             this.userList.$mount();
    //             console.log('dsadsadsa');
    //           }
    //         },
    //         headers,
    //         afterSubscription: (context) => {
    //           context.dispatch('startSearch');
    //         },
    //       },
    //     );

    //     this.$store.dispatch(
    //       'stomp/send',
    //       {
    //         destination: '/ws/search',
    //         body: this.$store.getters['stomp/getSearch'].counter * 0.175,
    //         headers,
    //       },
    //     );
    //   },
    onSearch() {
      if ('geolocation' in navigator) {
        console.log('dsadasas');
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position);
          const searchDelay = 2000;
          const headers = this.$getStompHeaders();
          headers.id = `${this.user.username}-search`;

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
                  // const UserListClass = Vue.extend(UserList);
                  // this.userList = new UserListClass({
                  //   propsData: {
                  //     users: ['something', 'anotherSomething'],
                  //   },
                  // });
                  // this.userList.$mount();
                  console.log('Finished');
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
