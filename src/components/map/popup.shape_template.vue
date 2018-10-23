<template>
  <div class='block' style='padding: 20px'><p style='font-size: 14px'>Please enter shape name:</p> <input
    class='form-control' v-model="shapeModelName"/> <br/>
    <a class='btn btn-primary pull-left' v-on:click="updateShapeName" v-if="shapeModelName != ''"> Update</a>
    <a class='btn btn-default pull-right' v-on:click="closePopup">Cancel</a></div>
</template>
