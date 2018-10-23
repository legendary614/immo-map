<template>
<div >
    <object-component @closeRightSidebar="closeObjectRightSidebar()" v-if="selectedItem.title != undefined" :selectedIndex="selectedIndex" :item="selectedItem" :pageNum="page_num + 1" @selectItem="selectItem"></object-component>
    <main id="main-container" @click="selectedIndex = -1">
        <div v-bar v-if="searchResults.items != undefined" style="position: absolute; z-index: 1">
            <div class="block"  id="scrollDiv">
                <div class="content bg-gray-lighter">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="nav-header pull-left result-counter">
                                Ads <strong>{{ page_num + 1 }}</strong> - <strong>{{ searchResults.items.length }}</strong> of <strong>{{ getResults() | currency }}</strong> ({{ searchResults.totalCount | currency }}) / <strong>{{ allAds | currency }}</strong>
                            </div>
                            <div class="text-center margin-r-250">
                                <paginate
                                        ref="topPagination"
                                        :page-count="pages"
                                        :page-range="3"
                                        :margin-pages="2"
                                        :click-handler="nextPage"
                                        :prev-text="'Prev'"
                                        :next-text="'Next'"
                                        :container-class="'pagination'"
                                        :page-class="'page-item'">
                                </paginate>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="block-content block-content-full bg-gray-lighter" :class="{'greyOut': loading}">
                    <div class="row items-push">
                        <a class="list-item block block-link-hover3" :class="{'selected': selectedIndex === index}" v-for="(item, index) in searchResults.items" :key="index" @click.stop="selectItem(index)">
                            <list-item :item="item"></list-item>
                        </a>
                        <div class="col-md-12">
                            <div class="form-material text-center">
                                <paginate
                                        ref="bottomPagination"
                                        :page-count="pages"
                                        :page-range="3"
                                        :margin-pages="2"
                                        :click-handler="nextPage"
                                        :prev-text="'Prev'"
                                        :next-text="'Next'"
                                        :container-class="'pagination'"
                                        :page-class="'page-item'">
                                </paginate>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="loading" class="spinner">
                    <i class="fa fa-spinner fa-spin big_spinner"></i>
                </div>
            </div>
        </div>
        <div v-else style="position: absolute; z-index: 1">
            No results
        </div>
    </main>
</div>
</template>
<style lang="scss" scoped>
.pagination{
    margin-top: 0 !important;
}
.block {
    font-size: 13px !important;
}
.block-content {
    padding-top: 30px !important;
}
.list-item {
    list-style: none;
    margin-bottom: 30px;
    cursor: pointer;
    width: calc(100% - 55px);
    margin-left: 42px;
  padding: 20px;
}
.greyOut {
    position: fixed;
    opacity: 0.2;
    width: calc(100% - 60px);
}
.spinner {
    position: absolute;
    left: 50%;
}
a {
    float: left;
    width: 100%;
}
.result-counter {
    background-color: white;
    padding: 7px;
    margin-left: 15px;
}
.selected {
  -webkit-transform: translateY(-1px);
  -ms-transform: translateY(-1px);
  transform: translateY(-1px);
  -webkit-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);
}
</style>
<style scoped>
@media screen and (max-width: 991px) {
    a {
        display: inline;
    }
}
  .big_spinner{
    font-size: 50px !important; margin-top: 200px;
  }
</style>
