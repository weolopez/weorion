var strVar = "";
strVar += "<div class=\"modal-header\">";
strVar += "    New plan";
strVar += "<\/div>";
strVar += "<div class=\"modal-body\">";
strVar += "    <form name=\"myForm\">";
strVar += "        <div class=\"control-group\" ng-class=\"{error: myForm.name.$invalid}\">";
strVar += "            <label>Name<\/label>";
strVar += "            <input type=\"text\" name=\"name\" ng-model=\"project.name\" required>";
strVar += "            <span ng-show=\"myForm.name.$error.required\" class=\"help-inline\">";
strVar += "                Required<\/span>";
strVar += "        <\/div>";
strVar += "";
strVar += "        <div class=\"control-group\" ng-class=\"{error: myForm.site.$invalid}\">";
strVar += "            <label>Website<\/label>";
strVar += "            <input type=\"url\" name=\"site\" ng-model=\"project.site\" required>";
strVar += "            <span ng-show=\"myForm.site.$error.required\" class=\"help-inline\">";
strVar += "                Required<\/span>";
strVar += "            <span ng-show=\"myForm.site.$error.url\" class=\"help-inline\">";
strVar += "                Not a URL<\/span>";
strVar += "        <\/div>";
strVar += "";
strVar += "        <label>Description<\/label>";
strVar += "        <textarea name=\"description\" ng-model=\"project.description\"><\/textarea>";
strVar += "";
strVar += "        <br>";
strVar += "        <div class=\"modal-footer\">";
strVar += "            <!--a href=\"#\/\" class=\"btn\">Cancel<\/a-->";
strVar += "            <button ng-click=\"close(result)\" class=\"btn btn-primary\" >Close<\/button>";
strVar += "            <button ng-click=\"save()\" ng-disabled=\"isClean() || myForm.$invalid\"";
strVar += "                    class=\"btn btn-primary\">Save<\/button>";
strVar += "            <button ng-click=\"destroy()\"";
strVar += "                    ng-show=\"project._id\" class=\"btn btn-danger\">Delete<\/button>";
strVar += "        <\/div>";
strVar += "    <\/form>";
strVar += "<\/div>";
strVar += "";


angular.module('buttonDialogModule', ['ui.bootstrap.dialog', 'ngResource']).
factory('Project', function($resource) {
    var Project = $resource('https://api.mongolab.com/api/1/databases' +
            '/weolopez/collections/projects/:id',
            {apiKey: '50f36e05e4b0b9deb24829a0'}, {
        update: {method: 'PUT'}
    });

    Project.prototype.update = function(cb) {
        return Project.update({id: this._id.$oid},
        angular.extend({}, this, {_id: undefined}), cb);
    };

    Project.prototype.destroy = function(cb) {
        return Project.remove({id: this._id.$oid}, cb);
    };

    return Project;
});


function ListCtrl($scope, Project, $dialog, $rootScope) {
    $scope.projects = Project.query();

    $scope.createOpts = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        template: strVar, // OR: 	    templateUrl: 'detail.html',
        controller: 'CreateCtrl'
    };

    $scope.createDialog = function() {
        var d = $dialog.dialog($scope.createOpts);
        d.open().then(function(result) {
            if (result)
            {
                alert('dialog closed with result: ' + result);
            }
        });
    };

    $scope.editOpts = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        template: strVar, // OR: 	    templateUrl: 'detail.html',
        controller: 'EditCtrl'
    };

    $scope.editDialog = function(projectId) {
        $rootScope.projectID = projectId;
        var d = $dialog.dialog($scope.editOpts);
        d.open().then(function(result) {
            if (result)
            {
                alert('dialog closed with result: ' + result);
            }
        });
    };

}

function CreateCtrl($scope, Project, dialog) {

    $scope.save = function() {
        Project.save($scope.project, function(project) {
            dialog.close();
        });
    };

}

function EditCtrl($scope, Project, dialog, $rootScope) {
    var self = this;


    Project.get({id: $rootScope.projectID}, function(project) {
        self.original = project;
        $scope.project = new Project(self.original);
    });

    $scope.isClean = function() {
        return angular.equals(self.original, $scope.project);
    }

    $scope.destroy = function() {
        self.original.destroy(function() {
            dialog.close();
        });
    };

    $scope.save = function() {
        $scope.project.update(function() {
            $dialog.close("Save Success");
        });
    };

    $scope.close = function(result) {
        dialog.close(result);
    };
}
