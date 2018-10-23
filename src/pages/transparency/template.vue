<template>
  <div>
    <div>
      <left-sidebar></left-sidebar>
      <transparency-map :address="address"></transparency-map>
      <right-sidebar v-show="object_window"></right-sidebar>
      <div class="legend" v-show="object_window">
        <i class="fa fa-square color-grey"></i> Property
        <i class="fa fa-square color-red"></i> Building
      </div>
    </div>
  </div>
</template>
<script>
</script>
<style>
  .legend{
    width: 100%; position: fixed;
    background: #fff;
    bottom: 0;
    left: 381px;
    padding-left: 8px;
    height: 30px;
    padding-top: 6px;
    z-index: 1;
  }
  .loader {
    width: 100%; position: fixed; top: 0; left: 0; height: 4px; z-index: 9312312;
    overflow: hidden;
    background-color: #ddd;
  }
  .loader:before{
    display: block;
    position: absolute;
    content: "";
    left: -200px;
    width: 200px;
    height: 4px;
    background-color: #2980b9;
    animation: loading 2s linear infinite;
  }

  @keyframes loading {
    from {left: -200px; width: 30%;}
    50% {width: 30%;}
    70% {width: 70%;}
    80% { left: 50%;}
    95% {left: 120%;}
    to {left: 100%;}
  }
</style>
