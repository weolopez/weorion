'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngResource']).
        controller('partial2', ['$scope', '$resource', function($scope, $resource) {
        var data = $resource('serviceEMU/server.json');
        $scope.rawdata = data.get();
        // $scope.offer = $scope.rawdata[0];
    }])
        .controller('preview', ['$scope', 'Entity', 'tdataRecommendation', function($scope, Entity, tdataRecommendation) {
        $scope.size = Entity['selectedSize'];
        $scope.offers = Entity['inventorySpace'].get();
    }])
        .controller('createPage', ['$scope', 'Entity', '$dialog', '$location', function($scope, Entity, $dialog, $location) {
        $scope.pages = Entity['pages'].get();

        $scope.opts = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'partials/addPage.html',
            controller: 'AddPageDialogController'
        };
        $scope.openDialog = function(target) {
            Entity['selectedPage'] = $scope.selectedPage;
            
            if (target==='Preview') {
                $location.path('http://www.att.net');
                return;
            }
            var d = $dialog.dialog($scope.opts);
            d.open().then(function(result) {
                if (result)
                {
                    alert('dialog closed with result: ' + result);
                }
            });
        };
    }])
        .controller('createIS', ['$scope', 'Entity', '$dialog', '$location', function($scope, Entity, $dialog, $location) {
        $scope.isCollapsed = true;
        $scope.selectedInventorySpace = [];
        $scope.isService = Entity['inventorySpace'].get();
        $scope.sizes = Entity['sizes'].get();

        // $scope.templates = Entity['templates'].get();
        $scope.$watch('selectedTemplate', function(newValue, oldValue) {
            Entity['selectedTemplate'] = newValue;
        })
        $scope.$watch('selectedSize', function(newValue, oldValue) {
            Entity['selectedSize'] = newValue;
        })
        $scope.$watch('isService.ATTNET', function(newValue, oldValue) {
            $scope.offers = newValue;
        })

        $scope.gridOptions = {
            data: 'offers',
            showGroupPanel: true,
            showSelectionCheckbox: true,
            selectedItems: $scope.selectedInventorySpace,
            multiSelect: false,
            columnDefs: [
                {field: 'pagename', displayName: 'Page Name'},
                {field: 'modulename', displayName: 'Module Name'},
                {field: 'name', displayName: 'Inventory Space Name'},
                {field: 'size', displayName: 'Size'},
                {field: 'status', displayName: 'Status'},
                {field: 'catalog', displayName: 'Catalogs', cellTemplate: '<a ng-click="editCatalog(row)" > <i class="icon-pencil"></i> {{row.getProperty(col.field)}}</a>'}
            ]
        };
        $scope.editCatalog = function() {
            Entity['selectedInventorySpace'] = $scope.selectedInventorySpace[0];
            $location.path('/configureCatalogs');
        };

        $scope.opts = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'partials/addIS.html',
            controller: 'AddSpaceDialogController'
        };
        $scope.openDialog = function() {
            Entity['selectedInventorySpace'] = $scope.selectedInventorySpace[0];
            var d = $dialog.dialog($scope.opts);
            d.open().then(function(result) {
                if (result)
                {
                    alert('dialog closed with result: ' + result);
                }
            });
        };
        $scope.configureCatalog = function() {
            Entity['selectedInventorySpace'] = $scope.selectedInventorySpace[0];
            $location.path('/configureCatalogs');
        }
        $scope.close = function() {
            $scope.isCollapsed = true;
        }
    }])
        .controller('configureCatalogs', ['$scope', 'Entity', '$dialog', '$location', function($scope, Entity, $dialog, $location) {
        $scope.isCollapsed = true;
        $scope.isContentEditable = false;
        $scope.selectedInventorySpace = Entity['selectedInventorySpace'];
        $scope.selectedOffer = Entity['selectedOffer'];
        $scope.catalogs = [
            {name: 'ecomm', template: 'responsive basic', content: 'Samsung Galaxy S® 4 - 16GB Black Mist', contentTemplate:'type:devices,services'},
            {name: 'cq5', template: 'attcom fixed', content: 'Pantech Burst - Ruby Red (Refurbished)', contentTemplate:'type:devices,services'},
            {name: 'teamsite', template: 'none', content: 'Apple® iPad® with Wi-Fi + Cellular 16GB - (Certified Like-New) - White', contentTemplate:'type:devices,services'}
        ];
        $scope.templates = [
            {name: 'responsive basic', id: ''},
            {name: 'attcom fixed', id: ''},
            {name: 'myatt fixed', id: ''}
        ];
        $scope.$watch('selectedTemplate', function(newValue, oldValue) {
            //Entity['selectedTemplate'] = newValue;
        });
        $scope.$watch('selectedOffer', function(newValue, oldValue) {
            Entity['selectedOffer'] = newValue;
        });
        $scope.gridOptions = {
            data: 'catalogs',
            backdropClick: true,
            showSelectionCheckbox: true,
            multiSelect: true,
            enableCellSelection: true,
            enableRowSelection: false,
            columnDefs: [
                {field: 'name', displayName: 'Name'},
                {field: 'template', displayName: 'Template', cellTemplate: '<a ng-click="previewContent()" > <i class="icon-search"></i></a> <select ng-model="selectedTemplate" ng-options="item as item.template for item in catalogs" ><option selected="selected" value="">{{row.getProperty(col.field)}}</option></select>'},                
                {field: 'content', displayName: 'Content', cellTemplate: '<a ng-click="selectContent(row)" > <i class="icon-pencil"></i> {{row.getProperty(col.field)}}</a>'},
                {field: 'contentTemplate', displayName: 'Content Rules', cellTemplate: '<a ng-click="" > {{row.getProperty(col.field)}}</a>'}
            ]
        };

        $scope.opts = {
            backdrop: true,
            keyboard: true,
            templateUrl: 'partials/selectContent.html',
            controller: 'selectContentDialogController'
        };
        $scope.previewContent = function() {

            $scope.isCollapsed = false;
            //alert('is: ' + $scope.selectedInventorySpace.name);
            // alert('selected: ' + this.row.entity.template);
            var tdataObject = $('#TDIS');
            // var offer = 
            // tdataObject.attr('data-tdata-replace', this.value);
            //  var tdisid = $('#TDIS').data('tdata');

            $().replaceContent(offer, $('#TDIS'), this.value);
        }
        $scope.selectContent = function() {
            var d = $dialog.dialog($scope.opts);
            d.open().then(function(result) {
                if (result)
                {
                    $scope.selectedOffer = result;
                }
            });
        };
    }]);


// the dialog is injected in the specified controller
function AddPageDialogController($scope, dialog, Entity) {
    $scope.isCollapsed = true;
    $scope.sizes = Entity['sizes'].get();
    $scope.selectedPage = Entity['selectedPage'];
    $scope.statuses = [
        {name: 'Dev'},
        {name: 'Test'},
        {name: 'Activate'},
        {name: 'Archive'}
    ];
    $scope.edit = function(result) {
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    $scope.close = function(result) {
        $scope.isCollapsed = false;
        dialog.close(result);
    };
}
function AddSpaceDialogController($scope, dialog, Entity, $location) {
    $scope.pages = Entity['pages'].get();
    $scope.sizes = Entity['sizes'].get();
    $scope.is = Entity['selectedInventorySpace'];
    $scope.statuses = [
        {name: 'Dev'},
        {name: 'Test'},
        {name: 'Activate'},
        {name: 'Archive'}
    ];
    $scope.close = function(result) {
        dialog.close(result);
    };
    $scope.configureCatalog = function(result) {
        Entity['selectedInventorySpace'] = $scope.is;
        $scope.close(result);
        $location.path('/configureCatalogs');
    }
}
function selectContentDialogController($scope, dialog, Entity, $location) {
    $scope.is = Entity['selectedInventorySpace'];
    $scope.catalog = Entity['catalog'].get();

    $scope.$watch('catalog.catalog', function(newValue, oldValue) {
        $scope.catalogGrid = newValue;
    });

    $scope.selectContentGridOptions = {
        data: 'catalogGrid',
        showFilter: true,
        showGroupPanel: true,
        showSelectionCheckbox: true,
        multiSelect: false,
        showFooter: true,
        columnDefs: [
            {field: 'name', displayName: 'Name'},
            {field: 'displayDescription', displayName: 'displayDescription'}
        ],
        afterSelectionChange: function(rowItem, event) {
            $scope.selectedOffer = rowItem.entity
        }
    };

    $scope.close = function(result) {
        dialog.close($scope.selectedOffer);
    };
}