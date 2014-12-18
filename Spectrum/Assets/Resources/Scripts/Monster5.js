
// invisible/blink with normal projectile
var isVisible : boolean;
var clock : float;
var blinkCounter : int;
var anim : Animator;
var sprend : SpriteRenderer;

public class Monster5 extends Monster {
	
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
		model.name = "Monster Model";										// Name the object.
		anim = modelObject.AddComponent("Animator");
		sprend = modelObject.AddComponent("SpriteRenderer");
		anim.runtimeAnimatorController = Resources.Load("Animations/Wizard");

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
		rotateTimer = 0.0;
		isVisible = true;
		clock = 0.0;
		blinkCounter = 0;
		health = 1;
		heartOffset = model.gameObject.GetComponent(BoxCollider).size.y;
		addHearts();
	}
	
	function hurt() {
		if (isVisible) {
			anim.SetTrigger("Hurt");
			super.hurt();
		} 
	}
	
	function blink() {
		if (clock%3 <.1 && clock/3 > blinkCounter ) {
			if (isVisible) {
				playSound(vip1Sound);
				anim.SetTrigger("Invis");
				isVisible = false;
				blinkCounter++;
				if (model!= null) model.renderer.material.color.a = .1;
			}else{
				playSound(vip2Sound);
				isVisible = true;
				blinkCounter++;
				if (model!= null) model.renderer.material.color.a = 1;
			}
	 } 
	}
	
	function Update() {
		super.Update();
		clock = clock + Time.deltaTime*freeze;
		blink();
	}
	
	function lighting(){
		if( isVisible){
		var distance : Vector3 = model.transform.position - hero.model.transform.position;
		var flashLight = 1- Mathf.Round(distance.magnitude/1.5) / (8) - (Vector3.Angle(distance, hero.model.lookDirection)/130);
		var aoeLight = 1-(Mathf.Round(distance.magnitude/1.0) / (4));
		if (flashLight > aoeLight) model.transform.renderer.material.color.a = flashLight;
		else model.transform.renderer.material.color.a = aoeLight;
	}
	}
	
	function act(){
		model.transform.position.z = 0;
		circlingBehaviour(2);
		if(Random.value > .94){
			if (!isVisible) return;
			anim.SetTrigger("Attack");
			simpleBullet();
		}
	}

}
