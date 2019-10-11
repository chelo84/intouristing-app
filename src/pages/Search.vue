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
        />

      </l-map>
    </div>

    <div class="row relative-position absolute-bottom">
      <q-btn class="col-12" color="dark-purple" style="padding: 12px;">{{ $t('search') }}</q-btn>
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
    console.log(this.$store.dispatch('stomp/connect'));

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
        latlng: L.latLng(10.23, 13.3),
      },
      isUpdated: false,
    };
  },
  methods: {
    onLocationFound(e) {
      this.user.latlng = e.latlng;

      this.updateLocation();
    },
    updateLocation() {
      if (!this.isUpdated) {
        console.log(this.$stompClient);
        this.isUpdated = true;

        setTimeout(() => { this.isUpdated = false; }, 5000);
      }
    },
  },
};
</script>
