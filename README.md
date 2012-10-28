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
  gamepad.on("FACE_1", function(data) {
    if (data.value == 1) {
      console.log("You pressed button 1. That's A on a XBOX controller");
    } else {
      console.log("You released button 1. That's A on a XBOX controller");
    }
  });

  gamepad.on("LEFT_SHOULDER_BOTTOM", function(data) {
    console.log("You used the trigger. It's currently at: " + data.value);
  });  

  gamepad.on("LEFT_STICK_HOR", function(data) {
    console.log("You used your left stick horizontally. It's currently at: " + data.value);
  });   
```
The following buttons/sticks are valid:
```
	 BUTTONS: 
	    FACE_1: 0, # Face (main) buttons
	    FACE_2: 1,
	    FACE_3: 2,
	    FACE_4: 3,
	    LEFT_SHOULDER: 4, # Top shoulder buttons
	    RIGHT_SHOULDER: 5,
	    LEFT_SHOULDER_BOTTOM: 6, # Bottom shoulder buttons
	    RIGHT_SHOULDER_BOTTOM: 7,
	    SELECT: 8,
	    START: 9,
	    LEFT_STICK: 10, # Analogue sticks (if depressible)
	    RIGHT_STICK: 11,
	    PAD_TOP: 12, # Directional (discrete) pad
	    PAD_BOTTOM: 13,
	    PAD_LEFT: 14,
	    PAD_RIGHT: 15
	  AXES:
	    LEFT_STICK_HOR: 0,
	    LEFT_STICK_VERT: 1,
	    RIGHT_STICK_HOR: 2,
	    RIGHT_STICK_VERT: 3  
```

##TODO
- include requestAnimationFrame polyfill
- Use constants instead of strings
- normalize values
- add something like gamepad.on("LEFTSTICK", function(data) { console.log(data.x, data.y)});
- add something like gamepad.digital("LEFT_SHOULDER_BOTTOM", function(data) { console.log(data.value); /*returns only 1 or 0*/});
- make it usable with more then 1 gamepad
- add keyUp/keyDown-like events