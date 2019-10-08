<template>
  <q-page class="flex ">

    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />

    <div style="height: calc(100vh - 87px); width: 100%;">
      <l-map ref="map" :zoom=zoom :center=center setView="true">
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
      </l-map>
    </div>

    <div class="row relative-position absolute-bottom">
      <q-btn class="col-12" color="dark-purple">{{ $t('search') }}</q-btn>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { LMap, LTileLayer } from 'vue2-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'PageIndex',
  components: {
    LMap, LTileLayer,
  },
  mounted() {
    this.$refs.map.mapObject.on('locationfound', this.onLocationFound);
    this.$refs.map.mapObject.locate({ setView: true, watch: true, maxZoom: 18 });
  },
  data() {
    return {
      zoom: 15,
      center: [47.413220, -1.219482],
    };
  },
  methods: {
    onLocationFound(e) {
      // const radius = e.accuracy / 2;
      const mapPinIcon = L.icon({
        iconUrl: '/statics/icons/map-pin.png',
        iconSize: [38, 40], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
      });
      L.marker(e.latlng, { icon: mapPinIcon }).addTo(this.$refs.map.mapObject)
        .bindPopup('You are here').openPopup();
      // L.circle(e.latlng, 1).addTo(this.$refs.map.mapObject);
    },
  },
};
</script>
