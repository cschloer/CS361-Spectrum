#pragma strict
public class MonsterBossSmash extends Monster{
	var weakspot : Minion;
	var showingSpot : boolean;
	var shielding : boolean;
	var metalSound : AudioSource;
	var chargeSound : AudioSource;
	var squirtSound : AudioSource;
	var breathingFire : boolean;
	var tentacles:Array;
	var tentacleFolder:GameObject;
	var numTentacles:int;
	var phaseTime:float;
	var isActive:boolean;
	var lunging:boolean;
	var curPhase:int; // 0 for fire, 1 for charge
	
	var anim : Animator;
	var sprend : SpriteRenderer;
	
	var explosions:Array;
	var curExplode:int;

	function init(c: Character, p:Vector3){
		super.init(c);
		breathingFire = false;
		isBoss = true;
		color = "random";
		charging = false;
		fleeing = false;
		hooking = false;
		freeze=1;
		hero = c;
		hurting = false;
		hurtRecovery = 1;
		//modelObject = GameObject();
		//model = modelObject.AddComponent("MonsterModel") as MonsterModel;						// Add a monsterModel script to control visuals of the monster.
		model.monster = this;
		moveSpeed = 1;
		turnSpeed = 90;
		model.renderer.material.mainTexture = Resources.Load("Textures/bossProto", Texture2D);	// Set the texture.  Must be in Resources folder.
		model.transform.parent = transform;									// Set the model's parent to the gem (this object).
		model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		model.name = "Monster Model";										// Name the object.
		/*anim = modelObject.AddComponent("Animator");						// Add the animator component
		sprend = modelObject.AddComponent("SpriteRenderer") as SpriteRenderer;				// Add the renderer for the animations
		nim.runtimeAnimatorController = Resources.Load("Animations/Eye");	// Add BossTentacle's animation controller.
	
		
			
 		modelObject.AddComponent(BoxCollider);
		modelObject.GetComponent(BoxCollider).isTrigger = false;
 		modelObject.GetComponent(BoxCollider).size = Vector3(.75,.75,5);
 		modelObject.AddComponent(Rigidbody);
		modelObject.GetComponent(Rigidbody).isKinematic = false;
 		modelObject.GetComponent(Rigidbody).useGravity = false;
 		modelObject.GetComponent(Rigidbody).inertiaTensor = Vector3(.1, .1, .1);
 		modelObject.GetComponent(Rigidbody).freezeRotation = true;
 		*/
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
	
		
		
		phaseTime = 0;
		curPhase = 0;
		health = 10;
		super.manager = c.manager;
		setSize(2, 2.5);
		activateDistance = 0;
		addHearts();
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
		lunging = false;
		addExplosions(80);
		isActive = false;
		//switchPhase();
	}
	
	function Update(){
		if(activateDistance == 0){
//			anim.SetBool("Blinking", false);
//			anim.SetInteger("Look", 0);
			if(health > 0){
				var r : float = Random.value;
				act();
				model.transform.localPosition.z = 0;
			}else if (health > -100){
				super.die(1);
				health -= 101;
			}	
		}	
		
		
	}
	
	
	
	//Swings around until player gets close
	function act(){
		if (!isActive){
			if (super.distanceToHero() > 10) return;
			//explodeArea();
			//switchPhase();
			isActive = true;
		}
		if (phaseTime > 5) switchPhase();
		phaseTime += Time.deltaTime;
		if (curPhase == 0) {
			if(!breathingFire){
				turnToHero(2);
				if(distanceToHero() < 6){
					//moveFromHero(1.5);
					if(angleToHero() < 4 || angleToHero() > 356) breatheFire(1); //lunge(.5, .3, .8, 6, .5, .3);
				}else{
					move(6);
				}
			}
		}
		else { 
		
			if (Random.value > .95) super.manager.addMonster(super.model.transform.position.x, super.model.transform.position.y, super.hero, 12);
		// spawn minions
			/*if (distanceToHero() > 5 && !lunging) {
				if(angleToHero() > 8 && angleToHero() < 352) 	turnToHero(4);
				else if (angleToHero() > 2 && angleToHero() < 358) turnToHero(1);
				move(8);
			}
			else {
				if (!lunging){
					lunge(.2, .5, .4, 10, .5, 5);
				
				}
			}
			*/
		}
	}
	
	function breatheFire(duration:float){
			breathingFire = true;
			var tempClock:float = 0;
			var chargeTime:float = 0.4;
			while (tempClock < chargeTime){
				super.model.renderer.material.color.b -= Time.deltaTime*(1/chargeTime);
				super.model.renderer.material.color.g -= Time.deltaTime*(1/chargeTime);
				tempClock+=Time.deltaTime;
				yield;
			}
			super.model.renderer.material.color.b = 0;
			super.model.renderer.material.color.g = 0;
			
			explodeArea(duration);
			yield WaitForSeconds(duration);
			
			tempClock = 0;
			while (tempClock < chargeTime){
				super.model.renderer.material.color.b += Time.deltaTime*(1/chargeTime);
				super.model.renderer.material.color.g += Time.deltaTime*(1/chargeTime);
				tempClock+=Time.deltaTime;
				yield;
			}
			super.model.renderer.material.color.b = 1;
			super.model.renderer.material.color.g = 1;
			breathingFire = false;
	
	}
	
	
	function lunge(chargeTime : float, chargeSpeed : float, lungeTime : float, lungeSpeed : float, retreatTime : float, retreatSpeed : float){
		lunging = true;
		/*while(chargeTime > 0){
			chargeTime -= Time.deltaTime;
			moveFromHero(chargeSpeed);
			yield;
		}*/
		
		while(lungeTime > 0){
			lungeTime -= Time.deltaTime;
			move(lungeSpeed);
			yield;
		}
		chargeStrike();
		playSound(chargeSound);
		while(retreatTime > 0){
			retreatTime -= Time.deltaTime;
			moveFromHero(retreatSpeed);
			if(angleToHero() > 8 && angleToHero() < 352) 	turnToHero(4);
			else if (angleToHero() > 2 && angleToHero() < 358) turnToHero(1);
				
			yield;
		}
			//attack(3, -4, 0, 1.8, 2, Color.green, false, true, "");
		
		lunging = false;

		
	}
	
	
	
	
	function bossAttack(range : float, speed : float, home : float, width :float, depth : float, headingOffset : float, color : Color, destructible : boolean, fade : boolean, keyword : String, texture : String){
		var attackObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	
		var attack : MonsterAttack = attackObject.AddComponent("MonsterAttack") as MonsterAttack;						
		attack.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		attack.transform.position = super.model.transform.position + headingOffset*super.transform.forward;
		attack.transform.rotation = super.model.transform.rotation;
		attack.name = "Monster Attack";											// Name the object.
		attack.renderer.material.mainTexture = Resources.Load("Textures/" + texture, Texture2D);	// Set the texture.  Must be in Resources folder.
		attack.renderer.material.color = color;												// Set the color (easy way to tint things).
		attack.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
		attack.transform.localScale = Vector3(width,depth,1); 
		attack.init(range, speed, fade, 0, true);
		attack.hero = super.hero;
		//attack.transform.parent = bulletFolder.transform;
		attackObject.collider.enabled = false;
		attackObject.AddComponent(BoxCollider);
		attackObject.GetComponent(BoxCollider).name = "attack d:" + destructible + " " + keyword;
		attackObject.GetComponent(BoxCollider).isTrigger = true;
		attackObject.GetComponent(BoxCollider).size = Vector3(.5,.5,10);
		attackObject.AddComponent(Rigidbody);
		attackObject.GetComponent(Rigidbody).isKinematic = true;
		attackObject.GetComponent(Rigidbody).useGravity = false;
		attackObject.GetComponent(Rigidbody).inertiaTensor = Vector3(.1, .1, .1);
		attackObject.GetComponent(Rigidbody).freezeRotation = true;

	}
	
	function bossAttack(range:float, speed:float, width : float, depth : float, color:Color){
		bossAttack(range, speed, 0, width, depth, 0, color, false, false, "", "ball");
	}
	function bossAttack(range:float, speed:float, width:float, depth : float){
		bossAttack(range, speed, 0, width, depth, 0, Color.white, false, false, "", "ball");
	}
	function chargeStrike(){
		bossAttack(.2, 1, 0, 2, 2.5, 5, Color.red, false, true, "bullet", "ball");
	}
	
	
	
	
	function explodeArea(duration:float) : IEnumerator{
		var numExplodes:int = 10;
		var deltaExplode:float = .04;  // time between each explosion
		var timer:float =0;
		var pos:Vector3 = super.model.transform.position;
		var up:Vector3 = super.model.transform.up;
		var right:Vector3 = super.model.transform.right;
		//super.hero.model.shakeCamera(numExplodes*deltaExplode);
		//while(timer < duration-.2){
			for (var i:float=1; i<numExplodes; i++){
				for (var j:float=0; j<i; j++){
					makeExplosion(pos+up*(i)+right*(i/2-j-.5));
				}
				//timer += Time.deltaTime;
				//if (timer > duration || curPhase != 0) return;
				yield WaitForSeconds(deltaExplode);
				//timer += deltaExplode;	
				//if (timer > duration || curPhase != 0) return;
			
			}
			//return;
			//yield WaitForSeconds(.3);
			//timer+=.3;
		//}
		
	
	
	}
	
	
	
	
	function makeExplosion(pos:Vector3){ // function that uses the mine spell to create an explosion
		var script:Explosion = explosions[curExplode];
		script.active = true;
		script.transform.position = pos;
		script.destroyMe();
		curExplode = (curExplode+1)%explosions.length;
	}
	function addExplosions(num : int){
		explosions = new Array();
		for (var i=0; i<num; i++){
			var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the mine texture.
			var mineScript:Explosion = modelObject2.AddComponent("Explosion");		// Add the mine.js script to the object.																																					// We can now refer to the object via this script.
			mineScript.transform.parent = super.model.transform.parent;	// Set the mine's parent object to be the mine folder.							
			mineScript.init(Vector3.zero, modelObject2, super.manager.character.model);	
			mineScript.ice = false;
			mineScript.isBig = true;
			explosions.Add(mineScript);
		}
		curExplode = 0;
	
	}
	
	
	
	public function hurt(){
		if(!invincible){
			//if (Random.Range(1,2) > 1.5)
			//if (phaseTime > 0) switchPhase();
			playSound(hurtSound);
			removeHeart();
			health--;
			hurting = true;
			model.renderer.material.color = model.renderer.material.color+ Color(-.5,-.5,-.5);
//			anim.SetBool("Blinking", true);

			var t : float = hurtRecovery;
			while (t > 0 && health > 0){
				t -= Time.deltaTime;
				yield;
			}
			hurting = false;
//			anim.SetBool("Blinking", false);
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
		if (curPhase == 0){ // in fire phase, switch to charging phase
			modelObject.GetComponent(Rigidbody).isKinematic = true;
			/*var tempClock:float = 0;
			while (tempClock < 2){
				super.model.renderer.material.color.r -= Time.deltaTime;
				super.model.renderer.material.color.g -= Time.deltaTime;
				tempClock+=Time.deltaTime;
				yield;
			}
			super.model.renderer.material.color.r = 0;
			super.model.renderer.material.color.g = 0;
			*/
			curPhase = 1;
		}
		else { // in charging phase, switch to fire
			curPhase = 0;
			modelObject.GetComponent(Rigidbody).isKinematic = false;
			
		}	
	
	}
	
	function die(deathTime : float){
		hero.killedMonsters++;
		var t : float = 0;
		
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
