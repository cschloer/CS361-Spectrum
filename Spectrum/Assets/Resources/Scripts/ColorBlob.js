﻿#pragma strict
var timeLeft : float;
var blue : float;
var red : float;
var yellow : float;
var eatSound : AudioSource;
function Start () {
	eatSound = gameObject.AddComponent("AudioSource") as AudioSource;
	eatSound.clip = Resources.Load("Sounds/slurp");
}

function Update () {
	
}
function init(r : float, y : float, b : float, duration : float) {
	red = r;
	blue = b;
	yellow = y;
	timeLeft = duration;
	appear(.5);
	renderer.material.color=Color.black;
	if(red == 1) renderer.material.color = Color(1, 0, 0);
	if(red == -1) renderer.material.color = Color(1, .8, .8);
	if(blue == 1) renderer.material.color = Color(0, 0, 1);
	if(blue == -1) renderer.material.color = Color (.8, .8, 1);
	if(yellow == 1) renderer.material.color = Color(1, 1, 0);
	if(yellow == -1) renderer.material.color = Color(1, 1, .6);
}

//Adds the color to the map (be linearly scaling from 0 to 1 over duration seconds).
function appear(time : float){
	var a : float = 0;
	while( a < time){
		transform.localScale = Vector3.one * (a/time);
		a+= Time.deltaTime;
		yield;
	}
	startTimer();
}

//Keeps track of how long this has been on the map. Currently only tracks within a fifth of a second for efficiency.
function startTimer(){
	while(timeLeft > 0){
		timeLeft -= .2;
		yield WaitForSeconds(.2);
	}
	disappear(.5);
}
//Removes the color from the map (be linearly scaling from 1 to 0 over duration seconds).
function disappear(time : float){
	var a : float = time;
	while( a > 0){
		transform.localScale = Vector3.one * (a/time);
		a-= Time.deltaTime;
		yield;
	}
	Destroy(this.gameObject);
}
//Updates hero's color on collision.
function OnTriggerEnter(col:Collider){
		//print(col.gameObject.name);
		if(col.gameObject.name == "Character Model"){
			var character : CharacterModel = col.gameObject.GetComponent(CharacterModel);

			if((character.blue && blue == -1) || (!character.blue && blue == 1)) character.changeBlue();
			if((character.red && red == -1) || (!character.red && red == 1)) character.changeRed();
			if((character.yellow && yellow == -1) || (!character.yellow && yellow == 1)) character.changeYellow();
			timeLeft = 0;
			eatSound.Play();
		}
		
}