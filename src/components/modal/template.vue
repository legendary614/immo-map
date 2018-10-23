<template>
  <div class="modal-open" v-if="showModal">
    <div class="modal fade in display_block" id="modal-fadein">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="block block-themed block-transparent remove-margin-b">
            <div class="block-header bg-primary-dark">
              <ul class="block-options">
                <li>
                  <slot name="close"></slot>
                </li>
              </ul>
              <slot name="title"></slot>
            </div>
            <div class="block-content">
              <p>
                <slot name="text"></slot>
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <slot name="slot_actions"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .modal{
    background-color: rgba(0,0,0,.5);
  }
</style>
