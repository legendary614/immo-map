<template>
  <div class="bg-gray-light">
    <left></left>
    <overview-list v-if="showLeads"></overview-list>
    <div v-if="!showLeads" class="empty"
         v-bind:class="{'margin-l-0': !$store.getters['globalStates_/isSearchSidebarOpened']}">
      <i class="fa fa-envelope-o placeholder_email"></i>
    </div>
  </div>
</template>
<style scoped>
  .empty {
    margin-top: 300px;
    margin-left: 300px;
    height: 600px;
    text-align: center;
    background: transparent;
    background: whitesmoke;
  }

  .placeholder_email {
    font-size: 140px;
    color: #ccc;
  }
</style>
