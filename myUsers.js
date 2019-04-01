var INDEXMODEL = angular.module('myApp', []);
INDEXMODEL.controller('userCtrl', function($scope) {
	$scope.category = [ {
		id : 1,
		title : "모험자동"
	}, {
		id : 2,
		title : "계정바꿈"
	} ];
	$scope.openScenario = function(title) {
		window.open('html/detailPageMenu/detailPageMenu.html', '',
				'height=400px, width=350px, resizable=yes');
	};
});