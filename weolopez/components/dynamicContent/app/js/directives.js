'use strict';

/* Directives */


angular.module('isd.directives', [])
        .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])
        .directive('tdataPreview', function() {
    return {
        templateUrl: 'partials/previewTemplate.html',
        controller: ['$scope', '$element', '$attrs', 'Entity', function($scope, $element, $attrs, Entity) {
                $scope.is = Entity['selectedInventorySpace'];
                $scope.is.width = $scope.is.size.substring(0, $scope.is.size.indexOf('x'));
                $scope.is.height = $scope.is.size.substring($scope.is.size.indexOf('x') + 1, $scope.is.size.length);
            }],
        link: function(scope, element, attrs, Entity) {
            var tdataArrayObject = $('#TDIS');
            scope.$root.$watch('selectedCatalog[0]', function(newValue, oldValue) {
                if (newValue !== undefined && newValue.defaultContent !== undefined) {
                    var offer = angular.copy(newValue);
                    if (offer.template.html !== undefined) {
                        offer.defaultContent.template = offer.template.html;
                        $().replaceContent(offer.defaultContent, tdataArrayObject, 'defaultTransition');
                    } else {
                        var parent = tdataArrayObject.children().wrapAll('<div />').parent();
                        var oldSpace = parent.children().wrapAll('<div />').parent();
                        oldSpace.remove();
                        offer.defaultContent.template = offer.template.html;
                        $().replaceContent(offer.defaultContent, tdataArrayObject, 'defaultTransition');
                    }
                }
            } ,true); 
        }
    }
});
