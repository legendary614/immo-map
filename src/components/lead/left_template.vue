<template>
  <div>
    <aside id="side-overlay" class="active">
      <div class="side-overlay--inner">
        <button @click="searchSidebarToggle()" class="btn btn-default pull-right side-overlay--button" type="button">
          <i class="fa fa-arrow-left"></i><br>
        </button>
        <div v-bar>
          <div>
          <div class="side-content remove-padding">

            <div >
              <div class="collapse navbar-collapse remove-padding" id="inbox-nav">
                <div class="block">
                  <div class="block-header bg-gray-lighter">
                    <h3 class="block-title">LEAD GENERATOR</h3>
                  </div>
                  <div class="block-content">
                    <ul class="nav nav-pills nav-stacked push">
                      <li>
                        <a v-on:click="show_leads()">
                          <span class="badge pull-right">23</span>
                          <i class="fa fa-exchange fa-x"></i> "Lead" Privatkunden Haus Zürich
                        </a>
                      </li>
                      <li>
                        <a v-on:click="show_leads()">
                          <span class="badge pull-right">14</span>
                          <i class="fa fa-exchange fa-x"></i> "Lead" Hans Meyer Haus Bern
                        </a>
                      </li>
                      <li>
                        <a v-on:click="show_leads()">
                          <span class="badge pull-right">16</span>
                          <i class="fa fa-exchange fa-x"></i> "Lead" Ueli Klein Wohnung Seuzach
                        </a>
                      </li>
                      <li>
                        <a v-on:click="show_leads()">
                          <span class="badge pull-right">16</span>
                          <i class="fa fa-exchange fa-x"></i> "Lead" Haus &gt; CHF 1'000'000 Zürich
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="block">
                  <div class="block-header bg-gray-lighter">
                    <h3 class="block-title">Weitere Leads</h3>
                  </div>

                  <div class="block-content">
                    <ul class="nav nav-pills nav-stacked push">
                      <li>
                        <a v-on:click="show_leads()">
                          <span class="badge pull-right">23</span>
                          <i class="fa fa-exchange fa-x"></i> "Lead" Privatkunden Haus Zürich
                        </a>
                      </li>
                      <li>
                        <a v-on:click="show_leads()">
                          <span class="badge pull-right">14</span>
                          <i class="fa fa-exchange fa-x"></i> "Lead" Hans Meyer Haus Bern
                        </a>
                      </li>

                    </ul>
                  </div>
                </div>
                <div class="block">
                  <div class="block-header bg-gray-lighter">

                    <a><i class="fa fa-filter fa-x"></i> Filter </a>
                  </div>
                  <div class="block-content">
                    <ul class="nav nav-pills nav-stacked push">
                      <li>

                        <a>

                          <i class=""></i> Zu erlediegen
                          <div class="font-w400 text-muted">
                            <small></small>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>

                          <i class=""></i> Telefoniert
                          <div class="font-w400 text-muted">
                            <small></small>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>

                          <i class=""></i> Per Mail kontaktiert
                          <div class="font-w400 text-muted">
                            <small></small>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>

                          <i class=""></i> Weitergeleitet
                          <div class="font-w400 text-muted">
                            <small></small>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>

                          <i class=""></i> Abwarten
                          <div class="font-w400 text-muted">
                            <small></small>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>

                          <i class=""></i> CRM
                          <div class="font-w400 text-muted">
                            <small></small>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
<style scoped lang="scss">
  ::-webkit-scrollbar {
    display: none;
  }

  #side-overlay {
    z-index: 1029 !important;
    left: 60px;
    top: 60px !important;
    overflow-y: visible !important;
    transform: translateX(-100%) !important;
    &.active {
      transform: translateX(0) !important;
      .side-overlay--button i {
        transform: rotate(0);
      }
    }
  }
  .block-content {
    padding: 0px 11px 1px !important;
  }
  .block-content--margin {
    margin-bottom: -20px !important;
  }
  .vb-content {
    height: calc(100vh - 60px) !important;
  }
  .side-overlay--inner {
    position: relative;
  }
  .side-overlay--button {
    border-left: transparent !important;
    height: 80px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(100%);
    i {
      position: relative;
      transition: all .22s ease;
      transform: rotate(180deg);
    }
  }
  a{
    cursor: pointer;
  }
</style>
