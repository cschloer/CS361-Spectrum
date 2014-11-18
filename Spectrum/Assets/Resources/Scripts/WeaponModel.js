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
			if (weapon.tossSpeed < 25) weapon.tossSpeed *= 2; // doubles the speed of the throw, but not too much
		 	if (weapon.tossTime > 0) weapon.tossTime -= .25;
		 } 
	
		 if(col.gameObject.name.Contains("Monster") && weapon.isBoomerang && weapon.swinging &&  weapon.chargingBoomTimer >= 2){
		  	makeExplosion();
		  
		  
		  }
}
	
	
	function makeExplosion(){ // function that uses the mine spell to create an explosion
		var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the mine texture.
		var mineScript:SpellMine = modelObject2.AddComponent("SpellMine");		// Add the mine.js script to the object.
																																								// We can now refer to the object via this script.
		mineScript.transform.parent = this.transform.parent;	// Set the mine's parent object to be the mine folder.							
		mineScript.init(this.transform.position.x, this.transform.position.y, modelObject2, weapon.character.model, 0);	

	
	}
	
	function hasHit(){
		if(weapon.isBoomerang && weapon.swinging &&  weapon.chargingBoomTimer >= 2){
		  	makeExplosion();
		  
		  
		  }
		 else{
		 	 weapon.hasHit = true;
		  
		 }
	
	}