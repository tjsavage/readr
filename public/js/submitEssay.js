var app = angular.module('ngSubmitForm', []);

app.controller('SchoolPickerCtrl', function($scope, School) {
    var schoolsPromise = School.getAll();
    schoolsPromise.then(function(schools) {
        $scope.allSchools = schools;

        angular.forEach($scope.allSchools, function(school) {
            $scope.schools.push(school);
        });
    });

    $scope.schools = [];

    $scope.select = function(school) {
        $scope.$parent.selectSchool(school);
    };

});

app.controller('PromptPickerCtrl', function($scope, School) {
    $scope.select = function(prompt) {
        $scope.$parent.selectPrompt(prompt);
    };
});

app.controller('SubmitEssayCtrl', function($scope, School) {
    $scope.currentSection = 1;
    $scope.seenAllSections = false;
    $scope.numSections = 3;
    $scope.selectedSchool = null;
    $scope.selectedPrompt = null;

    $scope.nextSection = function() {
        $scope.currentSection++;
        if ($scope.currentSection == $scope.numSections) {
            $scope.seenAllSections = true;
        }
    };

    $scope.goToPrompts = function() {
        $scope.currentSection = 2;
    };

    $scope.goToUpload = function() {
        $scope.currentSection = 3;
    };

    $scope.selectSchool = function(school) {
        $scope.selectedSchool = school;
        var promptsPromise = $scope.selectedSchool.loadPrompts();
        promptsPromise.then(function(prompts) {
            $scope.goToPrompts();
        });
    };

    $scope.selectPrompt = function(prompt) {
        $scope.selectedPrompt = prompt;
        $scope.nextSection();
    };

    $scope.clickedSection = function(sectionId) {
        if ($scope.seenAllSections && $scope.currentSection != sectionId) {
            $scope.currentSection = sectionId;
        }
    };
});

app.factory('School', function($http) {
    var School = function(data) {
        angular.extend(this, data);
    };

    School.getAll = function() {
        var url = '/api/schools/';
        return $http.get(url).then(function(response) {
            var schools = [];
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                var school = new School(response.data[i]);
                schools.push(school);
            }
            return schools;
        });
    };

    School.get = function(schoolId) {
        var url = '/api/schools/' + schoolId;
        return $http.get(url).then(function(response) {
            return new School(response.data);
        });
    };

    School.prototype.loadPrompts = function() {
        var url = '/api/schools/' + this.id + '/prompts';
        return $http.get(url).then(function(response) {
            this.prompts = response.data;
            return this.prompts;
        }.bind(this));
    };

    return School;
});