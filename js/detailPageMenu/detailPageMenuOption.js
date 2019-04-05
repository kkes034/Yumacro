var DETAILOPTIONMODEL = angular.module('detailOptionModel', []);
DETAILOPTIONMODEL.controller('userCtrl', function($scope) {
	$scope.index = '';
	$scope.name = '';
	$scope.action = '';
	$scope.moveNum = 0;
	$scope.tDelay = 1;
	$scope.actionX = 0;
	$scope.actionY = 0;
	
	$scope.editX = function(id) {
		console.log("click");
		// window.open("../../html/detailPageMenu/detailPageMenuOption.html",
		// "width=800, height=700, resizable=yes" );
	};

	$scope.mousePositionSelect = function (data, event) {
		localStorage.setItem("clickPositionFlag", "true");
	};

	$scope.saveActionButton = function (data, event) {
		var actionType = localStorage.getItem("targetAction");
		localData = localDataStorage( 'passphrase.life' );
		var scenarioDum = localData.get('scenario');
		var targetId = localStorage.getItem("targetId");
		
		switch (actionType) {
		case "click":
			$scope.actionX = localStorage.getItem("actionX");
			$scope.actionY = localStorage.getItem("actionY");
			
			scenarioDum[targetId].actionX = $scope.actionX;
			scenarioDum[targetId].actionY = $scope.actionY;
			break;
		case "move":
			scenarioDum[targetId].moveTo = $scope.moveNum;
//			localStorage.setItem("moveTo", moveNum);
			break;
		case "timeDelay":
			scenarioDum[targetId].delay = $scope.tDelay;
//			document.getElementById("optionContextContainer").innerHTML = delayHTML;
			break;
		default:
			console.log("지원하지 않습니다");
			break;
		}
		
		localData.set('scenario',scenarioDum);
		window.close();

	};
});