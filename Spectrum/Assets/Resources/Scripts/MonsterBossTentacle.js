#pragma strict
public class MonsterBossTentacle extends Monster{
	var weakspot : Minion;
	var showingSpot : boolean;
	var shielding : boolean;
	var metalSound : AudioSource;
	var chargeSound : AudioSource;
	var squirtSound : AudioSource;
	var lunging : boolean;
	var tentacles:Array;
	var rooted:Vector3; //consitent position
	var isStraight:boolean;
	var tentacleFolder:GameObject;
	
	var phaseTime:float;
	var isActive:boolean;

	function init(c: Character, p:Vector3){
		super.init(c);
		phaseTime = 0;
		isStraight = false;
		rooted = p;
		health = 6;
		super.manager = c.manager;
		model.renderer.material.mainTexture = Resources.Load("Textures/bossTentacle", Texture2D);	// Set the texture.  Must be in Resources folder.
		setSize(2, 2.5);
		activateDistance = 0;
		//Add sound
//		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
//		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
		weakspot = createMinion("weakspot");
		weakspot.setTexture("yellowBlob");
		showingSpot = false;
		shielding = false;
		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
		chargeSound = gameObject.AddComponent("AudioSource") as AudioSource;
		chargeSound.clip = Resources.Load("Sounds/bigHiss") as AudioClip;
		squirtSound = gameObject.AddComponent("AudioSource") as AudioSource;
		squirtSound.clip = Resources.Load("Sounds/squirt") as AudioClip;
		invincible = true;
		
		tentacleFolder = new GameObject();
		tentacleFolder.transform.parent = transform;
		tentacles = new Array();
		var numTentacles:int = 6;
		var tentacleLength:int = 9;
		for (var i=0; i<numTentacles; i++){
		
			tentacles.Add(addTentacleArm(Vector3(0,0,i*(360/numTentacles)), tentacleLength));

		
		}
		isActive = false;
	}
	
	function addTentacleArm(rotation, length){
		var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the tentacle texture.
		var tentacleScript:MonsterBossTentacleArm = modelObject2.AddComponent("MonsterBossTentacleArm");		// Add the tentacle.js script to the object.
																// We can now refer to the object via this script.
		tentacleScript.transform.eulerAngles = rotation;
		tentacleScript.init(this.transform.position.x, this.transform.position.y, length, modelObject2, rotation, Random.Range(.3, .75), Random.Range(.2, .6), super.manager);	
		//tentacleScript.transform.parent
		tentacleScript.transform.parent = tentacleFolder.transform;	// Set the tentacle's parent object to be the tentacle folder.	
		tentacleScript.transform.position += tentacleScript.transform.up;						
		return tentacleScript;	
	
	}
	
	//Swings around until player gets close
	function act(){
		if (!isActive){
			if (super.distanceToHero() > 5) return;
			isActive = true;
		}
		if (phaseTime > 8) switchPhase();
		phaseTime += Time.deltaTime;
		super.model.transform.position = rooted; // root in place
		if(angleToHero() > 2 && angleToHero() < 358) turnToHero(2);
		if (!isStraight){
			if(Random.value > 0.983){
				turretAttack();
				}
		}
	}
	
	function turretAttack(){
		for (var i=0; i<5;i++){
			super.attackSlow(13, 10, .5, .3, .3, Color.cyan,true, false, "bullet", "spike");
			yield WaitForSeconds(Random.Range(0.05, 0.15));
		
		}
	
	}
	
	function explodeArea() : IEnumerator{
		super.hero.model.shakeCamera(.1*10);
		for (var i=1; i<10; i++){
			makeExplosion(super.model.transform.position+super.model.transform.up*i);
			yield WaitForSeconds(.1);
		
		}
		if (isStraight) {
				yield WaitForSeconds(.5);
				explodeArea();
		
		}
	
	
	}
	function makeExplosion(pos:Vector3){ // function that uses the mine spell to create an explosion
		var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the mine texture.
		var mineScript:SpellMine = modelObject2.AddComponent("SpellMine");		// Add the mine.js script to the object.
																																								// We can now refer to the object via this script.
		mineScript.transform.parent = super.model.transform.parent;	// Set the mine's parent object to be the mine folder.							
		mineScript.init(pos, modelObject2, 0, super.manager.character.model);	

	
	}
	
	
	
	public function hurt(){
		if(!invincible){
			//if (Random.Range(1,2) > 1.5)
			if (phaseTime > 0) switchPhase();
			playSound(hurtSound);

			health--;
			hurting = true;
			model.renderer.material.color = Color(.5,.5,.5);

			var t : float = hurtRecovery;
			while (t > 0 && health > 0){
				t -= Time.deltaTime;
				yield;
			}
			hurting = false;
			model.renderer.material.color = Color(1,1,1);
		}
			
	}
	
	function minionCollision(minion : Minion, col : Collider){
		if(col.gameObject.name.Contains("WeaponObject") && col.gameObject.transform.parent.gameObject.GetComponent(WeaponModel).weapon.swinging && !hurting && health > 0 && !shielding){
			invincible = false;
			hurt();
			invincible = true;
		}
	}
	
	function switchPhase(){
		phaseTime = 0;
		if (!isStraight){
			isStraight = true;
			for (var i=0; i < tentacles.length; i++){
				var temp:MonsterBossTentacleArm = tentacles[i];
				temp.straighten();
				temp.transform.localEulerAngles = temp.rotation;
				explodeArea();
			}
		}
		else {
			isStraight = false;
			for (i=0; i < tentacles.length; i++){
				temp = tentacles[i];
				
				temp.unstraighten();
			}
			
			}	
	
	}
	
	function die(deathTime : float){
		hero.killedMonsters++;
		var t : float = 0;
		for (var i=0; i < tentacles.length; i++){
					var temp:MonsterBossTentacleArm = tentacles[i];
					temp.destroyMe(deathTime, true);
		}
		playSound(splatSound);
		dropColor();
		while (t < 3){
			t += Time.deltaTime;
			model.renderer.material.color.a = 1-(t/deathTime);
			yield;
		}
		
		Destroy(this.gameObject);
		Application.LoadLevel("LevelComplete");
	}
}