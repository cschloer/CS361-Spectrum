﻿#pragma strict
public var weapon : Weapon;
function Start () {

}

function Update () {

}

function OnTriggerEnter(col:Collider){
		//print(col.gameObject.name);
		if(col.gameObject.name.Contains("d:True") && weapon.swinging) Destroy(col.gameObject);
		if(col.gameObject.name.Contains("Mine") && !weapon.owner.model.yellow && weapon.swinging) {
			col.gameObject.GetComponent(SpellMine).destroyMe();
			weapon.tossSpeed *= 2; // doubles the speed of the throw
		 
		  } 
	}