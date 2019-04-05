//scenario가 시작되면 localData로부터 scenario 객체 정보를 받아와 action 순서대로 실행되며 각 action 안에는 상세 정보가 포함되어 있다.

var TRANSPARENTMODEL = angular.module('transparentModel', [ 'ngDraggable' ]);
TRANSPARENTMODEL.controller('userCtrl', function($scope) {
	$scope.button = false;
	$scope.clickFlag = false;

	$scope.transparentBarMouseOver = function(button, event) {
		var win = require('electron').remote.getCurrentWindow();
		win.setIgnoreMouseEvents(false);
	};

//	무조건 false로 바꾸고 기존
	$scope.transparentBarMouseLeave = function(button, event) {
		var win = require('electron').remote.getCurrentWindow();
		if ($scope.clickFlag == false) {
			win.setIgnoreMouseEvents(false);
		}
		else {
		}
		$scope.clickFlag = false;
	};

	$scope.transparentBarMouseClick = function(button, event) {
		$scope.clickFlag = true
		if ($scope.button==false) {
			$scope.button = true;
			var win = require('electron').remote.getCurrentWindow();
			win.setIgnoreMouseEvents(true, { forward: true });
			document.getElementById("dragBarButton").style.backgroundColor="#00ff00";
		}
		else {
			$scope.button = false;
			var win = require('electron').remote.getCurrentWindow();
			win.setIgnoreMouseEvents(false);
			document.getElementById("dragBarButton").style.backgroundColor="#e0e0eb";
		}
	};

	$scope.transparentWindowClick = function($data, $event) {
		var robot = require("robotjs");
		if (localStorage.getItem("clickPositionFlag") == "true") {
			localStorage.setItem("clickPositionFlag", "false");
			var position = robot.getMousePos();
			var screen = {
					width : window.screen.width,
					height : window.screen.height,	
			};
			var robotScreen = robot.getScreenSize();
			var windowLeft = window.screenLeft/screen.width*robotScreen.width;
			var windowTop = window.screenTop/screen.height*robotScreen.height;
			var positionX = position.x - windowLeft;
			var positionY = position.y - windowTop;
			localStorage.setItem("actionX",positionX);
			localStorage.setItem("actionY",positionY);
		}
		else {
			console.log("no_click!!!!!");
		}
	}

});


function scenarioProcessingCore() {
	var delayCountInterval
	var scenario = {};
	var inspectStartFlag = setInterval(function(){		
		if (localStorage.getItem("scenarioStartFlag")=="true") {
			localStorage.setItem("scenarioStartFlag","false");
			localData = localDataStorage( 'passphrase.life' );
			scenario = localData.get("scenario");
//			clearInterval(inspectStartFlag);
			// cancel하고 restart 하였을 경우 기존의 interval을 멈추고 시작.
			if (delayCountInterval != undefined) {
				clearInterval(delayCountInterval);
			}
			var i = 0;
			var delayIdx = 1;
			delayCountInterval = setInterval(function(){
//				i = moveToWhere(scenario[i], i);
//				console.log("i값은 : " + i);
				if (i == scenario.length) {
					clearInterval(delayCountInterval);
				} else {
					if (localStorage.getItem("scenarioStopFlag")=="true") {
						clearInterval(delayCountInterval);
					}
					// move action일 때 i 값을 바꾸기 위한 logic
					var k = countScenario(scenario[i], i);

					switch (scenario[i].action) {
					case "move":
						i = k;
						break;
					case "timeDelay":
						if (delayIdx == k) {
							i++;
							delayIdx = 1;
						}
						else {
							delayIdx++;
						}
						break;
					default:
						i++;
					break;
					}
				}
			}, 1000);
		}
		else {
		}
	}, 1000);
}

function countScenario(eachScenario, i) {
	var j = i;
	var robot = require("robotjs");
	robot.setMouseDelay(2);

	switch (eachScenario.action) {
	case "click":
		var screen = {
			width : window.screen.width,
			height : window.screen.height,	
	};
		var robotScreen = robot.getScreenSize();
		var windowLeft = window.screenLeft/screen.width*robotScreen.width;
		var windowTop = window.screenTop/screen.height*robotScreen.height;
		var x = parseInt(eachScenario.actionX) + windowLeft;
		var y = parseInt(eachScenario.actionY) + windowTop;
		robot.moveMouse(x, y);
		robot.mouseClick();
		break;
	case "move":
		j = parseInt(eachScenario.moveTo);
		break;
	case "timeDelay":
		j = parseInt(eachScenario.delay);
		break;
	default:
		console.log("지원하지 않습니다");
	break;
	}

	return j;
}	
