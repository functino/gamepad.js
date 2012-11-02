(function() {
  var axesStatus, checkButtons, checkForGamePad, deadZone, lastTime, listeners, pad, padStatus, requestAnimationFrame, vendor, vendors, _i, _len;
  listeners = {};
  vendors = ['ms', 'moz', 'webkit', 'o'];
  requestAnimationFrame = window.requestAnimationFrame;
  for (_i = 0, _len = vendors.length; _i < _len; _i++) {
    vendor = vendors[_i];
    if (requestAnimationFrame == null) {
      requestAnimationFrame = window["" + vendor + "RequestAnimationFrame"];
    }
    if (navigator.getGamepads == null) {
      navigator.getGamepads = navigator["" + vendor + "GetGamepads"];
    }
  }
  if (!requestAnimationFrame) {
    lastTime = 0;
    requestAnimationFrame = function(callback, element) {
      var currTime, id, timeToCall;
      currTime = new Date().getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout((function() {
        return callback(currTime + timeToCall);
      }), timeToCall);
      return lastTime = currTime + timeToCall;
    };
  }
  window.gamepad = {
    isSupported: function() {
      return navigator.getGamepads != null;
    },
    get: function(index) {
      if (index != null) {
        return gamepad.getAll()[index];
      }
      return gamepad.getAll();
    },
    getAll: function() {
      return navigator.getGamepads();
    },
    BUTTONS: {
      face1: 0,
      face2: 1,
      face3: 2,
      face4: 3,
      leftShoulder: 4,
      rightShoulder: 5,
      leftShoulderBottom: 6,
      rightShoulderBottom: 7,
      select: 8,
      start: 9,
      leftStick: 10,
      rightStick: 11,
      up: 12,
      down: 13,
      left: 14,
      right: 15
    },
    AXES: {
      leftStickX: 0,
      leftStickY: 1,
      rightStickX: 2,
      rightStickY: 3
    },
    on: function(event, callback) {
      var _ref;
            if ((_ref = listeners[event]) != null) {
        _ref;
      } else {
        listeners[event] = [];
      };
      return listeners[event].push(callback);
    },
    fire: function(event, data) {
      var callback, events, list, _j, _len2, _results;
            if (data != null) {
        data;
      } else {
        data = {};
      };
      list = event.split(":");
      events = [event, list[1], list[1] + ":" + list[2], list[0] + list[1]];
      _results = [];
      for (_j = 0, _len2 = events.length; _j < _len2; _j++) {
        event = events[_j];
        _results.push((function() {
          var _k, _len3, _ref, _results2;
          if (listeners[event] != null) {
            _ref = listeners[event];
            _results2 = [];
            for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
              callback = _ref[_k];
              data.event = event;
              data.button = list[2];
              data.state = {
                pad: padStatus,
                axes: axesStatus
              };
              _results2.push(callback(data));
            }
            return _results2;
          }
        })());
      }
      return _results;
    }
  };
  for (pad = 0; pad <= 3; pad++) {
    gamepad[pad] = {
      on: function(event, callback) {
        return gamepad.on("" + pad + ":" + event, callback);
      }
    };
  }
  checkForGamePad = null;
  padStatus = [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]];
  axesStatus = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  deadZone = 0.07;
  checkButtons = function() {
    var data, event, index, name, normalized, padNumber, _ref, _ref2;
    for (padNumber = 0; padNumber <= 3; padNumber++) {
      pad = gamepad.get(padNumber);
      if (pad !== void 0) {
        _ref = gamepad.BUTTONS;
        for (name in _ref) {
          index = _ref[name];
          if (padStatus[padNumber][index][0] !== pad.buttons[index]) {
            padStatus[padNumber][index][0] = pad.buttons[index];
            normalized = pad.buttons[index] > 1 - deadZone ? 1 : 0;
            data = {
              value: pad.buttons[index],
              normalizedValue: normalized,
              pad: padNumber
            };
            if (normalized !== padStatus[padNumber][index][1]) {
              padStatus[padNumber][index][1] = normalized;
              event = normalized === 1 ? "press" : "release";
              gamepad.fire("" + padNumber + ":" + event + ":" + name, data);
            }
            gamepad.fire("" + padNumber + ":change:" + name, data);
          }
        }
        _ref2 = gamepad.AXES;
        for (name in _ref2) {
          index = _ref2[name];
          if (deadZone < Math.abs(axesStatus[padNumber][index] - pad.axes[index])) {
            axesStatus[padNumber][index] = pad.axes[index];
            data = {
              value: pad.axes[index],
              pad: padNumber
            };
            gamepad.fire("" + padNumber + ":change:" + name, data);
          }
        }
      }
    }
    return requestAnimationFrame(checkButtons);
  };
  checkForGamePad = function() {
    pad = gamepad.get(0);
    if (pad != null) {
      console.log("setting up gamepad");
      requestAnimationFrame(checkButtons);
      return gamepad.fire("ready", {});
    } else {
      console.log("next");
      return setTimeout(checkForGamePad, 1000);
    }
  };
  gamepad.init = function(callback) {
    if (callback != null) {
      gamepad.on("ready", callback);
    }
    return checkForGamePad();
  };
}).call(this);
