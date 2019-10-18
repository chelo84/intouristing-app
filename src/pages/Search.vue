<template>
  <q-page class="flex ">

    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />

    <div style="height: calc(100vh - 95px); width: 100%;">
      <l-map ref="map" :worldCopyJump="true" >
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" :noWrap="true"></l-tile-layer>

        <l-moving-marker
          :ref="user.id"
          :duration="2000"
          :lat-lng="user.latlng"
          :icon="icon"
          opacity="0"
        />

      </l-map>
    </div>

    <div class="row relative-position absolute-bottom">
      <q-btn
        class="col-12"
        color="dark-purple"
        style="padding: 12px;"
        @click="search"
        >{{ $t('search') }}
      </q-btn>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { LMap, LTileLayer } from 'vue2-leaflet';
import L from 'leaflet';
import LMovingMarker from 'vue2-leaflet-movingmarker';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'PageIndex',
  components: {
    LMap,
    LTileLayer,
    LMovingMarker,
  },
  mounted() {
    this.$refs.map.mapObject.on('locationfound', this.onLocationFound);
    this.$refs.map.mapObject.locate({ setView: true, watch: true });
  },
  data() {
    const icon = L.icon({
      iconUrl: '/statics/icons/map-pin.png',
      iconSize: [38, 40],
      popupAnchor: [-3, -76],
      iconAnchor: [20, 33],
    });

    return {
      maxZoom: 15,
      minZoom: 10,
      icon,
      user: {
        id: this.$store.getters['auth/getAccount'].id,
        username: this.$store.getters['auth/getAccount'].username,
        latlng: L.latLng(0, 0),
      },
      isUpdated: false,
    };
  },
  methods: {
    onLocationFound(e) {
      this.user.latlng = e.latlng;

      this.updateLocation(e);
    },
    updateLocation(e) {
      if (!this.isUpdated) {
        const headers = this.$store.getters['stomp/getHeaders'];
        const userPosition = {
          user: this.user.id,
          latitude: e.latitude,
          longitude: e.longitude,
        };
        headers.id = `${this.user.username}-update-position`;

        this.$store.dispatch(
          'stomp/send',
          {
            destination: '/ws/update-position',
            body: JSON.stringify(userPosition),
            headers,
          },
        );

        this.isUpdated = true;
        setTimeout(() => { this.isUpdated = false; }, 5000);
      }
    },
    search() {
      const searchDelay = 2000;
      const headers = this.$store.getters['stomp/getHeaders'];
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
                console.log(context.getters.getSearch.counter);
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
              console.log('finished');
              console.log(context);
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
  },
};
</script>
