#pragma strict

//The hero's sword.
public class Weapon extends MonoBehaviour{

	public var weaponObject : GameObject; //GameObject for weapon's behavior
	public var owner : Character;	//the owner of this weapon (Currently can only be the main character)
	public var model : WeaponModel;	//Model object for weapon
	public var baseRotation : Vector3;	//Default offset rotation when weapon is held
	public var basePosition : Vector3;	//Default offset translation when weapon is held
	//public var rotationPoint : Vector3;
	public var swinging : boolean;	//Boolean used to decide if sword inflicts damage on contact
	public var recovering : boolean;	//Boolean used to decide if sword is still recovering
	public var swingSound : AudioSource; //Need one of these for each different clip.
	public var tossSound : AudioSource; 
	public var tossSpeed : float; // A variable that can be used to modify the "toss" function mid subroutine. Called by WeaponModel in "OnTriggerEnter"
	public var hasHit : boolean;
	
	public var throwTime : float;
	public var throwRecovery : float;
	public var swingTime : float;
	public var swingRecovery : float;
	public var throwDistance : float;
	public var swingArc : int;
	//Takes owner (main character) as parameter
	function init(c:Character){
		this.name = "Weapon";
		recovering = false;
		owner = c;
		owner.setWeapon(this);
		weaponObject = new GameObject();
		weaponObject.name = "WeaponObject";
		//weaponObject.collider.enabled = false;
		hasHit = false;
		baseRotation = Vector3(0, 0, -55);
		basePosition = Vector3(0, 0, 0);
	 	weaponObject.AddComponent(BoxCollider);
	 	weaponObject.GetComponent(BoxCollider).isTrigger = true;
	 	weaponObject.GetComponent(BoxCollider).size = Vector3(.1,2,.5);
	 	weaponObject.AddComponent(Rigidbody);
	 	weaponObject.GetComponent(Rigidbody).isKinematic = false;
	 	weaponObject.GetComponent(Rigidbody).useGravity = false;
	 	weaponObject.GetComponent(Rigidbody).inertiaTensor = Vector3(1, 1, 1);
	 	weaponObject.transform.parent = owner.model.transform;
		model = weaponObject.AddComponent("WeaponModel") as WeaponModel;
		model.weapon = this;
		model.transform.parent = weaponObject.transform;								
		model.transform.localPosition = basePosition;						
		model.transform.localEulerAngles = baseRotation;						
		var spriteRenderer = weaponObject.AddComponent("SpriteRenderer") as SpriteRenderer;
		spriteRenderer.sprite = UnityEngine.Sprite.Create(Resources.Load("Textures/stick2", Texture2D), new Rect(40,0,60,100), new Vector2(0.5f, 0), 100f);
 		resetPosition();
		stopSwinging();
		
		swingSound = gameObject.AddComponent("AudioSource") as AudioSource; //Initialized AudioSource
		swingSound.clip = Resources.Load("Sounds/woosh") as AudioClip; //Loads proper clip. In Unity Editor make sure "3D Sound" is UNCHECKED. It's checked by default. MP3s seem to work well and Audacity can export them.
		swingSound.volume = .7;
		tossSound = gameObject.AddComponent("AudioSource") as AudioSource;
		tossSound.clip = Resources.Load("Sounds/woosh-woosh") as AudioClip;
		tossSound.volume = .5;
		
		throwTime = .5;
		throwRecovery = 1;
		throwDistance = 3;
		swingTime = .2;
		swingRecovery = .2;
		swingArc = 110;
 		}
 		
 	//Returns distance to hero
 	function distanceFromOwner(){
 		return Vector3.Magnitude(model.transform.position - owner.model.transform.position);
 	}
 	
 	//Used when weapon can start inflicting damage
 	function startSwinging(){
 		swinging = true;
 		model.renderer.material.color = Color(1,1,1);
 		owner.model.rjTimer = owner.model.rollTime;

 	}
 	
 	//Used when weapon can no longer inflict damage
 	function stopSwinging(){
 		swinging = false;
 		model.renderer.material.color = Color(.8,.6,.6);
 	}
 	
 	//Used when recovery begins
 	function startRecovery(){
 		recovering = true;
 		model.renderer.material.color = Color(.7,.5,.5);

 	}
 	
 	//Used when recovery ends
 	function stopRecovery(){
 		recovering = false;
 		model.renderer.material.color = Color(.8,.6,.6);
 	}
 	
 	//Subroutine
 	//Hero swings sword across (angle) over (time), recovering for (recovery) seconds.
 	function swing(angle : int, time : float, recovery : float){
 		swingSound.Play(); // Plays the sound

 		startSwinging();
 		var t : float = 0;
 		//Swinging motion
 		while (t < time){
 				t += Time.deltaTime;
 			//model.transform.eulerAngles = baseRotation + Vector3(0, 0, angle*(t/time));
 				model.transform.RotateAround(model.transform.position, Vector3.forward, angle/time * Time.deltaTime);
 			
 			yield;
 		}
 		
 		stopSwinging();
		startRecovery();
		//Recovery motion
 		while (t < time + recovery){
 			t += Time.deltaTime;
 			model.transform.RotateAround(model.transform.position, Vector3.forward, -angle/recovery * Time.deltaTime);
 			yield;
 		}
 		model.transform.localEulerAngles = baseRotation;
 		model.transform.localPosition = basePosition;
 		stopRecovery();
 	}

	//Subroutine
	//Hero executes spin attack over time (time), recovers for (recovery) seconds. Sword rotates by 360 plus (overshoot). 
	function spin(time : float, recovery : float, overshoot : float){
		startSwinging();
 		var t : float = 0;
 		while (t < time){
 				if(!tossSound.isPlaying) tossSound.Play();
 				t += Time.deltaTime;
 			//model.transform.eulerAngles = baseRotation + Vector3(0, 0, angle*(t/time));
 				model.transform.RotateAround(model.transform.position, Vector3.forward, (360 + overshoot)/time * Time.deltaTime);
 			
 			yield;
 		}
 		stopSwinging();
 		startRecovery();
 		t=0;
 		
 		while (t < recovery){
 			t += Time.deltaTime;
 			model.transform.RotateAround(model.transform.position, Vector3.forward, -overshoot/recovery * Time.deltaTime);
 			yield;
 		}
 		model.transform.localEulerAngles = baseRotation;
 		model.transform.localPosition = basePosition;
 		stopRecovery();
 	}
	
	//Subroutine
	//Throw sword directly forward by (distance) over (time), spinning at rate (spinSpeed). Recover for time (recovery). 
	//Sword returns at speed (distance)/(time) - same speed it's thrown. Currently still damages foes during this time.
  	function toss(distance : float, time : float, spinSpeed : float, recovery : float){
 		model.transform.parent = null;
 		var heading : Vector3 = owner.model.transform.up;
 		Vector3.Normalize(heading);
 		startSwinging();
 		tossSpeed = distance/time;
 		var t : float = 0;
 		//Throw outward
 		while (t < time && !hasHit){
 			if(!tossSound.isPlaying) tossSound.Play();
 			t += Time.deltaTime;
 			model.transform.RotateAround(model.transform.position, Vector3.forward, spinSpeed * Time.deltaTime);
 			model.transform.position += (heading * tossSpeed * Time.deltaTime);
 			yield;
 		}
 		hasHit = false;
 		t=0;
 		//Recover until sword reaches hero
 		while (distanceFromOwner() > .1){
 			t += Time.deltaTime;
 			 if(!tossSound.isPlaying) tossSound.Play();

 			model.transform.RotateAround(model.transform.position, Vector3.forward, spinSpeed * Time.deltaTime);
 			heading = model.transform.position - owner.model.transform.position;
 			model.transform.position -= (heading.normalized * tossSpeed * Time.deltaTime);
 			yield;
 		}
 		//resetPosition();
 		model.transform.parent = owner.model.transform;
		model.transform.localEulerAngles = baseRotation;
 		model.transform.localPosition = basePosition;
 		model.transform.position = owner.model.transform.position;
 		model.transform.localScale = Vector3.one;
 		stopSwinging();
 		startRecovery();
 		t=0;
 		while (t < recovery){
 			t += Time.deltaTime;
 			yield;
 		}
 		
 		stopRecovery();
 	}
 	//Looks for key input, executes proper function depending on color.
 	function Update(){

 		if(Input.GetKeyDown("up") && !swinging && !recovering && owner.model.yellow){
 			if(owner.model.jumping){
 				if(!owner.model.red){
 					spin(.5, .7, 110);
 				} else{
 					spin(1, 1, 110);
 				}
 			} else{
 				if(!owner.model.red){
 					//swing(110, .3, .5);
 					swing(swingArc, swingTime, swingRecovery);
 				} else {
 					//swing(110, .5, 1);
 					swing(swingArc, swingTime, swingRecovery);
 				}
 			}
 		}
 		if(Input.GetKeyDown("up") && !swinging && !recovering && !owner.model.yellow){
 			//toss(4, .8, 1000, 1);
 			toss(throwDistance, throwTime, 1000, throwRecovery);
 		}
 	}
 	
 	//Subroutine called at initialization
	//Constantly places sword at hero. This deals with the issue of the sword moving while the hero runs against an obstacle.
	function resetPosition(){
		while (true){
			if(!swinging)
				model.transform.position = owner.model.transform.position;
			yield WaitForSeconds(.01);
			//print("Test");
		}
	}
	
	
	
	
 }