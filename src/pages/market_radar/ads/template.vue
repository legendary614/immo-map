<template>
  <div>
    <div>
      <left></left>
      <amap></amap>
      <right v-if="marketRadarSearchedAddress.name != undefined"></right>
    </div>
  </div>
</template>
