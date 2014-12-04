
// Zee pushing monster
public class Monster9 extends Monster {
	
	var rotateTimer : float;
	var currMovement : int;
	var magnetSound : AudioSource;
	var soundTime : float = 0;
	var magnetTimer : float = 0;
	var anim : Animator;
	var sprend : SpriteRenderer;
	
	function init(c : Character) {
		color = "random";
		activateDistance = 10;
		invincible = false;
		charging = false;
		fleeing = false;
		hooking = false;
		freeze=1;
		hero = c;
		hurting = false;
		hurtRecovery = 1;
		modelObject = GameObject();	// Create a quad object for holding the monster texture.
		model = modelObject.AddComponent("MonsterModel") as MonsterModel;						// Add a monsterModel script to control visuals of the monster.
		model.monster = this;
		moveSpeed = 1;
		turnSpeed = 90;
		
		model.transform.parent = transform;									// Set the model's parent to the gem (this object).
		model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		model.transform.localScale = Vector3(0.5,0.5,5);
		model.name = "Monster Model";										// Name the object.
		anim = modelObject.AddComponent("Animator");
		sprend = modelObject.AddComponent("SpriteRenderer");
		anim.runtimeAnimatorController = Resources.Load("Animations/Magna");

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
		addHearts();
		magnetSound = gameObject.AddComponent("AudioSource") as AudioSource;
		magnetSound.clip = Resources.Load("Sounds/wum") as AudioClip;
		rotateTimer = 0.0;
		health = 1;
		heartOffset = model.gameObject.GetComponent(BoxCollider).size.y;
		addHearts();
	}
	
	function hurt() {
		if(!invincible){
			anim.SetBool("Hurting", true);
			removeHeart();
			hurtSound.Play();
			playSound(hurtSound);
			flee(2, hurtRecovery); //Might want to be taken out and added only for specific monsters (by overriding hurt)
			health--;
			hurting = true;
			model.renderer.material.color = Color(.5,.5,.5);
			
			var t : float = hurtRecovery;
			while (t > 0 && health > 0){
				t -= Time.deltaTime;
				yield;
			}
			hurting = false;
			anim.SetBool("Hurting", false);
			model.renderer.material.color = Color(1,1,1);
		}
	}
	
	function act() {
		if(magnetTimer <= 0){
			moveRandomly();
			if (distanceToHero() <= 6 && distanceToHero() >= 2 && Random.value > .99) {
				anim.SetBool("Attacking", true);
				magnetTimer = .7;
				playSound(magnetSound);
				attack(2, 2, 0, 1, 1, Color.white, false, false, "", "sparkWaves", angleToHero(), false);
			}
		} else{
			anim.SetBool("Attacking", false);
			magnetTimer -= Time.deltaTime;
			
			moveHero();	
			
		}
		
	}
	
		function moveRandomly(){
		rotateTimer = rotateTimer + Time.deltaTime;
		var randomChange : float = Random.value;
		if (rotateTimer > randomChange) {
			var newMove : int = Random.Range(1,6);
			currMovement = newMove;
			rotateTimer = 0;
		}
		switch(currMovement) {
			case 1: 
				 move(2);
				 break;
			case 2: 
				turnRight(3);
				move(4);
				break;
			case 3: 
				turnLeft(3);
				move(4);
				break;
			case 4: 
				moveBack(2);
				break;
			case 5: 
				moveLeft(2);
				break;
			case 6: 
				moveRight(2);
				break;		
				
		}		
	}
	
	function moveHero(){
			var heroTo : Vector3 = model.transform.position - hero.model.transform.position;
			hero.model.transform.position -= .5*heroTo * Time.deltaTime*freeze*moveSpeed;
	}
	
}