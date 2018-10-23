<template>
  <div class="m">
    <div class="mouse-pointer w30h30" v-bind:style="style" v-on:click="showAllColors ? showAllColors =false:showAllColors =true"></div>
    <div  v-bar v-if="showAllColors" class="w30">
        <div>
          <div class="pull-right" v-for="e in get_color('red')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" style="float: left" v-for="e in get_color('pink')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('purple')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('deeppurple')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('indigo')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('blue')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('lightblue')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('cyan')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('teal')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('green')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('lightgreen')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('lime')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('yellow')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('amber')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('orange')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('deeporange')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('brown')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('grey')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
          <div class="pull-left" v-for="e in get_color('bluegrey')" v-bind:key="e" v-bind:style="get_style(e)" v-on:click="setColor(e)"></div>
        </div>
    </div>
  </div>
</template>
<style lang="scss">
  .m {
    .vb-dragger-styler{
      display: none !important;
    }
  }
  .w30h30{
    width: 30px; height: 30px;
  }
  .w30{
    width: 30px;
  }
</style>
