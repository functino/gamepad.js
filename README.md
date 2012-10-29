# Getting Started
The newest Webkit and Firefox browsers have a gamepad API. You can simply plug in any gamepad and use it your browser.
This library tries to simplify that.

It's in early development so the API may change and the library is missing a lot of stuff...

# Usage

## Initialize gamepad
Just call `gamepad.init()` to start the search for plugged in gamepads. You can then press any button on your gamepad and gamepad.js will detect it.

You can listen to the "ready" event:
```
gamepad.on("ready", function(){
  alert("Yay, we have a gamepad!");
});
gamepad.init()
```


or use a callback that gets executed when a gamepad was detected:
```
gamepad.init(function(){
  alert("Yay, we have a gamepad!");
})
```

## Listening for button presses
Everytime a button is pressed or released/changed an event get's fired. Use it like so:
```
gamepad.on("change:face1", function(data) {
  if (data.value == 1) {
    console.log("You pressed button 1. That's A on a XBOX controller");
  } else {
    console.log("You released button 1. That's A on a XBOX controller");
  }
});

gamepad.on("change:leftShoulderBottom", function(data) {
  console.log("You used the trigger. It's currently at: " + data.value);
});  

// if you're only interested in the actions of the first connected controller
gamepad.on("0:change:leftShoulderBottom", function(data) {
  console.log("You used the trigger with the first controller. It's currently at: " + data.value);
}); 

// alternatively you can use this synthax to only set a listener for a specific controller
gamepad[2].on("change:leftShoulderBottom", function(data) {
  console.log("You used the trigger with the first controller. It's currently at: " + data.value);
}); 

// you're only interested in "keyDown/keyUp" like events
// and don't want to do the normalization of "analogue" to digital yourself, use press/release
gamepad.on("press:leftShoulderBottom", function(data) {
  console.log("You pressed the trigger all the way down");
}); 

gamepad.on("release:leftShoulderBottom", function(data) {
  console.log("You released the trigger");
}); 

gamepad.on("change:leftStickX", function(data) {
  console.log("You used your left stick horizontally. It's currently at: " + data.value);
});   
```
The following buttons/sticks are valid:
```
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
```

##TODO
- include requestAnimationFrame polyfill
- normalize values
- add something like gamepad.on("LEFTSTICK", function(data) { console.log(data.x, data.y)});
- add something like gamepad.digital("LEFT_SHOULDER_BOTTOM", function(data) { console.log(data.value); /*returns only 1 or 0*/});
- make it usable with more then 1 gamepad
- add keyUp/keyDown-like events