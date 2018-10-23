import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./Employees.vue";
import Paginate from "vuejs-paginate";
import EmployeeProfile from "../../components/employeeProfile";
import * as agencyModule from "../../store/modules/agencies";
import * as employeeModule from "../../store/modules/employees";
import { EmployeeModel, IEmployeeModel, IEntitySearchResult, IEmployeeLightModel } from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import * as globalState from "../../store/modules/globalStates_";

@Component({
  mixins: [template],
  components: {
    EmployeeProfile,
    Paginate
  }
})
export default class Employees extends Vue {

  employees: IEntitySearchResult<IEmployeeLightModel> = null;
  employee: IEmployeeModel = new EmployeeModel;
  newEmployee: EmployeeModel = new EmployeeModel();

  activeNo: number = 0;
  inActiveNo: number = 0;
  pages: number = 0;
  employeesNo: number = 0;
  search_for: string = "";
  search_loading: boolean = false;
  search_finished: boolean = false;
  addingEmployee: boolean = false;
  perPage: number = 10;
  pageNum: number = 0;
  selectedIndex: number = -1;
  loading: boolean = false;
  $refs: {
    employeesPagination: any
  };

  created() {
    this.loadEmployees();
  }

  closeEmployee() {
    this.employee = new EmployeeModel();
    globalState.commitProfileRightSidebar(store, false);
    this.selectedIndex = -1;
  }
  closeNewEmployee() {
    this.addingEmployee = false;
    globalState.commitProfileRightSidebar(store, false);
    this.employee = new EmployeeModel();
  }

  loadEmployees() {
    let self = this;
    self.loading = true;
    let agency = agencyModule.getAgency(store);
    let pagination = {
      pageSize: this.perPage,
      page: 0
    };
    employeeModule.dispatchGetEmployees(store, {agencyId: agency.id, pagination: pagination, name: "", role: 0}).then(() => {

      let res = employeeModule.getEmployees(store);
      this.employees = res;
      this.pages = res.pageCount;
      this.activeNo = res.entityCounts.enabledCount;
      this.inActiveNo = res.entityCounts.totalCount - this.activeNo;
      self.loading = false;
      if (!this.search_for) {
        setTimeout(function () {
          self.search_loading = false;
        }, 500);
      }
    });

  }

  @Watch("perPage")
  reload_with_new_number() {
    this.nextPage(this.pageNum, undefined);
  }

  nextPage(pageNum: number, index: number) {
    this.loading = true;
    if (pageNum === 0) {
      this.pageNum = 0;
    } else {
      this.pageNum = pageNum - 1;
    }
    if (this.search_for != "") {
      return this.searchFor(this.pageNum);
    }

    this.$refs.employeesPagination.selected = this.pageNum;

    setTimeout(() => {
      let agency = agencyModule.getAgency(store);
      let pagination = {
        pageSize: this.perPage,
        page: 0
      };
      employeeModule.dispatchGetEmployees(store, {agencyId: agency.id, pagination: pagination, name: "", role: 0})
        .then(() => {
          let res = employeeModule.getEmployees(store);
          this.employees = res;
          this.pages = res.pageCount;
          this.loading = false;
        })
        .then(() => {
          if (index !== undefined) {
            this.getEmployee(index);
          }
        });
    }, 1000);
  }

  getEmployee(index: number) {
    this.addingEmployee = false;
    this.selectedIndex = index;
    let id = this.employees.items[this.selectedIndex]["id"];
    employeeModule.dispatchGetEmployee(store, id).then(() => {
      this.employee = employeeModule.getEmployee(store);
      this.employees[index] = this.employee;
      globalState.commitProfileRightSidebar(store, true);
    });
  }

  nextItem (index: number, next: boolean) {
    this.selectedIndex = index;
    if (next) {
      if (this.perPage - 1 === index) {
        let pgNum = this.pageNum;
        pgNum += 2;
        this.nextPage(pgNum, 0);
      } else {
        this.selectedIndex++;
      }
    } else {
      if (index === 0) {
        let pgNum = this.pageNum;
        pgNum--;
        this.nextPage(pgNum, this.perPage - 1);
      } else {
        this.selectedIndex--;
      }
    }
    this.getEmployee(this.selectedIndex);
  }


  searchFor(pageNum: number) {
    let self = this;
    self.search_finished = false;
    this.search_loading = true;

    let pNum = 0;
    if (pageNum > 0) {
      pNum = pageNum - 1;
    }

    let searchQuery = {
      name: self.search_for,
      pagination: {
        page: pNum,
        pageSize: this.perPage
      },
      agencyId: agencyModule.getAgency(store).id,
      role: 0
    };
    if (self.search_for) {

      employeeModule.dispatchSearchEmployee(store, searchQuery).then(() => {
        setTimeout(function () {
          let res = employeeModule.getSearchResults(store);
          self.employees = res;
          self.pages = res.pageCount;
          self.search_loading = false;
          self.search_finished = true;
        }, 500);
      }).catch(e => {
        console.log(e);
      });

    } else {
      self.loadEmployees();
    }
  }

  change_perPage(i: number) {
    // this.search_for = "";
    this.perPage = i;
    this.pageNum = 0;
  }

  clear_search() {
    this.search_for = "";
    this.search_finished = false;
    this.nextPage(0, -1);
  }

  addEmployee() {
    this.newEmployee = new EmployeeModel();
    this.addingEmployee = true;
    globalState.commitProfileRightSidebar(store, true);
  }

  checkEnd (index: number) {
    let idx = index + 1;
    let pgNum = this.pageNum + 1;
    if (this.employees.items[idx] || pgNum !== this.pages) {
      return true;
    } else {
      return false;
    }
  }
  getRole(role: number) {
    switch (role) {
      case 0:
      return "None";
      case 1:
      return "Admin";
      case 2:
      return "Manager";
    }
  }
}
