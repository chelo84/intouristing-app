<template>
  <q-page class="flex flex-center">

    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />

    <div style="height: 500px; width: 100%;">
      <l-map ref="myMap" :zoom=zoom :center=center>
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
      </l-map>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { LMap, LTileLayer } from 'vue2-leaflet';
// import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'PageIndex',
  components: {
    LMap, LTileLayer,
  },
  mounted() {
  },
  data() {
    return {
      zoom: 15,
      center: [47.413220, -1.219482],
    };
  },
  methods: {

  },
};
</script>
