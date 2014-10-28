#pragma strict
public var weapon : Weapon;
function Start () {

}

function Update () {

}

function OnTriggerEnter(col:Collider){
		//print(col.gameObject.name);
		if(col.gameObject.name.Contains("d:True") && weapon.swinging) Destroy(col.gameObject);
		if(col.gameObject.name.Contains("Spawn") && weapon.swinging) col.gameObject.GetComponent(DeviceSpawnModel).breakage();
		if(col.gameObject.name.Contains("Mine") && !weapon.owner.model.yellow && weapon.swinging) {
			if (col.gameObject.GetComponent(SpellMine).destroying) return;
			col.gameObject.GetComponent(SpellMine).destroyMe();
			if (weapon.tossSpeed < 40) weapon.tossSpeed *= 2; // doubles the speed of the throw, but not too much
		 
		  } 
	}