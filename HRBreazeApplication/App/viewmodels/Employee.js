﻿//Employee.js
define([
  'services/datacontext',
  'durandal/plugins/router'],
  function (datacontext, router) {
      var entities = ko.observableArray();

      //#region Internal methods for paging;
      var currentPage = ko.observable();
      var totalPages = ko.observable();
      var totalrecords = ko.observable();
      var isBusy = ko.observable(false);

      var orderby = ko.observable('id');
      var sortOrder = ko.observable('asc');
      var filterBy = [];
      var entity = 'Employee';

      var columns = [{ name: 'ID', index: 'id', sortable: true, width: '10%' },
                     { name: 'Name', index: 'name', sortable: true, width: '20%' },
                     { name: 'Salary', index: 'salary', sortable: true, width: '10%' },
                     { name: 'Email', index: 'email', sortable: true, width: '10%' },
                     { name: 'Phone', index: 'phone', sortable: true, width: '10%' },
                     { name: 'Department', index: 'departmentId', sortable: true, width: '15%' },
                     { name: 'Created By', index: 'created_By', sortable: true, width: '12%' },
                     { name: 'Updated By', index: 'updated_By', sortable: true, width: '13%' }
      ];

      //Search Controls
      var fs_name = ko.observable();
      var fs_phone = ko.observable();
      var fs_departmentid = ko.observable();


      var departments = ko.observableArray();

      canPrev = ko.computed(function () {
          return currentPage() > 1;
      });

      canNext = ko.computed(function () {
          return currentPage() < totalPages();
      });

      nextPage = function () {
          currentPage(currentPage() + 1);
          return getdata();
      };

      previousPage = function () {
          currentPage(currentPage() - 1);
          return getdata();
      };

      firstPage = function () {
          currentPage(1);
          return getdata();
      };

      lastPage = function () {
          currentPage(totalPages());
          return getdata();
      };

      var viewAttached = function (view) {
          bindEventToList(view, '.session-brief', gotoDetails);
      };

      var gotoDetails = function (selectedRecord) {
          if (selectedRecord && selectedRecord.id()) {
              var url = "#/EmployeeDetails/" + selectedRecord.id();
              router.navigateTo(url);
          }
      }

      var bindEventToList = function (rootSelector, selector, callback, eventName) {
          var eName = eventName || 'click';
          $(rootSelector).on(eName, selector, function () {
              var entity = ko.dataFor(this);
              callback(entity);
          });
      };

      var gotoAddNew = function () {
          var url = "#/EmployeeDetails/0";
          router.navigateTo(url);
      };

      var sort = function (column) {
          orderby(column.index);
          sortOrder(sortOrder() === 'asc' ? 'desc' : 'asc');
          currentPage(1);
          return getdata();
      };

      var viewSearch = function () {
          $('#advancedSearch').slideToggle();
      };

      var search = function () {
          currentPage(1);
          var Name = $('#txtName').val();
          var Phone = $('#txtPhone').val();
          var DepartmentId = $('#dropdownDepartmentId').val();
          var op = breeze.FilterQueryOp;
          var preds = [];
          var p = new breeze.Predicate('id', op.NotEquals, null);
          filterBy = [];

          if (Name != null && Name != '' && Name != ' ') {
              var p1 = new breeze.Predicate("name", op.Contains, Name);
              preds.push(p1);
          }

          if (Phone != null && Phone != '' && Phone != ' ') {
              var p1 = new breeze.Predicate("phone", op.Contains, Phone);
              preds.push(p1);
          }

          if (DepartmentId != null && DepartmentId != '' && DepartmentId != 0) {
              var p1 = new breeze.Predicate("departmentId", "==", parseInt(DepartmentId));
              preds.push(p1);
          }

          if (preds != null && preds != '') {
              filterBy = p.and(preds);
          } else {
              filterBy = p;
          }
          getdata();
          viewSearch();
      };


      var clear = function () {
          $('#txtName').val('').change();
          $('#txtPhone').val('').change();
          $('#dropdownDepartmentId').val('').change();
          $('#txtName').focus();

          search();
      };
      var initLookups = function () {
          departments(datacontext.lookups.departments);
      };

      //#endregion

      var initialized = false;
      var vm = {
          activate: activate,
          title: 'Employees',
          entities: entities,
          columns: columns,
          refresh: refresh,
          orderby: orderby,
          sortOrder: sortOrder,
          sort: sort,
          currentPage: currentPage,
          totalPages: totalPages,
          canPrev: canPrev,
          canNext: canNext,
          nextPage: nextPage,
          previousPage: previousPage,
          firstPage: firstPage,
          lastPage: lastPage,
          totalrecords: totalrecords,
          isBusy: isBusy,
          gotoAddNew: gotoAddNew,
          viewAttached: viewAttached,
          viewSearch: viewSearch,
          search: search,
          clear: clear,
          departments: departments,
          fs_name: fs_name,
          fs_phone: fs_phone,
          fs_departmentid: fs_departmentid
      };
      return vm;

      //#region Internal Methods
      function activate() {
          if (!initialized) {
              currentPage(1);
          }
          initialized = true;
          initLookups();
          return getdata(true);
      }


      function getdata(forceLocally) {
          return datacontext.getFilterBy(entities, totalPages, currentPage() - 1, totalrecords, orderby, sortOrder, entity, isBusy, filterBy, forceLocally, 'Employees');
      }

      function refresh() {
          clear();
          viewSearch();
      }

      //#endregion
  });