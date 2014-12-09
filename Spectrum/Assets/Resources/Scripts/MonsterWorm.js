#pragma strict
public class MonsterWorm extends Monster{
	
	var rumble1Sound : AudioSource;
	var rumble2Sound : AudioSource;
	var screechSound : AudioSource;
	var offSound : AudioSource;
	var undergroundTime : float;
	var jumping : boolean;
	var height : float;
	var zSpeed : float;
	var speed : float;
	var numBehind : int;
	var tail : MonsterWorm;
	var head : MonsterWorm;
	var delay : float = .1;
	var passTime : float;
	var isFront : boolean;
	function init(c: Character){
		super.init(c);
		health = 3;
		model.renderer.material.mainTexture = Resources.Load("Textures/segment", Texture2D);	// Set the texture.  Must be in Resources folder.
		setSize(1.5, 1.5);
		activateDistance = 50;
		//Add sound
//		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
//		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
		
		rumble1Sound = gameObject.AddComponent("AudioSource") as AudioSource;
		rumble1Sound.clip = Resources.Load("Sounds/rumble1") as AudioClip;
		rumble1Sound.playOnAwake = false;
		rumble2Sound = gameObject.AddComponent("AudioSource") as AudioSource;
		rumble2Sound.clip = Resources.Load("Sounds/rumble2") as AudioClip;
		rumble2Sound.playOnAwake = false;
		screechSound = gameObject.AddComponent("AudioSource") as AudioSource;
		screechSound.clip = Resources.Load("Sounds/wormScreech") as AudioClip;
		screechSound.playOnAwake = false;
		offSound = gameObject.AddComponent("AudioSource") as AudioSource;
		offSound.clip = Resources.Load("Sounds/segmentOff") as AudioClip;
		offSound.playOnAwake = false;
		invincible = false;
		modelObject.GetComponent(BoxCollider).isTrigger = true;
 		modelObject.GetComponent(Rigidbody).useGravity = false;
 		modelObject.GetComponent(Rigidbody).inertiaTensor = Vector3(100, 100, 100);
 		modelObject.GetComponent(Rigidbody).freezeRotation = true;
 		showHealth = false;
 		isFront = true;
 		numBehind = 20;
 		createTail(numBehind - 1);
	}
	
	function init(c : Character, n : int){
		super.init(c);
		health = 1;
		model.renderer.material.mainTexture = Resources.Load("Textures/segment", Texture2D);	// Set the texture.  Must be in Resources folder.
		setSize(1.5, 1.5);
		activateDistance = 50;	
		rumble1Sound = gameObject.AddComponent("AudioSource") as AudioSource;
		rumble1Sound.clip = Resources.Load("Sounds/rumble1") as AudioClip;
		rumble1Sound.playOnAwake = false;
		rumble2Sound = gameObject.AddComponent("AudioSource") as AudioSource;
		rumble2Sound.clip = Resources.Load("Sounds/rumble2") as AudioClip;
		rumble2Sound.playOnAwake = false;
		screechSound = gameObject.AddComponent("AudioSource") as AudioSource;
		screechSound.clip = Resources.Load("Sounds/wormScreech") as AudioClip;
		screechSound.playOnAwake = false;
		
		offSound = gameObject.AddComponent("AudioSource") as AudioSource;
		offSound.clip = Resources.Load("Sounds/segmentOff") as AudioClip;
		offSound.playOnAwake = false;
		invincible = false;
		modelObject.GetComponent(BoxCollider).isTrigger = true;
 		modelObject.GetComponent(Rigidbody).useGravity = false;
 		modelObject.GetComponent(Rigidbody).inertiaTensor = Vector3(100, 100, 100);
 		modelObject.GetComponent(Rigidbody).freezeRotation = true;
 		showHealth = false;
		numBehind = n;
		if(n > 0) createTail(n-1);
	}
	
	function createTail(n : int){
		var monsterObject = new GameObject();					// Create a new empty game object that will hold a character.
		var monsterScript : MonsterWorm = monsterObject.AddComponent("MonsterWorm");
		//print("MonsterScript: " + monsterScript + " MonsterScript Transform: " + monsterScript.transform + " Manager: " + manager);
//		print("Manager monsterFolder: " + manager.monsterFolder);
		//print(" Manager monsterFolder Transform: " + manager.monsterFolder.transform);
		monsterScript.transform.parent = manager.monsterFolder.transform;
		monsterScript.transform.position = model.transform.position;							
		monsterScript.init(hero, n);
		monsterScript.manager = manager;
		manager.monsters.Add(monsterScript);
		monsterScript.name = "Monster"+ manager.monsters.length;
		tail = monsterScript;
		monsterScript.head = this;
		return monsterObject;
	}
	//Approaches hero. If it's lined up, it will lunge. 
	function act(){
		if(isFront) lead();
		else if(jumping){
			contactAttack();
			move(speed);
			height += zSpeed * Time.deltaTime*.5;
			zSpeed -= Time.deltaTime*5;
			setSize(1 + (height), 1+(height));
			if(height < 0){
				jumping = false;
				dirtCloud();
				invincible = true;
				undergroundTime = 10;
				rumble2Sound.volume = 1;
				playSound(rumble2Sound);

			}
		}
	}
	
	function lead(){
		if(!jumping){
			undergroundTime -= Time.deltaTime;
			turnToHero(3);
			move();
			if(Random.value > .80) smallCloud();
			if(undergroundTime < 0){
				jump();
			}
		} else{
			contactAttack();
			move(speed);
			height += zSpeed * Time.deltaTime*.5;
			zSpeed -= Time.deltaTime*5;
			setSize(1 + (height), 1+(height));
			if(height < 0){
				jumping = false;
				dirtCloud();
				invincible = true;
				undergroundTime = Random.value*4 + 2;
				rumble2Sound.volume = 1;
				playSound(rumble2Sound);

			}
		}
	}
	
	function jump(){
		screech();
		dirtCloud();
		faceHero();
		zSpeed = 3+Random.value*2;
		speed = 3 + Random.value;
		height = 0;
		jumping = true;
		invincible = false;
		if (tail != null) tail.scheduleJump(model.transform.position, model.transform.eulerAngles.z, zSpeed, speed);
	}
	function scheduleJump(position, direction, zS, s){
		yield WaitForSeconds(delay);
		jump(position, direction, zS, s);
	}
	
	function jump(position, direction, zS, s){
		playSound(rumble1Sound);
		undergroundTime = 0;
		model.transform.position = position;
		model.transform.eulerAngles.z = direction;
		zSpeed = zS;
		speed = s;
		height = 0;
		jumping = true;
		invincible = false;
		dirtCloud();

		if (tail != null) tail.scheduleJump(model.transform.position, model.transform.eulerAngles.z, zSpeed, speed);
	}
	
	function faceHero(){
		model.transform.eulerAngles.z += angleToHero();
	}

	function dirtCloud(){
		var explosionParticle : ParticleSystem = Instantiate(hero.manager.explosionWorm1);
		explosionParticle.transform.position = model.transform.position;
		explosionParticle.transform.position.z = 10;
		explosionParticle.gameObject.SetActive(true);
		emergeAttack();
		yield WaitForSeconds(1);
		Destroy(explosionParticle.gameObject);

	}
	
	function smallCloud(){
		rumble2Sound.volume = .5;
		playSound(rumble2Sound);
		var explosionParticle : ParticleSystem = Instantiate(hero.manager.explosionWorm2);
		explosionParticle.transform.position = model.transform.position;
		explosionParticle.transform.position.z = 10;
		explosionParticle.gameObject.SetActive(true);
		yield WaitForSeconds(1);
		Destroy(explosionParticle.gameObject);
	}
	
	function lighting(){
		if(undergroundTime > 0){
			model.renderer.material.color.a = 0;
		} else{
			super.lighting();
		}
	}
	/* 
	//Without splitting functionality:
	public function hurt(){
		ejectPiece();
		if(numBehind == 0 && isFront) super.hurt();
		else if(isFront){
			passHurtDown();
		}
		else passHurtUp();
		
	}
	*/
	
	public function hurt(){
		ejectPiece();
		if(numBehind == 0 && isFront) super.hurt();
		else if(isFront){
			passHurtDown();
		}
		else if(numBehind == 0) passHurtUp();
		else{
			split();
			head.passSplitUp(0);
		}
		
	}
	
	function split(){
		isFront = true;
		undergroundTime = Random.value*4 + 2;
	}
	function passSplitUp(n : int){
		numBehind = n;
		if(!isFront)
			head.passSplitUp(n+1);
	}
	
	function passHurtDown(){
		numBehind--;
		if(numBehind == 0){
			Destroy(tail.gameObject);
			tail = null;
			ejectPiece();
		} else{
			if(tail != null)
				tail.passHurtDown();
		}
	}
	
	function passHurtUp(){
		if(isFront) passHurtDown();
		else head.passHurtUp();
	}
	
	function screech(){
		yield WaitForSeconds(.5);
		playSound(screechSound);
		shootAttack(7);
	}
	function emergeAttack(){
		attack(.1, 1, 0, 3, 3, Color.clear, false, false, "", "segment", 0, true);
	}
	function contactAttack(){
		attack(.1, 1, 0, 1.5, 1.5, Color.clear, false, false, "", "segment", 0, true);
	}
	function shootAttack(shots : int){
		for(var i : int = 0; i < shots; i++){
			attack(10, 5, 0, 1, 1, Color.white, false, false, "", "segment", angleToHero() + Random.value*100-50, true);
		}
	}
	function ejectPiece(){
		attack(2, 4, 0, 1.5, 1.5, Color.white, false, true, "", "segment", Random.value*360, false);
		playSound(offSound);

	}
	
	function minionCollision(minion : Minion, col : Collider){
		
	}
}