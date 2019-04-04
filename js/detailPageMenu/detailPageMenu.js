DETAILMODEL = angular.module('detailModel', [ 'ngDraggable' ]);

DETAILMODEL
.controller(
		'userCtrl',
		function($scope, $timeout) {
			$scope.index = '';
			$scope.name = '';
			$scope.action = '';
			$scope.dropId = 0;
			$scope.timeDelayInterval;
			// 파일로부터 user 정보 읽어 들여야 함
			$scope.users = [ {
				id : 0,
				name : 'set',
				action : "setVar",
				actionFlag : false
			}, {
				id : 1,
				name : 'time',
				action : "timeDelay",
				actionFlag : false
			}, {
				id : 2,
				name : 'image',
				action : "imageSearching",
				actionFlag : false
			}, {
				id : 3,
				name : 'comp',
				action : "compColor",
				actionFlag : false
			}, {
				id : 4,
				name : 'move',
				action : "move",
				actionFlag : false
			}, {
				id : 5,
				name : 'click',
				action : "click",
				actionFlag : false
			} ];
			$scope.actions = [ {
				id : 0,
				name : '',
				action : 'click',
				actionFlag : true,
				actionX : 0,
				actionY : 0
			}, {
				id : 1,
				name : '',
				action : 'move',
				actionFlag : true,
				moveTo : 1
			}, {
				id : 2,
				name : '',
				action : 'timeDelay',
				actionFlag : true,
				delay : 1
			} ];

			localData = localDataStorage('passphrase.life');
			localData.set("scenario", $scope.users);
			
			$scope.colorReset = function() {
				var j = 0;
				for (j; j<$scope.users.length; j++) {
					document.getElementById("detailCell_"
							+ $scope.users[j].id).style.backgroundColor = "#e0e0eb";						
				}
			};

			$scope.goToLink = function(index) {
				$scope.colorReset();
				document.getElementById("detailCell_"+index.id).style.backgroundColor = "#e6e600";
			};
			
			$scope.editOption = function(id) {
				localStorage.setItem("targetId",id);
				window
				.open(
						"../../html/detailPageMenu/detailPageMenuOption.html",
						'',
				"width=300, height=300, resizable=yes");
			};

			$scope.detailDropComplete = function(idx, data, event) {
				var dropId = $scope.users[idx].id;
				var actionsLength = $scope.actions.length;
				var usersLength = $scope.users.length;
				$scope.dropId = dropId; // 이후에 dialog에서 값을 가져오기 위함
				var a = DETAILMODEL.controller.$scope;
				
				if (event.x > window.innerWidth*0.7) {
					var i = data.id + 1;
					for (i; i < usersLength; i++) {
						$scope.users[i].id = $scope.users[i].id - 1;
					}
					$scope.users.splice(data.id,1);					
				} 
				else {
					if (event.data.actionFlag == false) { // 시나리오만 수정할 때
						if (event.data.id < idx) {
							var i = event.data.id + 1;
							for (i; i <= idx; i++) {
								$scope.users[i].id = $scope.users[i].id - 1;
							}
							$scope.users[event.data.id].id = dropId;
						} else if (event.data.id > idx) {
							var i = dropId;
							for (i; i < event.data.id; i++) {
								$scope.users[i].id = $scope.users[i].id + 1;
							}
							$scope.users[event.data.id].id = dropId;
						} else {
							return;
						}
					} else { // 새 action을 시나리오에 추가할 때
						var i = dropId + 1;
						for (i; i < usersLength; i++) {
							$scope.users[i].id = $scope.users[i].id + 1;
						}
						$scope.users[usersLength] = {};
						$scope.users[usersLength].id = dropId + 1;
						$scope.users[usersLength].name = event.data.name;
						$scope.users[usersLength].action = event.data.action;
						$scope.users[usersLength].actionFlag = false;

						// action에 따라서 객체 할당 (mouse일 때 actionX actionY, move일 때 toMove, delay일 때 delay)
						switch (event.data.action) {
						case "click":
							$scope.users[usersLength].actionX = event.data.actionX;
							$scope.users[usersLength].actionY = event.data.actionY;
						case "move":
							$scope.users[usersLength].toMove = event.data.toMove;
							break;
						case "timeDelay":
							$scope.users[usersLength].delay = event.data.delay;
							break;
						default:
							console.log("지원하지 않습니다");
						break;
						}					
						showDialog();
					}
					
				}

				sortingArray();
				localData = localDataStorage('passphrase.life');
				localData.set("scenario",$scope.users);
			};

			$scope.saveActionName = function(actionName) {
				$scope.users[$scope.dropId + 1].name = actionName;
				localData = localDataStorage('passphrase.life');
				localData.set("scenario",$scope.users);
				$scope.name = '';
				closeDialog();
			};

			$scope.cancelActionName = function() {
				$scope.users.splice($scope.dropId + 1, 1);
				sortingArray();
				var i = 0;
				for (i; i < $scope.users.length; i++) {
					$scope.users[i].id = i;
				}
				closeDialog();
			};

			$scope.startScenario = function() {
				$scope.colorReset();
				localStorage.setItem("scenarioStartFlag", "true");

				var i = 0;
				var delayTime = 1;
				var colorSwitch = true;
//				start 상태에서 또 start 눌렀을 경우 기존 event 종료 및 색깔 초기화
				if ($scope.timeDelayInterval != undefined) {
					var j = 0;
					for (j; j<$scope.users.length; j++) {
						document.getElementById("detailCell_"
								+ $scope.users[j].id).style.backgroundColor = "#e0e0eb";						
					}
					clearInterval($scope.timeDelayInterval);
				}
//				색깔 count 시작
				$scope.timeDelayInterval = setInterval(function(){
					if (localStorage.getItem("scenarioStopFlag")=="true") {
						clearInterval($scope.timeDelayInterval);
						localStorage.setItem("scenarioStopFlag","false");
						colorSwitch = false;
					} 
					if (i > $scope.users.length-1) {
						document.getElementById("detailCell_"
								+ $scope.users[i - 1].id).style.backgroundColor = "#e0e0eb";
						clearInterval($scope.timeDelayInterval);
					} else {
						$scope.countScenario(i,colorSwitch);
					}
					i++;
				},1000*delayTime);

//				아래는 setInterval이 아닌 setTimeout으로 구현하였을 때
//				var timeDelayInterval = function() {
//				if (i > $scope.users.length-1) {
//				document.getElementById("detailCell_"
//				+ $scope.users[i - 1].id).style.backgroundColor = "#e0e0eb";
//				return 0;
//				} else {
//				$timeout(function() {
//				timeDelayInterval();
//				}, delayTime * 1000);
//				}
//				$scope.countScenario(i);
//				i++;
//				}
//				timeDelayInterval();
			};

			$scope.countScenario = function(i,colorSwitch) {
				if (i !== 0) {
					document.getElementById("detailCell_"
							+ $scope.users[i - 1].id).style.backgroundColor = "#e0e0eb";
				}
				if (colorSwitch == true) {
					document.getElementById("detailCell_"
							+ $scope.users[i].id).style.backgroundColor = "#ff8080";
				}
				else {
				}
			};

			$scope.stopScenario = function(data, event) {
				localData = localDataStorage( 'passphrase.life' );
				localStorage.setItem("scenarioStopFlag", "true");
			};

			function showDialog() {
				var x = document.getElementById("myDialog");
				x.show();
			}

			function closeDialog() {
				var x = document.getElementById("myDialog");
				x.close();
			}

			function sortingArray() {
				$scope.users.sort(function(a, b) { // 오름차순
					return a["id"] - b["id"];
				});
			}
		});
