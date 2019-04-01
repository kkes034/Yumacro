var DETAILOPTIONMODEL = angular.module('detailOptionModel', []);
DETAILOPTIONMODEL.controller('userCtrl', function($scope) {
	$scope.index = '';
	$scope.name = '';
	$scope.action = '';
	
	$scope.editX = function(id) {
		console.log("click");
		// window.open("../../html/detailPageMenu/detailPageMenuOption.html",
		// "width=800, height=700, resizable=yes" );
	};

	$scope.mousePositionSelect = function (data, event) {
		localStorage.setItem("clickPositionFlag", "true");
	};

	$scope.saveActionButton = function (data, event) {
		var actionX = localStorage.getItem("actionX");
		var actionY = localStorage.getItem("actionY");
		var targetId = localStorage.getItem("targetId");
		localData = localDataStorage( 'passphrase.life' );
		var scenarioDum = localData.get('scenario');
		scenarioDum[targetId].actionX = actionX;
		scenarioDum[targetId].actionY = actionY;
		localData.set('scenario',scenarioDum);
		window.close();
	};
});