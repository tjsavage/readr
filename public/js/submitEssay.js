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

app.controller('EssayUploaderCtrl', function($scope) {
    $scope.uploadedEssay = false;
    $scope.selectedFileToUpload;

    $scope.changedEssayText = function() {
        if (!$scope.uploadedEssay) {
            $scope.$parent.selectEssay($scope.essayText);
        }
    };

    $scope.blurredEssayText = function() {
        $scope.focused = false;
        $scope.$parent.goToNext();
    };

    $scope.removeFiles = function() {
        var element = document.getElementById("essayFile");
        element.value = "";
        $scope.file = null;
        $scope.uploadedEssay = false;
        $scope.selectedFileToUpload = false;
    };

    $scope.setFiles = function() {
        $scope.$apply(function(scope) {
            var element = document.getElementById("essayFile");
            console.log('scope: ', scope.essayText);
            scope.file = element.files[0];
            scope.uploadedEssay = true;
            scope.selectedFileToUpload = true;
            //scope.$parent.goToNext();
        });
            
    }
});

app.controller('SubmitEssayCtrl', function($scope, $location, $anchorScroll, School) {
    $scope.currentSection = 1;
    $scope.seenAllSections = false;
    $scope.numSections = 3;
    $scope.selectedSchool = null;
    $scope.selectedPrompt = null;
    $scope.selectedEssay = null;
    $scope.allReady = false;

    $scope.checkIfReady = function() {
        if ($scope.selectedSchool != null && 
            $scope.selectedPrompt != null &&
            $scope.selectedEssay != null) {
            $scope.allReady = true;
        } else {
            console.log($scope.selectedSchool, $scope.selectedPrompt, $scope.selectedEssay);
            $scope.allReady = false;
        }
        console.log("Ready:",$scope.allReady);
    };

    $scope.goToSchool = function() {
        $scope.allReady = false;
        $scope.currentSection = 1;
        $location.hash('submit-school');
        $anchorScroll();
    };

    $scope.goToPrompts = function() {
        $scope.allReady = false;
        $scope.currentSection = 2;
        $location.hash('submit-prompt');
        $anchorScroll();
    };

    $scope.goToUpload = function() {
        $scope.currentSection = 3;
        $location.hash('submit-upload');
        $anchorScroll();
    };

    $scope.goToNext = function() {
        $scope.currentSection = 4;
        $location.hash('submit-next');
        $anchorScroll();
    };

    $scope.selectSchool = function(school) {
        $scope.selectedSchool = school;

        $scope.selectedPrompt = null;
        var promptsPromise = $scope.selectedSchool.loadPrompts();
        promptsPromise.then(function(prompts) {
            $scope.goToPrompts();
        });

        $scope.checkIfReady();
    };

    $scope.selectPrompt = function(prompt) {
        $scope.selectedPrompt = prompt;
        $scope.goToUpload();

        $scope.checkIfReady();
    };

    $scope.selectEssay = function(essay) {
        $scope.selectedEssay = essay;

        $scope.checkIfReady();
    };

    $scope.clickedSection = function(sectionId) {
        if (sectionId < $scope.currentSection) {
            switch (sectionId) {
                case 1:
                    $scope.goToSchool();
                    break;
                case 2:
                    $scope.goToPrompts();
                    break;
                case 3:
                    $scope.goToUpload();
                    break;
                case 4:
                    $scope.goToNext();
                    break;
            }
        }   
    };

    $scope.submit = function() {
        console.log("submit");
    }
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
