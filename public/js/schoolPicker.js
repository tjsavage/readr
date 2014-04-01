var app = angular.module('ngSubmitForm', [])

app.controller('SchoolPickerCtrl', function($scope) {
    $scope.allSchools = [
        {
            name:'Stanford',
            id: 1
        },
        {
            name: 'Harvard',
            id: 2
        },
        {
            name: 'Swarthmore',
            id: 3
        }
    ];

    $scope.schools = [];

    angular.forEach($scope.allSchools, function(school) {
        $scope.schools.push(school);
    });

    $scope.select = function(schoolId) {
        console.log(schoolId);
    }

});