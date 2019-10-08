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
      <l-map ref="map" :maxZoom=zoom setView="true">
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>

        <l-moving-marker
          :key="user.id"
          :lat-lng="user.latlng"
          :duration="2000"
          :icon="icon">
          <l-popup content="You are here"/>
        </l-moving-marker>

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
import { LMap, LTileLayer, LPopup } from 'vue2-leaflet';
import L from 'leaflet';
import LMovingMarker from 'vue2-leaflet-movingmarker';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'PageIndex',
  components: {
    LMap,
    LTileLayer,
    LPopup,
    LMovingMarker,
  },
  mounted() {
    // this.$refs.map.mapObject.on('locationfound', this.onLocationFound);
    // this.$refs.map.mapObject.locate({ setView: true, watch: true, maxZoom: 18 });
    if (!navigator.geolocation) {
      console.error('Not supported');
    } else {
      navigator.geolocation.getCurrentPosition(this.success, this.error);
    }
    this.icon = L.icon({
      iconUrl: '/statics/icons/map-pin.png',
      iconSize: [38, 40], // size of the icon
      popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });
  },
  data() {
    return {
      zoom: 3,
      icon: null,
      user: {
        id: this.$store.getters['auth/getAccount'].id,
        latlng: null,
      },
    };
  },
  methods: {
    onLocationFound(e) {
      L.marker(e.latlng, { icon: 'idk' }).addTo(this.$refs.map.mapObject)
        .bindPopup('You are here').openPopup();
      // L.circle(e.latlng, 1).addTo(this.$refs.map.mapObject);
    },
    success(position) {
      this.user.latlng = L.LatLng(position.coords.latitude, position.coords.longitude);
    },
    error() {
      console.log('error');
    },
  },
};
</script>
