'use strict';

/* Directives */


angular.module('myApp.directives', []).
        directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]).
        directive('tdataPreview', function() {
    return {
        //template: '<div id=\"resizable\" style=\"width:450px;height:225px;background-color: white;visibility: visible;border: solid;\"><div id=\"TDIS\" data-tdata=\"IS7\" data-tdata-replace=\"true\" style=\"width: 100%;height: 100%;visibility: visible;\"><img src=\"\" alt=\"Get a $10 Reward Card\"\/><\/div><\/div><div><span id=\"TDISW\">Width: <\/span><span id=\"TDISH\">Height: <\/span><\/div>',        
        templateUrl: 'partials/previewTemplate.html',
        controller: ['$scope', '$element', '$attrs', 'Entity', function($scope, $element, $attrs, Entity) {
                $scope.is = Entity['selectedInventorySpace'];
                $scope.is.width = $scope.is.size.substring(0, $scope.is.size.indexOf('x'));
                $scope.is.height = $scope.is.size.substring($scope.is.size.indexOf('x') + 1, $scope.is.size.length);
            }],
        link: function(scope, element, attrs, Entity) {
            var tdataArrayObject = $('#TDIS');
            scope.$watch('selectedOffer', function(newValue, oldValue) {
                $().replaceContent(newValue, tdataArrayObject, 'defaultTransition');
            });
        }
    }
}).
        directive('tdataGrid', function() {
    return {
        controller: ['$scope', '$element', '$attrs', 'Entity', function($scope, $element, $attrs, Entity) {
                $scope.gridAtts = Entity['inventorySpace'].get();
            }],
        link: function(scope, element, attrs) {
            var grid = $(element).jqGrid(),
                    gridAtts;

            function updateGrid() {
                if (gridAtts === undefined)
                    return;
                grid.jqGrid(gridAtts);
            }

            scope.$watch(scope.gridAtts, function(value) {
                gridAtts = value;
                updateGrid();
            });
        }
    }
}).
        directive('tdataJqgrid', ['version', function(version) {
        return function(scope, element, attrs) {
            var offers,
                    template1,
                    template2,
                    grid = $(element);

            initGrid();

            function initGrid() {
                template1 =
                        {"groupOp": "AND",
                            "rules": [
                                {"field": "b.name", "op": "bw", "data": "Client 1"},
                                {"field": "a.amount", "op": "gt", "data": "20"}
                            ]
                        };

                template2 =
                        {"groupOp": "AND",
                            "rules": [
                                {"field": "b.name", "op": "eq", "data": "Client 2"},
                                {"field": "a.id", "op": "le", "data": "10"}
                            ]
                        };

                // grid = jQuery("#list2").jqGrid({datatype: "json", colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'], colModel: [{name: 'id', index: 'id', width: 55}, {name: 'invdate', index: 'invdate', width: 90}, {name: 'name', index: 'name asc, invdate', width: 100}, {name: 'amount', index: 'amount', width: 80, align: "right"}, {name: 'tax', index: 'tax', width: 80, align: "right"}, {name: 'total', index: 'total', width: 80, align: "right"}, {name: 'note', index: 'note', width: 150, sortable: false}], rowNum: 10, rowList: [10, 20, 30], pager: '#pager2', sortname: 'id', viewrecords: true, sortorder: "desc", caption: "JSON Example"});
                // grid.jqGrid('navGrid', '#pager2', {edit: false, add: false, del: false});

                grid = element.jqGrid({
                    jsonReader: {
                        root: "offerRecord",
                        page: "pageId",
                        repeatitems: true,
                        cell: "cell",
                        id: "inventorySpaceId"
                    },
                    datatype: "json",
                    colNames: ['Page', 'Module', 'Inv No', 'statusCode', 'name', 'displayDescription', 'url', 'Default View', 'imageWidth', 'Template'],
                    colModel: [
                        {name: 'Page', label: 'Essentials', index: 'Page', width: 55, align: 'center', editable: false},
                        {name: 'Module', index: 'Module', width: 70},
                        {name: 'inventorySpaceId', index: 'inventorySpaceId', width: 55, editable: false, editoptions: {readonly: true, size: 10}},
                        {name: 'statusCode', index: 'statusCode', width: 80, editable: true, editoptions: {size: 10}},
                        {name: 'name', index: 'name', width: 90, editable: true, editoptions: {size: 25}},
                        {name: 'displayDescription', index: 'displayDescription', width: 60, align: "right", editable: true, editoptions: {size: 10}},
                        {name: 'url', index: 'url', width: 60, align: "right", editable: true, editoptions: {size: 10}},
                        {name: 'defaultView', index: 'defaultView', width: 60, align: "right", editable: true, edittype: "select", editoptions: {value: "RWD:Responsive Web Design;attcom:attcom"}},
                        {name: 'imageWidth', index: 'imageWidth', width: 55, align: 'center', editable: false, editoptions: {readonly: true, size: 10}},
                        {name: 'Template', index: 'Template', width: 70, editable: true, edittype: "select", editoptions: {value: "RWD:Responsive Web Design;attcom:attcom"}}
                    ],
                    rowNum: 10,
                    rowList: [10, 20, 30],
                    pager: '#pagered',
                    sortname: 'id',
                    autowidth: true,
                    viewrecords: true,
                    sortorder: "desc",
                    caption: "Content Rules",
                    onSelectRow: function(id) {
                        if (id && id !== lastsel2) {
                            grid.jqGrid('restoreRow', lastsel2);
                            grid.jqGrid('editRow', id, true);
                            lastsel2 = id;

                            for (i = 0; i < pageOffers.length; i++) {
                                var offer = pageOffers[i];
                                if (offer.inventorySpaceId === lastsel2)
                                    $().replaceContent(offer, $('#TDIS'));
                            }
                        }
                    },
                    editurl: "#"
                });
                grid.jqGrid('navGrid', '#pagered',
                        {edit: true, add: true, del: true},
                {},
                        {},
                        {},
                        {
                            multipleSearch: true,
                            multipleGroup: true,
                            showQuery: true,
                            // set the names of the template
                            "tmplNames": ["Template One", "Template Two"],
                            // set the template contents
                            "tmplFilters": [template1, template2]
                        }
                );

            }
            function updateGrid() {
                if (offers === undefined)
                    return;
                // alert("OFFERS"+offers)
                grid[0].addJSONData(offers);
            }

            scope.$watch(attrs.tdataJqgrid, function(value) {
                offers = value;
                updateGrid();
            });

        };
    }]);
