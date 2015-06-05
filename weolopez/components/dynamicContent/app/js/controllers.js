'use strict';

/* Controllers */

angular.module('isd.controllers', ['ngGrid', 'ui.bootstrap', 'ui.codemirror'])
        .controller('DashboardCtrl', function($scope, $location) {
            executePlugin();
})
        .controller('UsersCtrl', function($scope, allCEs, user, allUsers, Users, $dialog, $location) {
    $scope.isCollapsed = true;
    $scope.user = user[0];
    $scope.allUsers = allUsers;
    $scope.ces = allCEs;

    $scope.populateDropdowns = function() {
        if ($scope.user !== undefined) {
            $scope.users = [];
            angular.forEach($scope.allUsers, function(value, key) {
                if (value.CURRENT_USER === undefined)
                    $scope.users.push(value);
                if ($scope.user.CURRENT_USER !== undefined)
                    $scope.user = value;
            })
        } else
            $scope.newUser();
        $scope.populateCEDropdown();
    };
    $scope.populateCEDropdown = function() {
        if ($scope.user.ce !== undefined) {
            angular.forEach($scope.ces, function(value, key) {
                if (value.name === $scope.user.ce.name)
                    $scope.ce = value;
            })
        }
        ;
    }
    $scope.populateDropdowns();
    $scope.openUserModal = function() {
        if ($scope.user === undefined)
            $scope.newUser();
        $scope.populateCEDropdown();
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    $scope.newUser = function() {
        $scope.user = new Users();
    };
    $scope.saveCurrentUser = function() {
        $scope.$root.user = $scope.user;
        $location.path('/list/' + $scope.user.ce.name);
    };
    $scope.cancelCurrentUserChanges = function() {
        $location.path('/list/' + $scope.user.ce.name);
    };
    $scope.saveUser = function() {
        //  $scope.user.CURRENT_USER = undefined;
        $scope.user.ce = angular.copy($scope.ce);
        $scope.user.$saveOrUpdate(changeSuccess, changeSuccess, changeError, changeError);
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    $scope.deleteUser = function() {
        areYouSure(function(result) {
            if (result === 'delete')
                $scope.user.$remove(changeSuccess, changeError);
            else {
                alert('cancelled');
            }
            $scope.isCollapsed = !$scope.isCollapsed;
        });
    };
    $scope.cancelUserChanges = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    var changeSuccess = function() {
        Users.all({}, function(result) {
            $scope.allUsers = result;
            Users.query({'CURRENT_USER': 'CURRENT_USER'}, function(result) {
                $scope.user = result[0];
                $scope.populateDropdowns();
            });
        });
    };
    var changeError = function() {
        throw new Error('Sth went wrong...');
    };
    var areYouSure = function(action) {
        var title = 'Warning!';
        var msg = 'Are you sure you want to delete?';
        var btns = [{result: 'cancel', label: 'Cancel'}, {result: 'delete', label: 'DELETE', cssClass: 'btn-primary-danger'}];

        $dialog.messageBox(title, msg, btns)
                .open()
                .then(action);
    };
})
        .controller('CEsCtrl', function($scope, allCEs, ConsumptionEngines, $dialog, $location) {
    $scope.user = $scope.$root.user;
    $scope.isCollapsed = true;
    $scope.ces = allCEs;
    if ($scope.user.ce !== undefined) {
        angular.forEach($scope.ces, function(value, key) {
            if (value.name === $scope.user.ce.name)
                $scope.ce = value;
        })
    }
    $scope.openCEModal = function() {
        if ($scope.ce === undefined)
            $scope.ce = new ConsumptionEngines();
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    $scope.newCE = function() {
        $scope.ce = new ConsumptionEngines();
    };
    $scope.saveCE = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
        $scope.ce.$saveOrUpdate(changeSuccess, changeSuccess, changeError, changeError);
    };
    $scope.saveUser = function() {
        $scope.user.ce = angular.copy($scope.ce);
        $scope.user.$saveOrUpdate(changeSuccess, changeSuccess, changeError, changeError);
    };
    $scope.deleteCE = function() {
        areYouSure(function(result) {
            if (result === 'delete')
                $scope.ce.$remove(changeSuccess, changeError);
            else {
                alert('cancelled');
            }
            $scope.isCollapsed = !$scope.isCollapsed;
        });
    };
    $scope.cancelCEChanges = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    $scope.cancelUserChanges = function() {
        $location.path('/');
    };
    var changeSuccess = function() {
        $scope.ces = ConsumptionEngines.all();
    };
    var changeError = function() {
        throw new Error('Sth went wrong...');
    };
    var areYouSure = function(action) {
        var title = 'Warning!';
        var msg = 'Are you sure you want to delete?';
        var btns = [{result: 'cancel', label: 'Cancel'}, {result: 'delete', label: 'DELETE', cssClass: 'btn-primary-danger'}];

        $dialog.messageBox(title, msg, btns)
                .open()
                .then(action);
    };
})
        .controller('ListCtrl', function($scope, $location, is){
    $scope.currentUser = $scope.$root.user;        
    $scope.is = is;
    $scope.selectedInventorySpace = [];

    $scope.gridOptions = {
        data: 'is',
        showGroupPanel: true,
        showFilter: true,
        selectedItems: $scope.selectedInventorySpace,
        multiSelect: false,
        columnDefs: [
            {field: 'page.name', displayName: 'Page Name'},
            {field: 'module.name', displayName: 'Module Name'},
            {field: 'name', displayName: 'Inventory Space Name'},
            {field: 'size', displayName: 'Size'},
            //    {field: 'totalContent', displayName: 'Content Quantity'}
        ]};

    $scope.newSpace = function() {
        $location.path('/new');
    };
    $scope.cloneSpace = function() {
        var selectedIS = $scope.selectedInventorySpace[0];
        if (selectedIS === undefined)
            alert('Please select a row.');
        else
            $location.path('/edit/'+ $scope.currentUser.ce.name +'/'+ selectedIS.$id());
        $location.search('isClone', 'true');
    };
    $scope.editSpace = function() {
        var selectedIS = $scope.selectedInventorySpace[0];
        if (selectedIS === undefined)
            alert('Please select a row.');
        else {
            $location.path('/edit/'+ $scope.currentUser.ce.name +'/'+ selectedIS.$id());
            $location.search('isClone', 'false');
        }
    };
    $scope.editCatalog = function() {
        var selectedIS = $scope.selectedInventorySpace[0];
        if (selectedIS === undefined)
            alert('Please select a row.');
        else {
            $location.path('/catalog/' + selectedIS.$id());
        }
    };
})
        .controller('FormCtrl', function($scope, $location, is, allPages, allModules, Pages, Modules, $dialog) {
    /*
     * Init block
     * Get Current User for CE context
     * isCopy for dirty update check
     * Clone IS Use Case
     * New IS Use Case
     * Add is, pages and modules to scope
     */
    $scope.currentUser = $scope.$root.user;

    var isCopy = angular.copy(is);

    if (($location.search()).isClone === 'true') {
        is._id = undefined;
        angular.forEach(is.catalogs, function(value, key) {
            value.template = undefined;
        });
    }

    if (is === undefined)
        is = new is();
    if (is.ce === undefined)
        is.ce = angular.copy($scope.currentUser.ce);
    $scope.is = is;
    $scope.pages = allPages;
    $scope.modules = allModules;
    $scope.sizes = ['939x270', '437x105', '460x225', '300x250'];
    $scope.statuses = ['Feature Not Yet Implemented!!!'];

    /*
     * Init page and module dropdown
     */
    if ($scope.is.page !== undefined) {
        angular.forEach($scope.pages, function(value, key) {            
            if (value.name === $scope.is.page.name)
                $scope.page = value;
        })
    }
    if ($scope.is.module !== undefined) {
        angular.forEach($scope.modules, function(value, key) {
            if (value.name === $scope.is.module.name)
                $scope.module = value;
        })
    }
    $scope.opts = {
        backdropFade: true,
        dialogFade: true
    };
    $scope.openPageModal = function() {
        if ($scope.page === undefined)
            $scope.newPage()
        $scope.isPageModalOpen = true;
    };
    $scope.openModuleModal = function() {
        if ($scope.module === undefined)
            $scope.newModule();
        $scope.isModuleModalOpen = true;
    };
    $scope.newPage = function() {
        $scope.page = new Pages();
        $scope.page.ce = angular.copy($scope.currentUser.ce);
    };
    $scope.newModule = function() {
        $scope.module = new Modules();
        $scope.module.ce = angular.copy($scope.currentUser.ce);
    };
    $scope.savePage = function() {
        $scope.isPageModalOpen = false;
        $scope.page.$saveOrUpdate(modalChangeSuccess, modalChangeSuccess, changeError, changeError);
    };
    $scope.saveModule = function() {
        $scope.isModuleModalOpen = false;
        $scope.module.$saveOrUpdate(modalChangeSuccess, modalChangeSuccess, changeError, changeError);
    };
    $scope.save = function() {
        $scope.is.page = angular.copy($scope.page);
        $scope.is.module = angular.copy($scope.module);
        $scope.is.$saveOrUpdate(changeSuccess, changeSuccess, changeError, changeError);
    };
    $scope.deletePage = function() {
        areYouSure(function(result) {
            if (result === 'delete')
                $scope.page.$remove(modalChangeSuccess, changeError);
            else {
                alert('cancelled');
            }
            $scope.isPageModalOpen = false;
        });
    };
    $scope.deleteModule = function() {
        areYouSure(function(result) {
            if (result === 'delete')
                $scope.module.$remove(modalChangeSuccess, changeError);
            else {
                alert('cancelled');
            }
            $scope.isModuleModalOpen = false;
        });
    };
    $scope.deleteSpace = function() {
        areYouSure(function(result) {
            if (result === 'delete')
                $scope.is.$remove(changeSuccess, changeError);
            else {
                alert('cancelled');
            }
        });
    };
    $scope.cancelPageChanges = function() {
        $scope.isPageModalOpen = false;
    };
    $scope.cancelModuleChanges = function() {
        $scope.isModuleModalOpen = false;
    };
    $scope.cancelChanges = function() {
        $location.path('/list/' + $scope.user.ce.name);
    };
    $scope.editCatalog = function() {
        $location.path('/catalog/' + $scope.is.$id());
    };
    $scope.hasChanges = function() {
        return !angular.equals($scope.is, isCopy);
    };
    var modalChangeSuccess = function() {
        $scope.pages = Pages.query({'ce.name': $scope.currentUser.ce.name});
        $scope.modules = Modules.all();
    };
    var changeSuccess = function() {
        $location.path('/list/' + $scope.user.ce.name);
    };
    var areYouSure = function(action) {
        var title = 'Warning!';
        var msg = 'Are you sure you want to delete?';
        var btns = [{result: 'cancel', label: 'Cancel'}, {result: 'delete', label: 'DELETE', cssClass: 'btn-primary-danger'}];

        $dialog.messageBox(title, msg, btns)
                .open()
                .then(action);
    };
    var changeError = function() {
        throw new Error('Sth went wrong...');
    };
})
        .controller('CatalogCtrl', function($scope, $location, is, $dialog, allCatalogs, allContentTypes, allOffers, allTemplates, Templates, Entity) {
    $scope.currentUser = $scope.$root.user;
    if (is === undefined) {
        alert("Inventory Space Saving in Progress. Please try again.");
        $location.path('/list/' + $scope.user.ce.name);
    }
    $scope.templates = allTemplates;
    $scope.isCollapsed = true;
    Entity['selectedInventorySpace'] = is;
    if (is.catalogs === undefined)
        is.catalogs = allCatalogs;
    $scope.is = is;

    $scope.$root.catalog = allOffers;
    $scope.$root.selectedCatalog = [];

    $scope.gridOptions = {
        data: 'is.catalogs',
        sortInfo: {fields: ['name'], directions: ['asc']},
        backdropClick: true,
        showGroupPanel: true,
        selectedItems: $scope.$root.selectedCatalog,
        showFooter: true,
        multiSelect: false,
        beforeSelectionChange: function(rowItem, event) {
            if (rowItem.entity.isEnabled === 'false') {
                rowItem.entity.template === undefined;
                return false;
            }
            if (rowItem.entity.template === undefined)
                rowItem.entity.template = Templates.init(rowItem.entity, $scope.is.size);

            $scope.templates = [];
            angular.forEach(allTemplates, function(value, key) {
                if ((value.size === $scope.is.size) && (value.catalog.contentSize === rowItem.entity.contentSize))
                    $scope.templates.push(value);
                else if (value.name.indexOf('Responsive')>0) $scope.templates.push(value);
                if (value.name === rowItem.entity.template.name)
                    rowItem.entity.template = value;
            })
            return true;
        },
        columnDefs: [
            {field: 'isEnabled', displayName: '', width: '25', cellTemplate: '<div><input type="checkbox" ng-model="COL_FIELD" ng-true-value="true" ng-false-value="false" style="margin-left:5px;margin-top:10px;"></div>'},
            {field: 'name', displayName: 'Name', cellTemplate: '<div>{{COL_FIELD}}</div>'},
            {field: 'contentSize', displayName: 'Content Size'},
            {field: 'template.name', displayName: 'Template'},
            {field: 'count', displayName: 'Content Quantity'}
        ]
    };

    var selectionCheck = function() {
        if ($scope.$root.selectedCatalog[0] === undefined) {
            alert('Please select a row.');
            return false;
        } else
            return true;
    };
    $scope.previewContent = function() {
        if (!selectionCheck())
            return;

        if ($scope.$root.selectedCatalog[0].defaultContent === undefined) {
            $scope.selectContent();
        } else {
            viewPreview();
        }
    };
    $scope.selectContent = function() {
        $dialog.dialog({
            backdrop: true,
            keyboard: true,
            templateUrl: 'partials/selectContent.html',
            controller: 'SelectContentDialogController'
        }).open()
                .then(function(result) {
            $scope.$root.selectedCatalog[0].defaultContent = result;
        });
    }
    $scope.selectContentTypeGridOptions = {
        data: 'is.contentTypes',
        showFilter: true,
        showGroupPanel: true,
        multiSelect: false,
        showFooter: true,
        columnDefs: [
            {field: 'isEnabled', displayName: '', width: '25', cellTemplate: '<div><input type="checkbox" ng-model="COL_FIELD" ng-true-value="true" ng-false-value="false" style="margin-left:5px;margin-top:10px;"></div>'},
            {field: 'name', displayName: 'Content Type'}
        ]
    };
    $scope.openContentTypeModal = function() {
        if ($scope.is.contentTypes === undefined)
            is.contentTypes = allContentTypes;
        $scope.isContentTypesModalOpen = true;
    };
    $scope.cancelRuleChanges = function() {
        $scope.isContentTypesModalOpen = false;
    };
    $scope.cancel = function() {
        $location.path('/list/' + $scope.user.ce.name);
    };
    $scope.saveRules = function() {
        $scope.isContentTypesModalOpen = false;
    };
    $scope.save = function() {
        $scope.is.$saveOrUpdate(changeSuccess, changeSuccess, changeError, changeError);
    };
    $scope.editTemplate = function() {
        if (!selectionCheck())
            return;
        $location.path('/templateDesign/' + $scope.$root.selectedCatalog[0].template.$id());
    };
    var viewPreview = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    var changeSuccess = function() {
        $location.path('/list/' + $scope.user.ce.name);
    };
    var changeError = function() {
        throw new Error('Sth went wrong...');
    };
})
        .controller('PageController', function($scope, $location) {
    if ($scope.$root.user === undefined) 
        $location.path('/users');
    
    $scope.slides = [
        {image: 'http://home.orionhub.org:8080/weolopez/assets/img/slide-03.jpg', text: 'T.Data'},
        {name: 'attcom fixed', id: ''},
        {name: 'myatt fixed', id: ''}
    ];
    $scope.shouldBeOpen = false;
    $scope.optsPreview = {
        backdropFade: true,
        dialogClass: 'test modal',
        dialogFade: true
    };
    $scope.hasPlugin = function() {
        var plugincheck = $('#plugincheck').attr('data-plugincheck');
        return (plugincheck === 'true');
    };
    $scope.openPreview = function() {
        $scope.shouldBeOpen = !$scope.shouldBeOpen;
    };
    $scope.close = function() {
        $scope.shouldBeOpen = false;
    };
})
        .controller('SelectContentDialogController', function($scope, dialog, Entity, $location) {
    $scope.selectedOffer = [];
    $scope.selectContentGridOptions = {
        data: '$root.catalog',
        showFilter: true,
        showGroupPanel: true,
        showSelectionCheckbox: true,
        multiSelect: false,
        selectedItems: $scope.selectedOffer,
        showFooter: true,
        columnDefs: [
            {field: 'name', displayName: 'Name'},
            {field: 'displayDescription', displayName: 'displayDescription'}
        ]
    };

    $scope.close = function(result) {
        dialog.close($scope.selectedOffer[0]);
    };
})
        .controller('TemplateDesignCtrl', function($scope, template, allTemplates, $location, $dialog, Templates, Entity) {
    $scope.selectedInventorySpace = Entity['selectedInventorySpace'];
    $scope.isCollapsed = true;
    $scope.templates = allTemplates;
    if (template === undefined)
        template = Templates.init($scope.$root.selectedCatalog[0], $scope.selectedInventorySpace.size);
    $scope.templates = [];
    angular.forEach(allTemplates, function(value, key) {
        if ((value.size === $scope.selectedInventorySpace.size) && (value.catalog.contentSize === $scope.$root.selectedCatalog[0].contentSize))
            $scope.templates.push(value);
        if (value.name === $scope.$root.selectedCatalog[0].template.name)
            $scope.$root.selectedCatalog[0].template = value;
    })
    $scope.codeText = $scope.$root.selectedCatalog[0].template.html + '\n\n';

    $scope.editorOptions = {
        lineWrapping: true,
        lineNumbers: true,
        mode: 'htmlmixed',
        onLoad: function(_editor) {
            $scope.editor = _editor;
            var range = $scope.getSelectedRange();
            $scope.editor.autoFormatRange(range.from, range.to);
        }
    };
    $scope.$root.$watch('selectedCatalog[0]', function(newValue) {
        $scope.codeText = $scope.$root.selectedCatalog[0].template.html;
    }, true);
    $scope.getSelectedRange = function() {
        var totalLines = $scope.editor.lineCount();
        var totalChars = $scope.editor.getTextArea().value.length;
        return {from: $scope.editor.getCursor(true), to: $scope.editor.getCursor(false)};
    };
    $scope.autoFormatSelection = function() {
        var range = $scope.getSelectedRange();
        $scope.editor.autoFormatRange(range.from, range.to);
    };
    
    $scope.opts = {
        backdropFade: true,
        dialogClass: 'test modal',
        dialogFade: true
    };
    
    $scope.openPreviewModal = function() {
        $scope.$root.selectedCatalog[0].template.html = $scope.codeText;
        
        $scope.isPreviewModalOpen = true;
    }
    $scope.closeModal = function() {
        $scope.isPreviewModalOpen = false;
    }    
    $scope.newTemplate = function() {
        var htmlCopy = $scope.$root.selectedCatalog[0].template.html;
        $scope.$root.selectedCatalog[0].template = Templates.init($scope.$root.selectedCatalog[0], $scope.selectedInventorySpace.size);
        $scope.$root.selectedCatalog[0].template.name = '';
        $scope.$root.selectedCatalog[0].template.html = htmlCopy;
        $scope.isCollapsed = false;
    };
    $scope.saveTemplate = function() {
        $scope.template = new Templates();
        $scope.$root.selectedCatalog[0].template.html = $scope.codeText;
        $scope.template = angular.copy($scope.$root.selectedCatalog[0].template);        
        $scope.template.$saveOrUpdate(changeSuccess, changeSuccess, changeError, changeError);
    };
    $scope.cancelTemplate = function() {
        $location.path('/catalog/' + $scope.selectedInventorySpace.$id());
    };
    var changeSuccess = function() {
        $location.path('/catalog/' + $scope.selectedInventorySpace.$id());
    };
    var changeError = function() {
        throw new Error('Sth went wrong...');
    };
})
        ;