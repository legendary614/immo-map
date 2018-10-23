<template>
    <div class="map-wrapper" >
      <mapbox access-token="pk.eyJ1IjoiYXNjYXJpeCIsImEiOiJjajQ4OGV0bXEwNW5iMzJwY2RpYmpzam5mIn0.V1p4AFPhf7Rhf3qW0jeovg"
        :map-options="{style: 'mapbox://styles/ascarix/cjiyn2g07ak6v2rqop62fgw5o',
        center: [8.542803, 47.371425],
        zoom: 16,
        pitch: 0,
        bearing: 0,
        container: 'map'}"
        @map-init="mapInitialized" @map-load="loaded" :nav-control="{show: false}">
        </mapbox>
      <div class="switch_style mapboxgl-ctrl-group mapboxgl-ctrl" v-show="mapLoaded" v-bind:class="{'on_left': object_window}">
        <button class="mapbox-gl-draw_ctrl-draw-btn" v-on:click="zoom_in"><i class="fa fa-plus"></i></button>
        <button class="mapbox-gl-draw_ctrl-draw-btn" v-on:click="zoom_out"><i class="fa fa-minus"></i></button>
        <button v-bind:class="{active: d2}" class="mapbox-gl-draw_ctrl-draw-btn" v-on:click="set_style('mapbox://styles/ascarix/cjiyn2g07ak6v2rqop62fgw5o', true)">2D</button>
        <button v-bind:class="{active: d3}" class="mapbox-gl-draw_ctrl-draw-btn" v-on:click="set_style('mapbox://styles/ascarix/cjizrcvl50v4w2rnxkdzjr0sp', false)">3D</button>
        <button v-show="show_draw_tools" id="circle" class="mapbox-gl-draw_ctrl-draw-btn draw_tools" v-on:click="draw_shape('draw_radius')"><i class="fa fa-circle-o"></i></button>
        <button v-show="show_draw_tools" class="mapbox-gl-draw_ctrl-draw-btn draw_tools" v-on:click="draw_shape('draw_polygon')"><i class="fa fa-pencil"></i></button>
        <!--<button class="mapbox-gl-draw_ctrl-draw-btn" v-on:click="delete_draw()"><i class="fa fa-trash"></i></button>-->
        <div v-show="show_draw_tools" class="mapboxgl-ctrl-group mapboxgl-ctrl draw_tools">
          <color-picker ref="colorpicker" :setColor="setColor"></color-picker>
        </div>
      </div>

      <modal ref="modal" v-show="show_modal" v-bind:modalShow="show_modal">

        <template slot="close">
          <button type="button" v-on:click="show_modal = false;"><i class="si si-close"></i>
          </button>
        </template>
        <template slot="title">
          <h3 class="block-title">Please enter shape name</h3>
        </template>

        <template slot="text">
          <span><input type="text" class="form-control" v-model="shape_name"/></span>
        </template>
        <template slot="slot_actions">

          <button class="btn btn-sm btn-default" type="button" data-dismiss="modal" v-on:click="show_modal = false;shape_name=''">Cancel
          </button>

          <button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"
                  v-on:click="shapeNameEditFinished = true; show_modal = false;"><i class="fa fa-check"></i> Ok
          </button>
        </template>
      </modal>

    </div>

</template>

<style scoped>
  .active{
    background-color: #1d86ce;
    color: #fff;
  }

.map-wrapper {
    top: 61px;
    left: 60px;
    width: calc(100% - 60px);
    height: calc(100% - 61px);
    position: fixed;
}
.resized {
  width: calc(100% - 650px) !important;
}
#map {
    width: 100%;
    height: 100%;
    position: relative;
}
@media screen and (max-width: 991px) {
    .map-wrapper {
        top: 61px;
        left: 0;
        height: calc(100% - 61px);
        width: 100%;
    }
}
</style>

<style lang="scss">
  .leaflet-popup-content-wrapper {
    border-radius: 0;
  }
  .leaflet-popup-content{
    margin: 0;
    overflow: hidden;
  }
  .green{
    color: green;
  }
  .blue{
    color: cornflowerblue;
  }
  .marker_title {
    padding: 12px;
    font-size: 18px;
    text-transform: uppercase;
    border-bottom: 2px solid #ebebeb;
    float: left;
    width: 100%;
    span:first-child{
      float: left;
    }
    span:last-child{
      float: right;
    }
  }
  .marker_content{
    padding: 12px;
    text-transform: uppercase;
    border-bottom: 2px solid #ebebeb;
    float: left;
    width: 100%;
    font-size: 18px;

    span{
      font-size: 13px;
      color: #ccc;
    }
    div:first-child{
      float: left;
    }
    div:last-child{
      float: right;
      text-align: right;
    }
  }
  .location{
    padding: 12px;
    text-transform: uppercase;
    float: left;
    width: 100%;
    span:last-child{
      color: #ccc;
    }
  }
  .marker_image{

    height: 157px;
    overflow: hidden;
    border-bottom: 1px solid #ccc;
    img{
      width: 100%;
    }
  }
  .mapboxgl-popup {
    top: 25px !important;
  }
  .mapboxgl-popup-content{
    width: 300px;
  }
  .mapboxgl-popup-close-button{
    background: #d2695c;
    color: #fff;
  }
  .mapboxgl-marker:hover{
    cursor: pointer;
  }
  .mapboxgl-ctrl-top-left.right{
    left: 358px;
  }
  .mapboxgl-ctrl-top-right.move_right{
    right: 660px;
  }
  .mapboxgl-ctrl-top-left.l{
    left: 40px;
  }
  .switch_style{
    position: absolute; right: 10px; top: 7px; z-index: 1
  }
  .on_left{
    transition: all .28s ease;
    right: 655px !important;
  }
  .on_left.first{
    top: 84px !important;
    right: 0px !important;
  }
  .on_left.second{
    top: 89px !important;
  }

  .first{
    top: 84px !important;
    right: -6px !important;
  }
  .second{
    top: 89px !important;
    right: 4px;
  }

  .mapboxgl-ctrl-top-right.on_left{
    .mapboxgl-ctrl {
      margin-right: 0px;
    }
  }
  .modal-dialog{
    margin-top: 100px;
  }
  .mapboxgl-popup-content{
    padding: 0 !important;
  }

</style>
