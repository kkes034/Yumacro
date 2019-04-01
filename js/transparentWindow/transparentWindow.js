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
			localStorage.setItem("actionX",position.x);
			localStorage.setItem("actionY",position.y);
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
			delayCountInterval = setInterval(function(){
				if (i==scenario.length) {
					clearInterval(delayCountInterval);
				} else {
					if (localStorage.getItem("scenarioStopFlag")=="true") {
						clearInterval(delayCountInterval);
					}
					countScenario(scenario[i]);
				}
				i++;
			}, 1000);
		}
		else {
		}
	}, 1000);
}

function countScenario(eachScenario) {
	var robot = require("robotjs");
	robot.setMouseDelay(2);
	var screenSize = robot.getScreenSize();
	console.log("screenSize = " + screenSize);
	var height = (screenSize.height / 2) - 10;
	console.log("height = " + height);
	var width = screenSize.width;
	console.log("width = " + width);

	switch (eachScenario.action) {
	case "click":
		var x = 800;
		var y = 600;
		robot.moveMouse(x, y);
		robot.mouseClick();
//		click(15,95);
//		console.log("click(x,y)");

		break;
	case "move":
		console.log("move");
		break;
	case "timeDelay":
		console.log("timeDelay");
		break;
	default:
		console.log("지원하지 않습니다");
	break;
	}
}	

function click(x,y) {
	var ev = document.createEvent("MouseEvent");
	var el = document.elementFromPoint(x,y);
	ev.initMouseEvent(
			"click",
			true /* bubble */, true /* cancelable */,
			window, null,
			x, y, 0, 0, /* coordinates */
			false, false, false, false, /* modifier keys */
			0 /* left */, null
	);
	el.dispatchEvent(ev);
	return el;
}