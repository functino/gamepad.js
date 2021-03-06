listeners = {}

vendors = ['ms', 'moz', 'webkit', 'o'];

# make requestAnimationFrame and getGamepads available without vendor prefix
requestAnimationFrame = window.requestAnimationFrame
for vendor in vendors
  unless requestAnimationFrame?
    requestAnimationFrame = window["#{vendor}RequestAnimationFrame"]
  unless navigator.getGamepads?
    navigator.getGamepads = navigator["#{vendor}GetGamepads"]  

# polyfill for requestAnimationFrame
if !requestAnimationFrame
  lastTime = 0;
  requestAnimationFrame = (callback, element) ->
    currTime = new Date().getTime();
    timeToCall = Math.max(0, 16 - (currTime - lastTime));
    id = window.setTimeout( ( -> callback(currTime + timeToCall) ), timeToCall)
    lastTime = currTime + timeToCall

# exported gamepad object
window.gamepad = 
  isSupported: ->
    navigator.getGamepads?
  get: (index) ->
    return gamepad.getAll()[index] if index?
    gamepad.getAll()
  getAll: ->
    navigator.getGamepads()
  BUTTONS: 
    face1: 0, # Face (main) buttons
    face2: 1,
    face3: 2,
    face4: 3,
    leftShoulder: 4, # Top shoulder buttons
    rightShoulder: 5,
    leftShoulderBottom: 6, # Bottom shoulder buttons
    rightShoulderBottom: 7,
    select: 8,
    start: 9,
    leftStick: 10, # Analogue sticks (if depressible)
    rightStick: 11,
    up: 12, # Directional (discrete) pad
    down: 13,
    left: 14,
    right: 15
  AXES:
    leftStickX: 0,
    leftStickY: 1,
    rightStickX: 2,
    rightStickY: 3  
  on: (event, callback) ->
    listeners[event] ?= [] 
    listeners[event].push(callback)
  fire: (event, data) ->
    data ?= {}
    list = event.split(":")
    events = [
      event   # "1:change:LEFT"
      list[1] # "change"
      list[1] + ":" + list[2] # "change:LEFT"
      list[0] + list[1] # "1:change"
    ]

    for event in events
      if listeners[event]?
        for callback in listeners[event]
          data.event = event
          data.button = list[2]
          data.state = 
            pad: padStatus
            axes: axesStatus
          callback(data)

for pad in [0..3]
  gamepad[pad] = 
    on: (event, callback) ->
      gamepad.on "#{pad}:#{event}", callback

checkForGamePad = null
padStatus = [
  [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]]
  [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]]
  [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]]
  [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]]
]
axesStatus = [
  [0, 0, 0, 0]
  [0, 0, 0, 0]
  [0, 0, 0, 0]
  [0, 0, 0, 0]
]  
  
deadZone = 0.07
checkButtons = ->
  for padNumber in [0..3]
    pad = gamepad.get(padNumber)
    if pad != undefined
      for name, index of gamepad.BUTTONS
        if padStatus[padNumber][index][0] != pad.buttons[index]
          padStatus[padNumber][index][0] = pad.buttons[index]
          normalized = if pad.buttons[index] > 1 - deadZone then 1 else 0
          data = value: pad.buttons[index], normalizedValue: normalized, pad: padNumber          
          if normalized != padStatus[padNumber][index][1]
            padStatus[padNumber][index][1] = normalized
            event = if normalized == 1 then "press" else "release"
            gamepad.fire("#{padNumber}:#{event}:#{name}", data)
          gamepad.fire("#{padNumber}:change:#{name}", data)
      for name, index of gamepad.AXES
        if deadZone < Math.abs(axesStatus[padNumber][index] - pad.axes[index])
          axesStatus[padNumber][index] = pad.axes[index]
          data = value: pad.axes[index], pad: padNumber
          gamepad.fire("#{padNumber}:change:#{name}", data)
  requestAnimationFrame(checkButtons)          

checkForGamePad = ->
  pad = gamepad.get(0)
  if pad?
    console.log("setting up gamepad")
    requestAnimationFrame(checkButtons)
    gamepad.fire("ready", {})
  else
    console.log("next")
    setTimeout(checkForGamePad, 1000)

gamepad.init = (callback) -> 
  gamepad.on "ready", callback if callback?
  checkForGamePad()