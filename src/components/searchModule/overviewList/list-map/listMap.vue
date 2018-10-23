<template>
   <mapbox access-token="pk.eyJ1IjoiYXNjYXJpeCIsImEiOiJjajQ4OGV0bXEwNW5iMzJwY2RpYmpzam5mIn0.V1p4AFPhf7Rhf3qW0jeovg"
        :map-options="{style: 'mapbox://styles/mapbox/light-v9',
        zoom: 16,
        pitch: 0,
        bearing: 0,
        container: 'map'}"
        @map-init="mapInitialized" @map-load="loaded">
    </mapbox>
</template>
<style scoped>
#map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
}
</style>
