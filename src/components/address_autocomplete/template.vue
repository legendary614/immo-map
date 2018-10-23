<template>
  <div>
    <div class="autocomplete">
      <input type="text" ref="search_element" placeholder="Search..." v-on:keyup="load_data" v-model="model" class="input_search form-control"
             v-on:focus="open_options" v-on:keyup.enter="setData(item_selected)" v-on:blur="close_results" lazy/>
      <svg v-show="loading_data" width="25" height="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
           preserveAspectRatio="xMidYMid" class="lds-rolling">
        <circle cx="50" cy="50" fill="none" ng-attr-stroke="#ccc" ng-attr-stroke-width="1" ng-attr-r="35"
                ng-attr-stroke-dasharray="1" stroke="#e2e1e0" stroke-width="10" r="35"
                stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(12 50 50)">
          <animateTransform attributeName="transform" type="rotate" calcMode="linear"
                            values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s"
                            repeatCount="indefinite"></animateTransform>
        </circle>
      </svg>
      <i v-if="!loading_data && model!=''" class="fa fa-remove search_icon remove" v-on:click="reset_model()"></i>
      <i v-if="!loading_data && model==''" class="fa fa-search search_icon"></i>
      <i v-if="!loading_data && options.length && is_open == false" class="fa fa-angle-down down"
         aria-hidden="true" v-on:click="show_results"></i>

      <div class="autocomplete__box" v-show="is_open && options.length">
        <ul>
          <li  v-for="(item, index) in options" :key="index"
              :class='{"active-item": currentItem === index}'>
            <div class="ty"><slot name="front_icon" v-bind:item="item"></slot></div>

            <span  name="type" v-on:mousedown="setData(item);" class="itm">

              <slot name="history" v-bind:item="item"></slot>
            <slot name="bookmarks" v-bind:item="item"></slot>
            <slot name="documents" v-bind:item="item"></slot>

              <span v-html="item[item_highlighted]"></span>
            </span>
            <div class="prh"><slot class="products" name="products" v-bind:item="item"></slot></div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<style lang="scss">
  .prh{
    position: absolute;
    right: 0;
    top: 1px;
  }
  .itm{
    float: left;
    width: 93%;
  }
  .ty{
    float: left;
    width: 10%;
  }
  .autocomplete {
    position: relative;
    .search_icon {
      position: absolute;
      right: 9px;
      top: 6px;
      font-size: 22px;
      z-index: 3;
    }
    .search_icon.remove{
      font-size: 12px;
      top: 13px;
      cursor: pointer;
    }
    .search_icon.remove:hover{
      color: #777777;
    }
    .down {
      position: absolute;
      right: 33px;
      top: 2px;
      font-size: 30px;
      z-index: 5;
      cursor: pointer;
    }
    .down:hover {
      color: #000;
    }

    .autocomplete__box {
      background: #fff;
      border: 1px solid #ebebeb !important;
      width: 100%;
      z-index: 2132398123;
      position: absolute;
      top:33px;

      ul {
        padding: 12px;
        padding-bottom: 0px;
        list-style: none;
        li {
          border-bottom: 1px solid #fafafa;
          font-size: 14px;
          position: relative;
          float: left;
          width: 100%;
          em {
            color: black;
          }
        }
        li:last-child {
          border: none;
          padding-bottom: 7px;
        }
        li:hover {
          cursor: pointer;
          border-bottom: 1px solid #ebebeb;
        }
      }
      .active-item {
        background-color: #f7f7f7;
      }
    }
    .lds-rolling {
      position: absolute;
      right: 8px;
      z-index: 4;
      top: 5px !important;
    }
  }
  .ac .input_search {
      padding-right: 20px !important;
  }

</style>
