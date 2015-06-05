
var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'AppsDirective', 'mongolabResourceHttp', 'ngStorage']);

app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {template: '<div><button ng-click="sayHello()">Change Login</button> {{templateName}}</div>', controller: 'MyCtrl1'});
        $routeProvider.when('/login', {templateUrl: 'login.html', controller: 'LoginCtrl'});
        $routeProvider.when('/group', {templateUrl: 'group.html', controller: 'GroupCtrl'});
        $routeProvider.when('/sixteen', {templateUrl: 'sixteen.html', controller: 'SixteenCtrl'});
        $routeProvider.when('/quarter', {templateUrl: 'quarter.html', controller: 'QuarterCtrl'});
        $routeProvider.when('/semi', {templateUrl: 'semi.html', controller: 'SemiCtrl'});
        $routeProvider.when('/third', {templateUrl: 'third.html', controller: 'ThirdCtrl'});
        $routeProvider.when('/final', {templateUrl: 'final.html', controller: 'FinalCtrl'});
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]).constant('MONGOLAB_CONFIG', {API_KEY: '50f36e05e4b0b9deb24829a0', DB_NAME: 'weolopez'})
        .factory('PTWC', function($mongolabResourceHttp) {
            return $mongolabResourceHttp('PTWC');
        });

app.controller('myController', function($scope, $timeout, $location, $localStorage) {
    $scope.ptwc = $localStorage.ptwc;
    if ($scope.ptwc === undefined)
        $location.path('/login');

    $scope.sayHello = function() {
        $location.path('/login' === $location.path() ? '/' : '/login');
    }

    $scope.$watch('testValue', function(newValue, oldValue) {
        if (newValue === 'hello') {
            alert('before apply called!');
            $timeout(function() {
                alert('after apply called!');
            })
        }
    });
    $scope.types = [
        {
            "name": "Home",
            "icon": "icon-home",
            "type": "nav",
            "appType": "home",
            "path": "home"
        },
        {
            "name": "Group",
            "icon": "icon-sitemap",
            "type": "nav",
            "appType": "app",
            "path": "group"
        },
        {
            "name": "Sixteen",
            "icon": "icon-group",
            "type": "nav",
            "appType": "app",
            "path": "sixteen"
        },
        {
            "name": "Quarters",
            "icon": "icon-code-fork",
            "type": "nav",
            "appType": "app",
            "path": "sixteen"
        },
        {
            "name": "Semi",
            "icon": "icon-male",
            "type": "nav",
            "appType": "app",
            "path": "sixteen"
        },
        {
            "name": "Third",
            "icon": "icon-flag",
            "type": "nav",
            "appType": "app",
            "path": "third"
        },
        {
            "name": "Final",
            "icon": "icon-trophy",
            "type": "nav",
            "appType": "app",
            "path": "sixteen"
        }
    ]
});
app.controller('MyCtrl1', function($scope, $localStorage) {
    if ($localStorage.ptwc !== undefined) {
        $scope.userName = $localStorage.ptwc.userName;
        $scope.templateName = $scope.userName + ' is currently logged in;';
    }
});
app.controller('LoginCtrl', function($scope, $localStorage) {
    if ($localStorage.ptwc !== undefined)
        $scope.userName = $localStorage.ptwc.userName;

    $scope.$watch('userName', function(newValue, oldValue) {
        if (newValue === undefined || newValue.length < 3)
            return;
        if ($localStorage.ptwc === undefined)
            $localStorage.ptwc = {};
        $localStorage.ptwc.userName = newValue;
        //  alert('userName:'+$scope.newValue);
        $scope.localuser = $localStorage.ptwc.userName;
        $localStorage.ptwc.group = undefined;
    });
});
app.factory('SixteenService', function() {
            
            return {
                getSixteen: function(groups){
                    var g = {};
                    angular.forEach(groups, function(value, key){
                        if ( g[value.group] === undefined ) {
                            g[value.group] = {};
                            var team = {points:0,goals:0};
                            g[value.group][value.homeTeamName] = team;
                            g[value.group][value.awayTeamName] = team;
                            g[value.group][groups[key+1].homeTeamName] = team;
                            g[value.group][groups[key+1].awayTeamName] = team;
                        }; 
                        g[value.group][value.homeTeamName].goals += value.homeScore;
                        g[value.group][value.awayTeamName].goals += value.awayScore;
                        
                        if ( value.homeScore > value.awayScore ) {
                            g[value.group][value.homeTeamName].points+=3;
                        } else if ( value.homeScore < value.awayScore ) {
                            g[value.group][value.awayTeamName].points+=3;
                        } else if ( value.homeScore = value.awayScore ) {
                            g[value.group][value.homeTeamName].points+=1;
                            g[value.group][value.awayTeamName].points+=1;
                        }
                    }, g);
                    var s = {};
                    angular.forEach(g, function(value, key){
                        s[value.group] = value;
                    }, s);
                }
            }
        });
app.controller('SixteenCtrl', function($scope, $localStorage, SixteenService) { 
    if ($localStorage.ptwc.group !== undefined)
        $scope.group=angular.copy($localStorage.ptwc.group);
});
app.controller('QuarterCtrl', function($scope, $localStorage) {
});
app.controller('SemiCtrl', function($scope, $localStorage) {
});
app.controller('ThirdCtrl', function($scope, $localStorage) {
});
app.controller('FinalCtrl', function($scope, $localStorage) {
});
app.controller('GroupCtrl', function($scope, $localStorage) {
    $scope.selectedGroup = 'A';

    $scope.filterClass = function(icon) {
        return icon.substr(icon.indexOf('class') + 3, icon.indexOf('title') - 3);
    };

    $scope.$watch(function(newValue, oldValue) {
        if (newValue.group === undefined || $localStorage.ptwc === undefined)
            return;
        $localStorage.ptwc.group=angular.copy(newValue.group);
    });

    if ($localStorage.ptwc.group !== undefined)
        $scope.group=angular.copy($localStorage.ptwc.group);
    else
        $scope.group = [
            {
                "no": "1",
                "group": "A",
                "time": "12/06 17:00",
                "venue": "Sao Paulo ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1047/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43924/index.html",
                "homeTeamIcon": "flagsp flagsp_bra",
                "homeTeamName": "Brazil",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43938/index.html",
                "awayTeamIcon": "flagsp flagsp_cro",
                "awayTeamName": "Croatia"
            },
            {
                "no": "2",
                "group": "A",
                "time": "13/06 13:00",
                "venue": "Natal ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=21518/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43911/index.html",
                "homeTeamIcon": "flagsp flagsp_mex",
                "homeTeamName": "Mexico",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43849/index.html",
                "awayTeamIcon": "flagsp flagsp_cmr",
                "awayTeamName": "Cameroon "
            },
            {
                "no": "17",
                "group": "A",
                "time": "17/06 16:00",
                "venue": "Fortaleza ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=11693/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43924/index.html",
                "homeTeamIcon": "flagsp flagsp_bra",
                "homeTeamName": "Brazil",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43911/index.html",
                "awayTeamIcon": "flagsp flagsp_mex",
                "awayTeamName": "Mexico"
            },
            {
                "no": "18",
                "group": "A",
                "time": "18/06 18:00",
                "venue": "Manaus ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=2037/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43849/index.html",
                "homeTeamIcon": "flagsp flagsp_cmr",
                "homeTeamName": "Cameroon",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43938/index.html",
                "awayTeamIcon": "flagsp flagsp_cro",
                "awayTeamName": "Croatia"
            },
            {
                "no": "33",
                "group": "A",
                "time": "23/06 17:00",
                "venue": "Brasilia ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1143/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43849/index.html",
                "homeTeamIcon": "flagsp flagsp_cmr",
                "homeTeamName": "Cameroon",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43924/index.html",
                "awayTeamIcon": "flagsp flagsp_bra",
                "awayTeamName": "Brazil"
            },
            {
                "no": "34",
                "group": "A",
                "time": "23/06 17:00",
                "venue": "Recife ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=6099/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43938/index.html",
                "homeTeamIcon": "flagsp flagsp_cro",
                "homeTeamName": "Croatia",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43911/index.html",
                "awayTeamIcon": "flagsp flagsp_mex",
                "awayTeamName": "Mexico"
            },
            {
                "no": "3",
                "group": "B",
                "time": "13/06 16:00",
                "venue": "Salvador",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=50071/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43969/index.html",
                "homeTeamIcon": "flagsp flagsp_esp",
                "homeTeamName": "Spain",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43960/index.html",
                "awayTeamIcon": "flagsp flagsp_ned",
                "awayTeamName": "Netherlands"
            },
            {
                "no": "4",
                "group": "B",
                "time": "13/06 18:00",
                "venue": "Cuiaba ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=50053/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43925/index.html",
                "homeTeamIcon": "flagsp flagsp_chi",
                "homeTeamName": "Chile",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43976/index.html",
                "awayTeamIcon": "flagsp flagsp_aus",
                "awayTeamName": "Australia"
            },
            {
                "no": "19",
                "group": "B",
                "time": "18/06 16:00",
                "venue": "Rio De Janeiro ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1141/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43969/index.html",
                "homeTeamIcon": "flagsp flagsp_esp",
                "homeTeamName": "Spain",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43925/index.html",
                "awayTeamIcon": "flagsp flagsp_chi",
                "awayTeamName": "Chile"
            },
            {
                "no": "20",
                "group": "B",
                "time": "18/06 13:00",
                "venue": "Porto Alegre ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1140/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43976/index.html",
                "homeTeamIcon": "flagsp flagsp_aus",
                "homeTeamName": "Australia",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43960/index.html",
                "awayTeamIcon": "flagsp flagsp_ned",
                "awayTeamName": "Netherlands"
            },
            {
                "no": "35",
                "group": "B",
                "time": "23/06 13:00",
                "venue": "Curitiba ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=35400/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43976/index.html",
                "homeTeamIcon": "flagsp flagsp_aus",
                "homeTeamName": "Australia",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43969/index.html",
                "awayTeamIcon": "flagsp flagsp_esp",
                "awayTeamName": "Spain"
            },
            {
                "no": "36",
                "group": "B",
                "time": "23/06 13:00",
                "venue": "Sao Paulo ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1047/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43960/index.html",
                "homeTeamIcon": "flagsp flagsp_ned",
                "homeTeamName": "Netherlands",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43925/index.html",
                "awayTeamIcon": "flagsp flagsp_chi",
                "awayTeamName": "Chile"
            },
            {
                "no": "5",
                "group": "C",
                "time": "14/06 13:00",
                "venue": "Belo Horizonte ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=6783/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43926/index.html",
                "homeTeamIcon": "flagsp flagsp_col",
                "homeTeamName": "Colombia",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43949/index.html",
                "awayTeamIcon": "flagsp flagsp_gre",
                "awayTeamName": "Greece"
            },
            {
                "no": "6",
                "group": "C",
                "time": "14/06 22:00",
                "venue": "Recife ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=6099/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43854/index.html",
                "homeTeamIcon": "flagsp flagsp_civ",
                "homeTeamName": "Côte d'Ivoire",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43819/index.html",
                "awayTeamIcon": "flagsp flagsp_jpn",
                "awayTeamName": "Japan"
            },
            {
                "no": "21",
                "group": "C",
                "time": "19/06 13:00",
                "venue": "Brasilia ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1143/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43926/index.html",
                "homeTeamIcon": "flagsp flagsp_col",
                "homeTeamName": "Colombia",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43854/index.html",
                "awayTeamIcon": "flagsp flagsp_civ",
                "awayTeamName": "Côte d'Ivoire"
            },
            {
                "no": "22",
                "group": "C",
                "time": "19/06 19:00",
                "venue": "Natal ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=21518/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43819/index.html",
                "homeTeamIcon": "flagsp flagsp_jpn",
                "homeTeamName": "Japan",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43949/index.html",
                "awayTeamIcon": "flagsp flagsp_gre",
                "awayTeamName": "Greece"
            },
            {
                "no": "37",
                "group": "C",
                "time": "24/06 16:00",
                "venue": "Cuiaba ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=50053/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43819/index.html",
                "homeTeamIcon": "flagsp flagsp_jpn",
                "homeTeamName": "Japan",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43926/index.html",
                "awayTeamIcon": "flagsp flagsp_col",
                "awayTeamName": "Colombia"
            },
            {
                "no": "38",
                "group": "C",
                "time": "24/06 17:00",
                "venue": "Fortaleza ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=11693/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43949/index.html",
                "homeTeamIcon": "flagsp flagsp_gre",
                "homeTeamName": "Greece",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43854/index.html",
                "awayTeamIcon": "flagsp flagsp_civ",
                "awayTeamName": "Côte d'Ivoire"
            },
            {
                "no": "7",
                "group": "D",
                "time": "14/06 16:00",
                "venue": "Fortaleza ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=11693/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43930/index.html",
                "homeTeamIcon": "flagsp flagsp_uru",
                "homeTeamName": "Uruguay",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43901/index.html",
                "awayTeamIcon": "flagsp flagsp_crc",
                "awayTeamName": "Costa Rica"
            },
            {
                "no": "8",
                "group": "D",
                "time": "14/06 18:00",
                "venue": "Manaus ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=2037/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43942/index.html",
                "homeTeamIcon": "flagsp flagsp_eng",
                "homeTeamName": "England",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43954/index.html",
                "awayTeamIcon": "flagsp flagsp_ita",
                "awayTeamName": "Italy"
            },
            {
                "no": "23",
                "group": "D",
                "time": "19/06 16:00",
                "venue": "Sao Paulo ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1047/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43930/index.html",
                "homeTeamIcon": "flagsp flagsp_uru",
                "homeTeamName": "Uruguay",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43942/index.html",
                "awayTeamIcon": "flagsp flagsp_eng",
                "awayTeamName": "England"
            },
            {
                "no": "24",
                "group": "D",
                "time": "20/06 13:00",
                "venue": "Recife ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=6099/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43954/index.html",
                "homeTeamIcon": "flagsp flagsp_ita",
                "homeTeamName": "Italy",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43901/index.html",
                "awayTeamIcon": "flagsp flagsp_crc",
                "awayTeamName": "Costa Rica"
            },
            {
                "no": "39",
                "group": "D",
                "time": "24/06 13:00",
                "venue": "Natal ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=21518/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43954/index.html",
                "homeTeamIcon": "flagsp flagsp_ita",
                "homeTeamName": "Italy",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43930/index.html",
                "awayTeamIcon": "flagsp flagsp_uru",
                "awayTeamName": "Uruguay"
            },
            {
                "no": "40",
                "group": "D",
                "time": "24/06 13:00",
                "venue": "Belo Horizonte ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=6783/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43901/index.html",
                "homeTeamIcon": "flagsp flagsp_crc",
                "homeTeamName": "Costa Rica",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43942/index.html",
                "awayTeamIcon": "flagsp flagsp_eng",
                "awayTeamName": "England"
            },
            {
                "no": "9",
                "group": "E",
                "time": "15/06 13:00",
                "venue": "Brasilia ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1143/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43971/index.html",
                "homeTeamIcon": "flagsp flagsp_sui",
                "homeTeamName": "Switzerland",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43927/index.html",
                "awayTeamIcon": "flagsp flagsp_ecu",
                "awayTeamName": "Ecuador"
            },
            {
                "no": "10",
                "group": "E",
                "time": "15/06 16:00",
                "venue": "Porto Alegre ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1140/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43946/index.html",
                "homeTeamIcon": "flagsp flagsp_fra",
                "homeTeamName": "France",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43909/index.html",
                "awayTeamIcon": "flagsp flagsp_hon",
                "awayTeamName": "Honduras"
            },
            {
                "no": "25",
                "group": "E",
                "time": "20/06 16:00",
                "venue": "Salvador",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=50071/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43971/index.html",
                "homeTeamIcon": "flagsp flagsp_sui",
                "homeTeamName": "Switzerland",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43946/index.html",
                "awayTeamIcon": "flagsp flagsp_fra",
                "awayTeamName": "France"
            },
            {
                "no": "26",
                "group": "E",
                "time": "20/06 19:00",
                "venue": "Curitiba ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=35400/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43909/index.html",
                "homeTeamIcon": "flagsp flagsp_hon",
                "homeTeamName": "Honduras",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43927/index.html",
                "awayTeamIcon": "flagsp flagsp_ecu",
                "awayTeamName": "Ecuador"
            },
            {
                "no": "41",
                "group": "E",
                "time": "25/06 16:00",
                "venue": "Manaus ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=2037/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43909/index.html",
                "homeTeamIcon": "flagsp flagsp_hon",
                "homeTeamName": "Honduras",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43971/index.html",
                "awayTeamIcon": "flagsp flagsp_sui",
                "awayTeamName": "Switzerland"
            },
            {
                "no": "42",
                "group": "E",
                "time": "25/06 17:00",
                "venue": "Rio De Janeiro ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1141/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43927/index.html",
                "homeTeamIcon": "flagsp flagsp_ecu",
                "homeTeamName": "Ecuador",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43946/index.html",
                "awayTeamIcon": "flagsp flagsp_fra",
                "awayTeamName": "France"
            },
            {
                "no": "11",
                "group": "F",
                "time": "15/06 19:00",
                "venue": "Rio De Janeiro ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1141/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43922/index.html",
                "homeTeamIcon": "flagsp flagsp_arg",
                "homeTeamName": "Argentina",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=44037/index.html",
                "awayTeamIcon": "flagsp flagsp_bih",
                "awayTeamName": "Bosnia-Herzegovina"
            },
            {
                "no": "12",
                "group": "F",
                "time": "16/06 16:00",
                "venue": "Curitiba ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=35400/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43817/index.html",
                "homeTeamIcon": "flagsp flagsp_irn",
                "homeTeamName": "Iran",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43876/index.html",
                "awayTeamIcon": "flagsp flagsp_nga",
                "awayTeamName": "Nigeria"
            },
            {
                "no": "27",
                "group": "F",
                "time": "21/06 13:00",
                "venue": "Belo Horizonte ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=6783/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43922/index.html",
                "homeTeamIcon": "flagsp flagsp_arg",
                "homeTeamName": "Argentina",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43817/index.html",
                "awayTeamIcon": "flagsp flagsp_irn",
                "awayTeamName": "Iran"
            },
            {
                "no": "28",
                "group": "F",
                "time": "21/06 18:00",
                "venue": "Cuiaba ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=50053/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43876/index.html",
                "homeTeamIcon": "flagsp flagsp_nga",
                "homeTeamName": "Nigeria",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=44037/index.html",
                "awayTeamIcon": "flagsp flagsp_bih",
                "awayTeamName": "Bosnia-Herzegovina"
            },
            {
                "no": "43",
                "group": "F",
                "time": "25/06 13:00",
                "venue": "Porto Alegre ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1140/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43876/index.html",
                "homeTeamIcon": "flagsp flagsp_nga",
                "homeTeamName": "Nigeria",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43922/index.html",
                "awayTeamIcon": "flagsp flagsp_arg",
                "awayTeamName": "Argentina"
            },
            {
                "no": "44",
                "group": "F",
                "time": "25/06 13:00",
                "venue": "Salvador",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=50071/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=44037/index.html",
                "homeTeamIcon": "flagsp flagsp_bih",
                "homeTeamName": "Bosnia-Herzegovina",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43817/index.html",
                "awayTeamIcon": "flagsp flagsp_irn",
                "awayTeamName": "Iran"
            },
            {
                "no": "13",
                "group": "G",
                "time": "16/06 13:00",
                "venue": "Salvador",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=50071/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43948/index.html",
                "homeTeamIcon": "flagsp flagsp_ger",
                "homeTeamName": "Germany",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43963/index.html",
                "awayTeamIcon": "flagsp flagsp_por",
                "awayTeamName": "Portugal"
            },
            {
                "no": "14",
                "group": "G",
                "time": "16/06 19:00",
                "venue": "Natal ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=21518/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43860/index.html",
                "homeTeamIcon": "flagsp flagsp_gha",
                "homeTeamName": "Ghana",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43921/index.html",
                "awayTeamIcon": "flagsp flagsp_usa",
                "awayTeamName": "USA"
            },
            {
                "no": "29",
                "group": "G",
                "time": "21/06 16:00",
                "venue": "Fortaleza ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=11693/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43948/index.html",
                "homeTeamIcon": "flagsp flagsp_ger",
                "homeTeamName": "Germany",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43860/index.html",
                "awayTeamIcon": "flagsp flagsp_gha",
                "awayTeamName": "Ghana"
            },
            {
                "no": "30",
                "group": "G",
                "time": "22/06 18:00",
                "venue": "Manaus ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=2037/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43921/index.html",
                "homeTeamIcon": "flagsp flagsp_usa",
                "homeTeamName": "USA",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43963/index.html",
                "awayTeamIcon": "flagsp flagsp_por",
                "awayTeamName": "Portugal"
            },
            {
                "no": "45",
                "group": "G",
                "time": "26/06 13:00",
                "venue": "Recife ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=6099/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43921/index.html",
                "homeTeamIcon": "flagsp flagsp_usa",
                "homeTeamName": "USA",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43948/index.html",
                "awayTeamIcon": "flagsp flagsp_ger",
                "awayTeamName": "Germany"
            },
            {
                "no": "46",
                "group": "G",
                "time": "26/06 13:00",
                "venue": "Brasilia ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1143/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43963/index.html",
                "homeTeamIcon": "flagsp flagsp_por",
                "homeTeamName": "Portugal",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43860/index.html",
                "awayTeamIcon": "flagsp flagsp_gha",
                "awayTeamName": "Ghana"
            },
            {
                "no": "15",
                "group": "H",
                "time": "17/06 13:00",
                "venue": "Belo Horizonte ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=6783/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43935/index.html",
                "homeTeamIcon": "flagsp flagsp_bel",
                "homeTeamName": "Belgium",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43843/index.html",
                "awayTeamIcon": "flagsp flagsp_alg",
                "awayTeamName": "Algeria"
            },
            {
                "no": "16",
                "group": "H",
                "time": "17/06 18:00",
                "venue": "Cuiaba ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=50053/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43965/index.html",
                "homeTeamIcon": "flagsp flagsp_rus",
                "homeTeamName": "Russia",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43822/index.html",
                "awayTeamIcon": "flagsp flagsp_kor",
                "awayTeamName": "Korea Republic"
            },
            {
                "no": "31",
                "group": "H",
                "time": "22/06 13:00",
                "venue": "Rio De Janeiro ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1141/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43935/index.html",
                "homeTeamIcon": "flagsp flagsp_bel",
                "homeTeamName": "Belgium",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43965/index.html",
                "awayTeamIcon": "flagsp flagsp_rus",
                "awayTeamName": "Russia"
            },
            {
                "no": "32",
                "group": "H",
                "time": "22/06 16:00",
                "venue": "Porto Alegre ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1140/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43822/index.html",
                "homeTeamIcon": "flagsp flagsp_kor",
                "homeTeamName": "Korea Republic",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43843/index.html",
                "awayTeamIcon": "flagsp flagsp_alg",
                "awayTeamName": "Algeria"
            },
            {
                "no": "47",
                "group": "H",
                "time": "26/06 17:00",
                "venue": "Sao Paulo ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=1047/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43822/index.html",
                "homeTeamIcon": "flagsp flagsp_kor",
                "homeTeamName": "Korea Republic",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43935/index.html",
                "awayTeamIcon": "flagsp flagsp_bel",
                "awayTeamName": "Belgium"
            },
            {
                "no": "48",
                "group": "H",
                "time": "26/06 17:00",
                "venue": "Curitiba ",
                "venue_link": "http://www.fifa.com/worldcup/destination/cities/city=35400/index.html",
                "homeTeamLink": "http://www.fifa.com/worldcup/teams/team=43843/index.html",
                "homeTeamIcon": "flagsp flagsp_alg",
                "homeTeamName": "Algeria",
                "awayTeamLink": "http://www.fifa.com/worldcup/teams/team=43965/index.html",
                "awayTeamIcon": "flagsp flagsp_rus",
                "awayTeamName": "Russia"
            }
        ];
});
