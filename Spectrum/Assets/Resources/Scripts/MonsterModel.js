#pragma strict
public var monster : Monster;
function Start () {

}

function Update () {

}
function OnTriggerEnter(col:Collider){
		//print (col.gameObject.name);
		if(col.gameObject.name.Contains("WeaponObject") && col.gameObject.GetComponent(WeaponModel).weapon.swinging && !monster.hurting && monster.health > 0){
			monster.hurt();
			col.gameObject.GetComponent(WeaponModel).weapon.hasHit = true;
		}
		if (col.gameObject.name.Contains("Mine")){ // If it runs into a mine, damage it
		//var mine:SpellMine = col.gameObject.GetComponent(SpellMine).monster;
		monster.hurt();
		//destroyMe();
		// Hurt doesn't curently work because it ALSO has a knockback, need to override that
	}
		if(col.gameObject.name.Contains("HeroAttack") && !monster.hurting && monster.health > 0){
			monster.hurt();
		}
		if (monster instanceof Minion){
			var minion = monster as Minion;
			minion.passCollision(col);
			//print("Passing collision to minion");
		}
		//print(col.gameObject.name);
}

function OnDrawGizmos() {
		
}