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
	var numTentacles:int;
	var phaseTime:float;
	var isActive:boolean;
	
	var anim : Animator;
	var sprend : SpriteRenderer;

	function init(c: Character, p:Vector3){
		isBoss = true;
		color = "random";
		charging = false;
		fleeing = false;
		hooking = false;
		freeze=1;
		hero = c;
		hurting = false;
		hurtRecovery = 1;
		modelObject = GameObject();
		model = modelObject.AddComponent("MonsterModel") as MonsterModel;						// Add a monsterModel script to control visuals of the monster.
		model.monster = this;
		moveSpeed = 1;
		turnSpeed = 90;
		
		model.transform.parent = transform;									// Set the model's parent to the gem (this object).
		model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		model.name = "Monster Model";										// Name the object.
		anim = modelObject.AddComponent("Animator");						// Add the animator component
		sprend = modelObject.AddComponent("SpriteRenderer") as SpriteRenderer;				// Add the renderer for the animations
		anim.runtimeAnimatorController = Resources.Load("Animations/Eye");	// Add BossTentacle's animation controller.
		
 		modelObject.AddComponent(BoxCollider);
		modelObject.GetComponent(BoxCollider).isTrigger = false;
 		modelObject.GetComponent(BoxCollider).size = Vector3(.75,.75,5);
 		modelObject.AddComponent(Rigidbody);
		modelObject.GetComponent(Rigidbody).isKinematic = false;
 		modelObject.GetComponent(Rigidbody).useGravity = false;
 		modelObject.GetComponent(Rigidbody).inertiaTensor = Vector3(.1, .1, .1);
 		modelObject.GetComponent(Rigidbody).freezeRotation = true;
 		
 		hurtSound = gameObject.AddComponent("AudioSource") as AudioSource;
		hurtSound.clip = Resources.Load("Sounds/hit") as AudioClip;
		splatSound = gameObject.AddComponent("AudioSource") as AudioSource;
		splatSound.clip = Resources.Load("Sounds/splat") as AudioClip;
		hissSound = gameObject.AddComponent("AudioSource") as AudioSource;
		hissSound.clip = Resources.Load("Sounds/hiss") as AudioClip;
		puffSound = gameObject.AddComponent("AudioSource") as AudioSource;
		puffSound.clip = Resources.Load("Sounds/puff") as AudioClip;
		vip1Sound = gameObject.AddComponent("AudioSource") as AudioSource;
		vip1Sound.clip = Resources.Load("Sounds/vip1") as AudioClip;
		vip2Sound = gameObject.AddComponent("AudioSource") as AudioSource;
		vip2Sound.clip = Resources.Load("Sounds/vip2") as AudioClip;
		
		bulletFolder = new GameObject();
		bulletFolder.name = "Bullets";
		bulletFolder.transform.parent = transform;
		
		/*minionFolder = new GameObject();
		minionFolder.name = "Minions";
		minionFolder.transform.parent = transform;*/
		
		waitToActivate();
		addHearts();
		
		
		phaseTime = 0;
		isStraight = true;
		rooted = p;
		health = 10;
		super.manager = c.manager;
		model.renderer.material.mainTexture = Resources.Load("Textures/bossTentacle", Texture2D);	// Set the texture.  Must be in Resources folder.
		setSize(2, 2.5);
		activateDistance = 0;
		//Add sound
//		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
//		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
		//weakspot = createMinion("weakspot");
		//weakspot.setTexture("yellowBlob");
		showingSpot = false;
		shielding = false;
		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
		chargeSound = gameObject.AddComponent("AudioSource") as AudioSource;
		chargeSound.clip = Resources.Load("Sounds/bigHiss") as AudioClip;
		squirtSound = gameObject.AddComponent("AudioSource") as AudioSource;
		squirtSound.clip = Resources.Load("Sounds/squirt") as AudioClip;
		//invincible = true;
		
		tentacleFolder = new GameObject();
		tentacleFolder.transform.parent = transform;
		tentacles = new Array();
		numTentacles = 5;
		var tentacleLength:int = 9;
		for (var i=0; i<numTentacles; i++){
		
			tentacles.Add(addTentacleArm(Vector3(0,0,i*(360/numTentacles)), tentacleLength));

		
		}
		for (var l=0; l <numTentacles; l++){
			var curTent:MonsterBossTentacleArm = tentacles[l];
			var nextTent:MonsterBossTentacleArm = tentacles[(l+1)%numTentacles];
			for (var j=0; j<tentacleLength; j++){
				curTent = curTent.next;
			}
			for (var h=0; h<tentacleLength; h++){
				nextTent = nextTent.next;
			}
			curTent.buddy = nextTent;
			curTent.straighten();
		}
		isActive = false;
		//switchPhase();
	}
	
	function Update(){
		if(activateDistance == 0){
			anim.SetBool("Blinking", false);
			anim.SetInteger("Look", 0);
			if(health > 0){
				var r : float = Random.value;
				if(r > .94){
					if( r > .98 ) anim.SetBool("Blinking", true);
					else if (r > .96) anim.SetInteger("Look", 1);
					else anim.SetInteger("Look",-1);
				}
				act();
				model.transform.localPosition.z = 0;
			}else if (health > -100){
				super.die(1);
				health -= 101;
			}	
		}	
		
		
	}
	
	
	function addTentacleArm(rotation, length){
		var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the tentacle texture.
		var tentacleScript:MonsterBossTentacleArm = modelObject2.AddComponent("MonsterBossTentacleArm");		// Add the tentacle.js script to the object.
																// We can now refer to the object via this script.
		tentacleScript.transform.eulerAngles = rotation;
		tentacleScript.init(this.transform.position.x, this.transform.position.y, length, modelObject2, rotation, Random.Range(.6, 1), Random.Range(1.2, 1.6), super.manager, this);	
		//tentacleScript.transform.parent
		tentacleScript.transform.parent = tentacleFolder.transform;	// Set the tentacle's parent object to be the tentacle folder.	
		tentacleScript.transform.position += tentacleScript.transform.up;						
		return tentacleScript;	
	
	}
	
	//Swings around until player gets close
	function act(){
		if (!isActive){
			if (super.distanceToHero() > 10) return;
			//explodeArea();
			//switchPhase();
			super.model.renderer.material.color.r = 0;
			super.model.renderer.material.color.g = 0;
			isActive = true;
		}
		if (phaseTime > 10) switchPhase();
		phaseTime += Time.deltaTime;
		super.model.transform.position = rooted; // root in place
		if(angleToHero() > 2 && angleToHero() < 358) turnToHero(2);
		if (isStraight){
			if(Random.value > 0.975){
				turretAttack();
				}
		}
	}
	
	function turretAttack(){
		for (var i=0; i<3;i++){
			super.attackSlow(13, 10, 0, .3, .3, Color.cyan,true, false, "bullet", "spike");
			yield WaitForSeconds(Random.Range(0.05, 0.15));
		
		}
	
	}
	
	function explodeArea() : IEnumerator{
		var numExplodes:int = 10;
		var deltaExplode:float = .2;  // time between each explosion
		super.hero.model.shakeCamera(numExplodes*deltaExplode);
		for (var i=1; i<numExplodes; i++){
			makeExplosion(super.model.transform.position+super.model.transform.up*i);
			yield WaitForSeconds(deltaExplode);
		
		}
		if (!isStraight) {
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
			//if (phaseTime > 0) switchPhase();
			playSound(hurtSound);

			health--;
			hurting = true;
			model.renderer.material.color = model.renderer.material.color+ Color(-.5,-.5,-.5);
			anim.SetBool("Blinking", true);

			var t : float = hurtRecovery;
			while (t > 0 && health > 0){
				t -= Time.deltaTime;
				yield;
			}
			hurting = false;
			anim.SetBool("Blinking", false);
			model.renderer.material.color = model.renderer.material.color+ Color(.5,.5,.5);
		}
			
	}
	
	/*function minionCollision(minion : Minion, col : Collider){
		if(col.gameObject.name.Contains("WeaponObject") && col.gameObject.transform.parent.gameObject.GetComponent(WeaponModel).weapon.swinging && !hurting && health > 0 && !shielding){
			invincible = false;
			hurt();
			invincible = true;
		}
	}*/
	
	function switchPhase(){
		phaseTime = 0;
		if (!isStraight){
			isStraight = true;
			for (var i=0; i < tentacles.length; i++){
				var temp:MonsterBossTentacleArm = tentacles[i];
				temp.straighten();
				temp.transform.localEulerAngles = temp.rotation;
				
			}
			var tempClock:float = 0;
			while (tempClock < 2){
				super.model.renderer.material.color.r -= Time.deltaTime;
				super.model.renderer.material.color.g -= Time.deltaTime;
				tempClock+=Time.deltaTime;
				yield;
			}
			super.model.renderer.material.color.r = 0;
			super.model.renderer.material.color.g = 0;
			
		}
		else {
			isStraight = false;
			for (i=0; i < tentacles.length; i++){
				temp = tentacles[i];
				
				temp.unstraighten();
			}
			var tempClock2:float = 0;
			while (tempClock2 < 2){
				super.model.renderer.material.color.r += Time.deltaTime/2;
				super.model.renderer.material.color.g += Time.deltaTime/2;
				tempClock2+=Time.deltaTime;
				yield;
			}
			super.model.renderer.material.color.r = 1;
			super.model.renderer.material.color.g = 1;
			explodeArea();
			
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