angular.module('photoShareApp', ['ngRoute', 'ngAnimate', 'angular-carousel'])
        .config(['$routeProvider', function($routeProvider) {
                $routeProvider.when('/photoShare', {templateUrl: 'photoShare.html', controller: 'PhotoShareCtrl'});
                $routeProvider.otherwise({redirectTo: '/photoShare'});
            }])
        .directive('fileButton', function() {
            return {
                restrict: "A",
                template: '<form id="fileButton" method="post" enctype="multipart/form-data" ><input id="uploadInput" type="file" ng-model="file" style="display:none"/></form>',
                replace: true,
                controller: function ($scope, $element, $rootScope ) {                    
                    $rootScope.$on('handleBroadcast', function() {
                        $element.find('input').click();
                    });
                },
                link: function(scope, element, attributes, $rootScope) {
                    scope.album = '';
                    var albumDelete = "2OOgsRAJRG2fK7T";
 
                    element.find('input').on('click', function() {
                        this.value = null;
                    });
                    element.find('input').on('change', function() {
                        var file = this.files[0];
                        var fd = new FormData();
                        fd.append("image", file);
                        fd.append("album", albumDelete);
                        fd.append("Authorization", "4a358d16e826c56");
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", "https://api.imgur.com/3/image");
                        xhr.setRequestHeader("Authorization", "Client-ID 4a358d16e826c56");
                        xhr.send(fd);
                    });
                }
            };
        })
        .controller('PhotoShareCtrl', function($scope, $http, $rootScope) {
            var album = "PCHRY";
            var albumDelete = "2OOgsRAJRG2fK7T";
            $scope.COMMENT = 1;
            $scope.CAMERA = 0;

            $scope.types = [
                {
                    "name": "Add ",
                    "icon": "icon-camera"
                },
                {
                    "name": "Comment ",
                    "icon": "icon-comment"
                }
            ];
            $scope.comments = [
                {
                    id: "1",
                    text: "This was so funny"
                },
                {
                    id: "2",
                    text: "I love this line!"
                },
                {
                    id: "1",
                    text: "This was so funny"
                },
                {
                    id: "2",
                    text: "I love this line!"
                },
                {
                    id: "1",
                    text: "This was so funny"
                },
                {
                    id: "2",
                    text: "I love this line!"
                },
                {
                    id: "1",
                    text: "This was so funny"
                },
                {
                    id: "2",
                    text: "I love this line!"
                },
                {
                    id: "1",
                    text: "This was so funny"
                },
                {
                    id: "2",
                    text: "I love this line!"
                },
                {
                    id: "1",
                    text: "This was so funny"
                },
                {
                    id: "2",
                    text: "I love this line!"
                },
                {
                    id: "1",
                    text: "This was so funny"
                },
                {
                    id: "2",
                    text: "I love this line!"
                },
                {
                    id: "1",
                    text: "This was so funny"
                },
                {
                    id: "2",
                    text: "I love this line!"
                },
                {
                    id: "1",
                    text: "This was so funny"
                },
                {
                    id: "2",
                    text: "I love this line!"
                },
                {
                    id: "1",
                    text: "I love this crowd!"
                }
            ];

            $scope.crowd = "work";
            var postData = {
                title: $scope.crowd,
                privacy: "public"
            };

            /*   $http({method: 'POST', url: 'https://api.imgur.com/3/album/',
             headers: {'Authorization': 'Client-ID 4a358d16e826c56'},
             data: postData
             }).success(function(data, status, headers, config) {
             $scope.album = data; 
             })
             .error(function(data, status, hearders, config) {
             console.log('ERROR');
             });
             */
            $scope.sportImages = [];
            for (var j = 0; j < 10; j++) {
                $scope.sportImages.push('http://lorempixel.com/400/200/sports/' + j + '/');
            }

            if (typeof window.innerWidth !== 'undefined') {
                $scope.windowHeight = window.innerHeight - 40;
                $scope.windowWidth = window.innerWidth - 40;
            }

            $http({method: 'GET', url: 'https://api.imgur.com/3/album/' + album + '/images',
                headers: {'Authorization': 'Client-ID 4a358d16e826c56'}})
                    .success(function(data, status, headers, config) {
                        $scope.pictures = data.data;//.slice(0, 5);
                    })
                    .error(function(data, status, hearders, config) {
                        console.log('ERROR');
                    });
                    
            $scope.selectedType = function(index) {
                if (index === $scope.CAMERA) $rootScope.$broadcast('handleBroadcast');
                if (index === $scope.selectedIndex) {
                    $scope.selectedIndex = undefined;
                    return;
                }
                $scope.selectedIndex = index;
            };
        })
        ;

/*
 * data
 Object { id="PCHRY", deletehash="2OOgsRAJRG2fK7T"}
 
 id
 "PCHRY"
 
 deletehash
 "2OOgsRAJRG2fK7T"
 */