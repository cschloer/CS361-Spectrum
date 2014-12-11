#pragma strict
public class Monster extends MonoBehaviour 
{
	public var model : MonsterModel; //The model for this monster
	public var hero : Character; //Pointer to the hero
	public var moveSpeed : float;  //Tiles per second
	public var turnSpeed : float;  //Degrees Per second
	public var health : float; //Max/starting health
	public var hurtRecovery : float; //Time spend invincible after hit
	public var hurting : boolean; //Marker boolean for whether it was just hurt
	public var modelObject : GameObject;
	public var bulletFolder : GameObject;
	public var minionFolder : GameObject;
	public var invincible : boolean; //Monster cannot be hurt while invincible.
	public var activateDistance : float; //Monster waits till hero is within this distance to activate.
	public var manager : GameManager;
	
	public var hurtSound : AudioSource;
	public var splatSound : AudioSource;
	public var puffSound : AudioSource;
	public var hissSound : AudioSource;
	public var vip1Sound : AudioSource;
	public var vip2Sound : AudioSource;
	var freeze:int; // 1 for not freezing, 0 for freezing
	var hooking:boolean;
	var fleeing:boolean;
	var charging:boolean;
	var curHeart:int;
	var color : String;
	var hearts:Array;
	var showHealth : boolean = true; //To hide an enemie's health, change this in init. Can be changed anytime.
	var heartSpacing : float = .5; //Change the space between hearts
	var heartOpacity : float = 1.0; //Change heart opacity
	var heartScale : float = .4; //Change size of hearts
	var heartOffset : float; //Change vertical offset of hearts (For large enemies. Defaults to boxCollider size.)
	var isBoss:boolean;
	public function init(c : Character) {
		color = "random";
		isBoss = false;
		activateDistance = 10;
		invincible = false;
		charging = false;
		fleeing = false;
		hooking = false;
		freeze=1;
		hero = c;
		hurting = false;
		health = 3;
		hurtRecovery = 1;
		modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the monster texture.
		model = modelObject.AddComponent("MonsterModel") as MonsterModel;						// Add a monsterModel script to control visuals of the monster.
		model.monster = this;
		//gemType = 1;
		moveSpeed = 1;
		turnSpeed = 90;
		
		model.transform.parent = transform;									// Set the model's parent to the gem (this object).
		model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		model.name = "Monster Model";										// Name the object.
		model.renderer.material.mainTexture = Resources.Load("Textures/gem1", Texture2D);	// Set the texture.  Must be in Resources folder.
		model.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
		model.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
		
		modelObject.collider.enabled = false;
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
		
		minionFolder = new GameObject();
		minionFolder.name = "Minions";
		minionFolder.transform.parent = transform;
		
		waitToActivate();
		heartOffset = model.gameObject.GetComponent(BoxCollider).size.y;
		addHearts();
		updateHearts();
		manager = c.manager;
	}
	
	function waitToActivate(){
		while (activateDistance != 0){
			if(distanceToHero() <= activateDistance) activateDistance = 0;
			yield WaitForSeconds(1);
		}
	}
	function setSize(x : float, y : float){
		model.transform.localScale = Vector3(x, y, y);					
 		modelObject.GetComponent(BoxCollider).size = Vector3(.75, .75, 10);

 	}
 	
	//Move forward at default speed
	public function move(){
		move(1);
	}
	//Move forward at given speed factor
	public function move(multiplier : float){
		if (hooking || freeze == 0) return;
		model.transform.position += model.transform.up * Time.deltaTime*freeze*moveSpeed*multiplier;
		
	}
	
	//Move backward at default speed
	public function moveBack(){
		moveBack(1);
	}
	//Move backward at given speed factor
	public function moveBack(multiplier : float){
		if (hooking || freeze == 0) return;
		model.transform.position += -1*model.transform.up * Time.deltaTime*freeze*moveSpeed*multiplier;
	}
	
	//Strafe left
	public function moveLeft(){
		moveLeft(1);
	}
	//Strafe left at given speed
	public function moveLeft(multiplier : float){
		if (hooking || freeze == 0) return;
		model.transform.position += -1*model.transform.right * Time.deltaTime*freeze*moveSpeed*multiplier;
	}
	//Strafe right
	public function moveRight(){
		moveRight(1);
	}
	//Strafe right at given speed
	public function moveRight(multiplier : float){
		if (hooking || freeze == 0) return;
		model.transform.position += 1*model.transform.right * Time.deltaTime*freeze*moveSpeed*multiplier;
	}
	//Strafe toward hero at given speed
	public function moveTowardHero(m : float){
		var toHero : Vector3 = hero.model.transform.position - model.transform.position;
		model.transform.position += toHero.normalized * Time.deltaTime*freeze*moveSpeed * m;
	}
	//Strafe toward hero at default speed
	public function moveTowardHero(){
		moveTowardHero(1);
	}
	
	//Strafe away from hero at given speed
	public function moveFromHero(m : float){
		if (hooking || freeze == 0) return;
		var toHero : Vector3 = hero.model.transform.position - model.transform.position;
		model.transform.position += toHero.normalized * Time.deltaTime*freeze*moveSpeed * m * -1;
	}
	
	//Strafe away from hero at default speed
	public function moveFromHero(){
		moveFromHero(1);
	}
	
	//Rotate right (clockwise) at given speed
	public function turnRight(m : float){
		if (hooking || freeze == 0) return;
		model.transform.eulerAngles += Vector3(0, 0, Time.deltaTime*freeze * turnSpeed * m * -1);
	}
	public function turnRight(){
		turnRight(1);
	}
	
	//Rotate left (counterclockwise) at given speed
	public function turnLeft(m : float){
		if (hooking || freeze == 0) return;
		model.transform.eulerAngles += Vector3(0, 0, Time.deltaTime*freeze * turnSpeed * m * 1);
	}
	public function turnLeft(){
		turnLeft(1);
	}
	//Calculates distance from (center of) monster to hero
	public function distanceToHero(){
		return Vector3.Magnitude(model.transform.position - hero.model.transform.position);
	}
	//Gives an angle in degrees of the hero's radial position based on the monster's orientation
	public function angleToHero(){
		var vectorToHero : Vector3 = hero.model.transform.position - model.transform.position;
		var anglesToHero : float = Mathf.Atan2(vectorToHero.y, vectorToHero.x) * Mathf.Rad2Deg - 90;
		var num : float = anglesToHero - model.transform.eulerAngles.z;
		return num % 360 + 360;
	}
	//Gives an angle (in degrees) of the monster's radial position based on the hero's orientation. 0 is in front of hero, 180 is behind.
	//Good for monsters getting behind hero
	public function heroAngle(){
		var vectorToHero : Vector3 = model.transform.position - hero.model.transform.position;
		var anglesToHero : float = Mathf.Atan2(vectorToHero.y, vectorToHero.x) * Mathf.Rad2Deg - 90;
		var num : float = anglesToHero - hero.model.transform.eulerAngles.z;
		return num % 360 + 360;
	}
	//Rotates toward hero at given speed
	public function turnToHero(multiplier : float){
		var vectorToHero : Vector3 = model.transform.position - hero.model.transform.position;
		var anglesToHero : float = Mathf.Atan2(vectorToHero.y, vectorToHero.x) * Mathf.Rad2Deg - 90;
		if (anglesToHero < 0) anglesToHero += 360;
		//print("AnglestoHero: " + anglesToHero + ", Z: " + model.transform.eulerAngles.z);
		var sign : float = -1;
		if((model.transform.eulerAngles.z + (360-anglesToHero)) % 360 < 180) sign = 1;
		model.transform.eulerAngles += Vector3(0, 0, Time.deltaTime*freeze * turnSpeed * sign * multiplier);
	}
	public function turnToHero(){
		turnToHero(1);
	}
	
	
	public function charge(speed : float, duration : float){// charge the hero
		if (charging) return;
		charging = true;
		var t : float = 0;
		while(t < duration && health > 0){
			t += Time.deltaTime;
			moveTowardHero(speed);
			yield;
		}
		charging = false;
	}
	
	
	public function getHooked(speed : float){ // function used to hook monsters
		var t : float = 0;
		while(distanceToHero() > .5){
			t += Time.deltaTime;
			moveTowardHero(speed);
			yield;
		}
	}
	
	
	//Subroutine - call once, runs concurrently.
	public function flee(speed : float, duration : float){
		
		if (fleeing || hooking || freeze == 0) return;
		fleeing = true;
		var t : float = 0;
		while(t < duration && health > 0){
			t += Time.deltaTime;
			moveFromHero(speed);
			yield;
		}
		fleeing = false;
	}
	
	public function pause(duration:float){
		if (freeze==0) return; // can't have multiple freezes
		freeze=0;
		yield WaitForSeconds(duration);
		freeze=1;
	
	}

	
	//Subroutine - call once, runs concurrently.
	public function hurt(){
		if(!invincible){

			removeHeart();
			hurtSound.Play();
			playSound(hurtSound);
			flee(2, hurtRecovery); //Might want to be taken out and added only for specific monsters (by overriding hurt)
			health--;
			hurting = true;
			model.renderer.material.color = model.renderer.material.color+ Color(-.5,-.5,-.5);
			
			var t : float = hurtRecovery;
			while (t > 0 && health > 0){
				t -= Time.deltaTime;
				yield;
			}
			hurting = false;
			model.renderer.material.color = model.renderer.material.color+ Color(.5,.5,.5);
		}
			
	}
	
	function Update(){
		if(activateDistance == 0){
			if(health > 0){
				act();
				model.transform.localPosition.z = 0;
			}else if (health > -100){
				die(1);
				health -= 101;
			}	
		}
		updateHearts();	
		lighting();
	//if (modelObject.transform.renderer.material.color.a < .05)  modelObject.transform.renderer.material.color.a = .05;
	}
	
	function lighting(){
		var distance : Vector3 = modelObject.transform.position - manager.character.model.transform.position;
		if (distance.magnitude > 25) {
			activateDistance = 10;
			modelObject.GetComponent(Rigidbody).isKinematic = true;
			return;
		}
		activateDistance = 0;
		modelObject.GetComponent(Rigidbody).isKinematic = false;
		//var flashLight = 1- Mathf.Round(distance.magnitude/1.5) / (8) - (Vector3.Angle(distance, manager.character.model.lookDirection)/130);
		var flashLight = 1*(1 - distance.magnitude/4 + 1*(Vector3.Angle(distance, -manager.character.model.lookDirection)/60));
		//var aoeLight = 1-(Mathf.Round(distance.magnitude/1.0) / (4));
		var aoeLight = 1-distance.magnitude/8;
		if (aoeLight < 0 ) aoeLight = 0;
		if (flashLight < 0) flashLight = 0;
		if (flashLight > aoeLight) modelObject.transform.renderer.material.color = Color(flashLight*flashLight/2,flashLight*flashLight/2,flashLight);
		//if (flashLight > aoeLight) modelObject.transform.renderer.material.color.a = flashLight;
		else modelObject.transform.renderer.material.color = Color(aoeLight*aoeLight/2, aoeLight*aoeLight/2,aoeLight);
		
		//if (modelObject.transform.renderer.material.color.a < .05)  modelObject.transform.renderer.material.color.a = .05;
	}
	
	
	function die(deathTime : float){
		hero.killedMonsters++;
		var t : float = 0;
		//splatSound.Play();
		playSound(splatSound);
		dropColor();
		while (t < deathTime){
			t += Time.deltaTime;
			model.renderer.material.color.a = 1-(t/deathTime);
			yield;
		}
		Destroy(this.gameObject);
	}
	function act(){
		model.transform.position.z = 0;
		circlingBehaviour(2);
		if(Random.value > .99){
			simpleBullet();
		}
	}
	//A generic attack. 
	//Range is distance attack travels before disappearing.
	//Speed is the movement speed of the attack.
	//If home is more than zero the projectile homes toward the hero (the higher the number the more accurate the homing).
	//Width and depth are bullet dimensions. 
	//If fade is true, attack becomes translucent as it moves.
	//If destructible is true, the sword can destroy the bullets.
	//Keywords can be used for specific hit behaviours (stun, slow, knockback, etc) to be implemented in CharacterModel's (or WeaponModel's) OnTriggerEnter.
	function attack(range : float, speed : float, home : float, width :float, depth : float, color : Color, destructible : boolean, fade : boolean, keyword : String, bulletTexture : String, offsetAngle : float, damages : boolean){
		var attackObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	
		var attack : MonsterAttack = attackObject.AddComponent("MonsterAttack") as MonsterAttack;						
		attack.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		attack.transform.position = model.transform.position;
		attack.transform.rotation = model.transform.rotation;
		attack.transform.eulerAngles.z += offsetAngle;
		attack.name = "Monster Attack";											// Name the object.
		attack.renderer.material.mainTexture = Resources.Load("Textures/" + bulletTexture, Texture2D);	// Set the texture.  Must be in Resources folder.
		attack.renderer.material.color = color;												// Set the color (easy way to tint things).
		attack.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
		attack.transform.localScale = Vector3(width,depth,1); 
		attack.init(range, speed, fade, home, !damages);
		attack.hero = hero;
		attack.transform.parent = bulletFolder.transform;
		attackObject.collider.enabled = false;
		attackObject.AddComponent(BoxCollider);
		attackObject.GetComponent(BoxCollider).name = "attack d:" + destructible + " " + keyword;
		attackObject.GetComponent(BoxCollider).isTrigger = true;
		attackObject.GetComponent(BoxCollider).size = Vector3(.5,.5,10);
		attackObject.AddComponent(Rigidbody);
		attackObject.GetComponent(Rigidbody).isKinematic = false;
		attackObject.GetComponent(Rigidbody).useGravity = false;
		attackObject.GetComponent(Rigidbody).inertiaTensor = Vector3(100, 100, 100);
		attackObject.GetComponent(Rigidbody).freezeRotation = true;
		return attack;
	}
	
	// slow attack does not damage
	function attackSlow(range : float, speed : float, home : float, width :float, depth : float, color : Color, destructible : boolean, fade : boolean, keyword : String, bulletTexture : String){
		var temp:MonsterAttack = attack(range, speed, home, width, depth, color, destructible, fade, keyword, bulletTexture);
		temp.slow = true;
		temp.slowAmount = 2;
		temp.slowDuration = 1;
	}

	function attack(range : float, speed : float, home : float, width :float, depth : float, color : Color, destructible : boolean, fade : boolean, keyword : String, bulletTexture : String){
			return attack(range, speed, home, width, depth, color, destructible, fade, keyword, bulletTexture, 0);

	}

	function attack(range : float, speed : float, home : float, width :float, depth : float, color : Color, destructible : boolean, fade : boolean, keyword : String){
			return  attack(range, speed, home, width, depth, color, destructible, fade, keyword, "ball");

	}
	
	function attack(range : float, speed : float, home : float, width :float, depth : float, color : Color, destructible : boolean, fade : boolean, keyword : String, bulletTexture : String, offsetAngle : float){
		return attack(range, speed, home, width, depth, color, destructible, fade, keyword, bulletTexture, offsetAngle, true);
	}

	function dropColor(){
		//print("Dropping Random Color");
		if(color == "random"){
			var rand : float = Random.value;
		} else{
			dropColor(color);
			return;
		}
		//print(rand);
		if(rand < 2.0/6){
			dropColor("red");
		}else if(rand < 4.0/6){
			dropColor("yellow");
		}else if(rand <= 6.0/6){
			dropColor("blue");
		}else if(rand < 4.0/6){
			dropColor("antiRed");
		}else if(rand < 5.0/6){
			dropColor("antiYellow");
		}else {
			dropColor("antiBlue");
		}
	}
	function dropColor(color : String){
		dropColor(color, 4);
	}
	
	function dropColor(color : String, duration : float){
		if(color.Equals("red")) dropColor(1, 0, 0, duration);
		if(color.Equals("yellow")) dropColor(0, 1, 0, duration);
		if(color.Equals("blue")) dropColor(0, 0, 1, duration);
		if(color.Equals("anitRed")) dropColor(-1, 0, 0, duration);
		if(color.Equals("antiYellow")) dropColor(0, -1, 0, duration);
		if(color.Equals("antiBlue")) dropColor(0, 0, -1, duration);
		
	}
	function dropColor(red : float, yellow : float, blue : float, duration : float){
		//print("Dropping color!");
		var blobObject = GameObject.CreatePrimitive(PrimitiveType.Quad);
		var blob : ColorBlob = blobObject.AddComponent("ColorBlob") as ColorBlob;
		blob.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		blob.transform.position = model.transform.position;
		blob.transform.rotation = model.transform.rotation;
		blob.name = "Blob";											// Name the object.
		blob.renderer.material.mainTexture = Resources.Load("Textures/colorBlob", Texture2D);	// Set the texture.  Must be in Resources folder.
		blob.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
		blob.init(red, yellow, blue, duration);
		//attack.transform.parent = ??
		blobObject.collider.enabled = false;
		blobObject.AddComponent(BoxCollider);
		blobObject.GetComponent(BoxCollider).isTrigger = true;
		blobObject.GetComponent(BoxCollider).size = Vector3(.6,.6,10);
		/*
		blobObject.AddComponent(Rigidbody);
		blobObject.GetComponent(Rigidbody).isKinematic = false;
		blobObject.GetComponent(Rigidbody).useGravity = false;
		blobObject.GetComponent(Rigidbody).inertiaTensor = Vector3(1, 1, 1);
		blobObject.GetComponent(Rigidbody).freezeRotation = true;
		*/
	}
	//An example behaviour. Monster maintains constant distance and circles around hero, facing it.
	public function circlingBehaviour(distance : float){
		moveRight();
		turnToHero();
		if(distanceToHero() > distance){
			move();
		} else {
			moveBack();
		}
	}
	//Example melee attack
	function simpleMelee(){
		attack(1, 4, 0, 1, .2, Color(1, 1, 1), false, true, "melee");
		//hissSound.Play();
		playSound(hissSound);
	}
	//Example ranged attack
	function simpleBullet(){
		attack(5, 2.5, .5, .3, .3, Color(1, 0, 1),true, false, "bullet");
		//puffSound.Play();
		playSound(puffSound);
	}
	
	function createMinion(n : String){
		var minionObject = new GameObject();					// Create a new empty game object that will hold a character.
		var minionScript : Minion;
		minionScript = minionObject.AddComponent("Minion");
		minionScript.transform.parent = minionFolder.transform;
		
		minionScript.init(this);
		minionScript.name = n;
		return minionScript;
	}
	//To be overridden in monsters. Here you can react to things happening to the monster's minion.
	function minionCollision(minion : Minion, col : Collider){
	}
	
	function playSound(source : AudioSource){
		manager.playSound(source, model.transform.position);
	}
	function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		
		//Gizmos.DrawWireCube (model.transform.position, modelObject.GetComponent(BoxCollider).size);
	
	}
	
	function addHearts(){
		//return;
		hearts = new Array();
		yield; //WaitForSeconds(.02);
		for (var i=0; i<health; i++){
			var heartObject = GameObject.CreatePrimitive(PrimitiveType.Quad);
			
			heartObject.gameObject.transform.position = model.transform.position;
			//heartObject.gameObject.transform.rotation = model.transform.rotation;
			
												// Name the object.
			heartObject.renderer.material.mainTexture = Resources.Load("Textures/heartEnemy", Texture2D);	// Set the texture.  Must be in Resources folder.
			heartObject.renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
			heartObject.gameObject.collider.enabled = false;
			heartObject.gameObject.transform.parent = this.transform;
			//heartObject.transform.localPosition = Vector3(((0-health/2)+i+.5)*.5, 0,-1);						// Center the model on the parent.
			heartObject.transform.localScale = Vector3(heartScale, heartScale, heartScale);
			heartObject.gameObject.name = "heartObject";	
			hearts.Add(heartObject);
		}
		curHeart = health-1;
	
	}
	function updateHearts(){
		for (var i = 0; i < hearts.length; i ++){
			var heart : GameObject  = hearts[i];
			if(heart != null){
				heart.transform.position.y = model.transform.position.y + heartOffset;
				heart.transform.position.x = model.transform.position.x + heartSpacing*(i - (0.0+health-1)/2);
				if(!showHealth) heart.transform.renderer.material.color.a=0.0;
				else heart.transform.renderer.material.color.a = model.transform.renderer.material.color.a * heartOpacity;
			}
		}
	}
	
	function removeHeart(){

		//return;
		if (curHeart < 0 || hearts.length < 1) return;
		Destroy(hearts[curHeart]);
		hearts.Remove(hearts.length);
		curHeart--;
	}
	
	
}