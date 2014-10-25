#pragma strict
public var monster : Monster;
function Start () {

}

function Update () {

}
function OnTriggerEnter(col:Collider){
		//Hurts monster if it hits the weapon while swinging
		if(col.gameObject.name == "WeaponObject" && col.gameObject.GetComponent(WeaponModel).weapon.swinging && !monster.hurting && monster.health > 0){
			monster.hurt();
			col.gameObject.GetComponent(WeaponModel).weapon.hasHit = true;
		}
		//print(col.gameObject.name);
}