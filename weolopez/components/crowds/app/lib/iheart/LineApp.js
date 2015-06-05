angular.module('lineApp', ['ngRoute', 'ngAnimate', 'leaflet-directive', 'mongolabResourceHttp', 'ngStorage', 'firebase'])
        .config(['$routeProvider', function($routeProvider) {
                $routeProvider.when('/geomap', {templateUrl: 'geomap.html', controller: 'GeomapCtrl', resolve: {
                        allLines: function(Lines) {
                            return Lines.all();
                        }
                    }});
                $routeProvider.when('/editLine:id', {templateUrl: 'editLine.html', controller: 'EditLineCtrl', resolve: {
                        line: function(Line, $route) {
                            return Line.query({'line.name': $route.current.params.id});
                        }
                    }});

                $routeProvider.otherwise({redirectTo: '/geomap'});
            }])
        .constant('MONGOLAB_CONFIG', {API_KEY: '50f36e05e4b0b9deb24829a0', DB_NAME: 'weolopez'})
        .value('fbURL', 'https://lines.firebaseio.com/')
        .factory('Lines', function($mongolabResourceHttp) {
            return $mongolabResourceHttp('Lines');
        })
        .factory('Line', function($mongolabResourceHttp) {
            return $mongolabResourceHttp('Line');
        })
        .directive('fileButton', function() {
            return {
                template: '<form id="fileButton" method="post" enctype="multipart/form-data" ><a title="reduce" class="heart"><p><i class="icon-heart"></i></a></p><input id="uploadInput" type="file" ng-model="file" style="display:none"/></form>',
                replace: true,
                link: function(scope, element, attributes) {
                    element.find('a').on('click', function() {
                        element.find('input').click();
                    })
                    element.find('input').on('click', function() {
                        this.value = null;
                    });
                    element.find('input').on('change', function() {
                        var file = this.files[0];
                        var fd = new FormData();
                        fd.append("image", file);
                        fd.append("Authorization", "4a358d16e826c56");
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", "https://api.imgur.com/3/image");
                        xhr.setRequestHeader("Authorization", "Client-ID 4a358d16e826c56");
                        xhr.send(fd);
                    });
                }
            }
        })
        .controller('EditLineCtrl', function($scope, $location, $localStorage, line, $timeout) {
        	$scope.showCounter = true;
            $scope.line = line[0];
            $scope.$storage = $localStorage;
            if ($scope.line === undefined) {
                $scope.line = {};
                $scope.line.name = $localStorage.currentLine;
                $scope.line.index = 0;
                $scope.line.rate = 120;
            }
            $scope.$watch('line.index', function(newIndex) {
                $scope.counter = newIndex * $scope.line.rate;

            })

            $scope.onTimeout = function() {
                if (($scope.counter <= 0) || ($scope.counter === 'done'))
                    $scope.counter = 'done';
                else
                    $scope.counter--;
                mytimeout = $timeout($scope.onTimeout, 1000);
            }
            var mytimeout = $timeout($scope.onTimeout, 1000);

            if ($scope.line.index === 0) {
                $timeout.cancel(mytimeout);
            }
            $scope.countDown = $scope.line.rate * $scope.line.index;

            $scope.peopleInFront = function() {
                if ($scope.line.index == 0) {
                    $scope.showCounter = true;
                } else {
                    $scope.line.index--;
                }
            }
            $scope.editLine = function() {
                //alert("clicked submit");
                $http.get("/BraveHackers/crowds/lineService/addSmiley",
                        {params:
                                    {lineId: $scope.pin.id, count: $scope.pin.count}
                        })
                        .success(function(data, status, success, requestObject) {
                            console.log('success:' + data);
                            $location.url("/editLineCount");
                        })
                        .error(function(data) {
                            console.log('error:' + data);
                            $location.url("/editLineCount");
                        });
            }
        })
        .controller('GeomapCtrl', function($scope, $http, $location, $rootScope, $localStorage, $sessionStorage, allLines, angularFire, fbURL, filterFilter) {
            $scope.allLines = allLines[0];
            $scope.types = $scope.allLines.types;
            $scope.$storage = $localStorage;

            var firePromis = angularFire(fbURL, $scope, 'lines');

            firePromis.then(function(lines) {
                $scope.$watch('lines', function(updatedLines) {
                    updateMarkers();
                }, true);
            });

            angular.extend($scope, $scope.allLines.base);

            angular.extend($scope.center, {
            	lat: $localStorage.position.coords.latitude,
            	lng: $localStorage.position.coords.longitude
            });
            function updateMarkers() {
                if ($scope.selectedIndex === undefined)
                    return;
                var currentType = $scope.allLines.types[$scope.selectedIndex].name;
                for (var i = 0; i < $scope.lines.length; i++) {
                    var marker = $scope.lines[i];
                    if ((marker !== undefined) && (marker.marker !== undefined)) {
                        marker = marker.marker;
                        if (marker.type === currentType ) {
                            marker.value[Object.keys(marker.value)[0]].icon = L.AwesomeMarkers.icon({
                                icon: $scope.types[$scope.selectedIndex].icon,
                                color: 'red'
                            });
                            angular.extend($scope.markers, marker.value);
                        }
                    }
                }

                angular.forEach($scope.markers, function(marker, key) {
                    if (marker.title !== currentType) {
                        delete $scope.markers[key];
                    }
                });
            }

            $scope.selectedType = function(index) {
                $scope.selectedIndex = index;
                updateMarkers();
            };

            $scope.$on('leafletDirectiveMap.click', function(e, args) {
            	var s = $scope;
                if ($scope.types[$scope.selectedIndex] === undefined)
                    alert("Please select a line type.");
                
                var count = Object.keys($scope.markers).length;
                var name = $scope.types[$scope.selectedIndex].name + count.toString();
                var marker = {};
                var redMarker = L.AwesomeMarkers.icon({
                    icon: $scope.types[$scope.selectedIndex].icon,
                    color: 'red'
                })
                marker[name] = {
                    lat: args.leafletEvent.latlng.lat,
                    lng: args.leafletEvent.latlng.lng,
                    title: $scope.types[$scope.selectedIndex].name,
                    focus: false,
                    draggable: true
                }
                $scope.lines.push({marker: {
                        type: $scope.types[$scope.selectedIndex].name,
                        value: marker
                    }});
                marker[name].icon = redMarker;
                angular.extend($scope.markers, marker);

                //     console.log($scope.lines);
                //    $scope.allLines.$saveOrUpdate(changeSuccess, changeSuccess, changeError, changeError);
            });

            $scope.$on('leafletDirectiveMarker.click', function(e, args) {
                $localStorage.currentLine = args.leafletEvent.target.options.title;
                $location.url("/editLine:" + args.leafletEvent.target.options.title);
            });

            function changeSuccess() {
                console.log("SUCCESS");
            }
            ;
            function changeError() {
                console.log("changeError");
            }
            ;
        })
        ;

