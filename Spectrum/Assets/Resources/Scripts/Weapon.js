#pragma strict

//The hero's sword.
public class Weapon extends MonoBehaviour{

	public var weaponObject : GameObject; //GameObject for weapon's behavior
	public var owner : Character;	//the owner of this weapon (Currently can only be the main character)
	public var model : WeaponModel;	//Model object for weapon
	public var baseRotation : Vector3;	//Default offset rotation when weapon is held
	public var basePosition : Vector3;	//Default offset translation when weapon is held
	var character:Character;
	//public var rotationPoint : Vector3;
	public var swinging : boolean;	//Boolean used to decide if sword inflicts damage on contact
	public var recovering : boolean;	//Boolean used to decide if sword is still recovering
	public var swingSound : AudioSource; //Need one of these for each different clip.
	public var tossSound : AudioSource; 
	public var clubSound : AudioSource; 
	public var tossSpeed : float; // A variable that can be used to modify the "toss" function mid subroutine. Called by WeaponModel in "OnTriggerEnter"
	public var hasHit : boolean;
	
	public var throwTime : float;
	public var tossTime : float; // time current toss has been out
	public var throwRecovery : float;
	public var swingTime : float;
	public var swingRecovery : float;
	public var throwDistance : float;
	public var swingArc : int;
	public var spriteRenderer: SpriteRenderer;
	public var vibrating:boolean;
	
	public var canThrow:boolean; // boolean for being able to throw this star 
	public var isDual:boolean;
	public var isMeele = false;
	public var clubAttackColor : Color;
	
	//Takes owner (main character) as parameter
	
// *******************************************
// 			   Initialization
// *******************************************

	function init(c:Character){
		isDual = false;
		canThrow = false;
		vibrating = false;
		this.name = "Weapon";
		recovering = false;
		owner = c;
		character = c;
		weaponObject = new GameObject();
		weaponObject.name = "WeaponObject";
		//weaponObject.collider.enabled = false;
		hasHit = false;
		baseRotation = Vector3(0, 0, -55);
		basePosition = Vector3(0, 0, 0);
	 	weaponObject.AddComponent(BoxCollider);
	 	weaponObject.GetComponent(BoxCollider).isTrigger = true;
	 	weaponObject.GetComponent(BoxCollider).size = Vector3(.1, 2, .5);
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
		spriteRenderer = weaponObject.AddComponent("SpriteRenderer") as SpriteRenderer;
		spriteRenderer.sprite = UnityEngine.Sprite.Create(Resources.Load("Textures/stick2", Texture2D), new Rect(40,0,60,100), new Vector2(0.5f, 0), 100f);
 		resetPosition();
		stopSwinging();
		swingSound = gameObject.AddComponent("AudioSource") as AudioSource; //Initialized AudioSource
		swingSound.clip = Resources.Load("Sounds/woosh") as AudioClip; //Loads proper clip. In Unity Editor make sure "3D Sound" is UNCHECKED. It's checked by default. MP3s seem to work well and Audacity can export them.
		swingSound.volume = .7;
		tossSound = gameObject.AddComponent("AudioSource") as AudioSource;
		tossSound.clip = Resources.Load("Sounds/woosh-woosh") as AudioClip;
		tossSound.volume = .5;
		clubSound = gameObject.AddComponent("AudioSource") as AudioSource;
		clubSound.clip = Resources.Load("Sounds/crash") as AudioClip;
		swingSound.playOnAwake = false;
		tossSound.playOnAwake = false;
		clubSound.playOnAwake = false;

		throwTime = .37;
		throwRecovery = 1;
		throwDistance = 3;
		swingTime = .2;
		swingRecovery = .2;
		swingArc = 110;
		clubAttackColor = Color(1, 1, .8);
		clubAttackColor.a = .2;
 		
	//	weaponObject.GetComponent(Rigidbody).active = false;
	//	weaponObject.GetComponent(BoxCollider).active = false;


 		}
 		
// *******************************************
// 			   Helper Functions
// *******************************************

 	//Returns distance to hero.
 	function distanceFromOwner(){
 		return Vector3.Magnitude(model.transform.position - owner.model.transform.position);
 	}
 	
 	//Used when weapon can start inflicting damage
 	function startSwinging(){
 		swinging = true;
 		model.renderer.material.color = Color(1,1,1);
 		//owner.model.rjTimer = owner.model.rollTime;

 	}
 	
 	//Used when weapon can no longer inflict damage
 	function stopSwinging(){
 		swinging = false;
 		if (character.isThrowingStar == false){
 			model.renderer.material.color = Color(.8,.6,.6);
 		}
 	}
 	
 	//Used when recovery begins
 	function startRecovery(){
 		recovering = true;
 		if (character.isThrowingStar == false){
 		model.renderer.material.color = Color(.7,.5,.5);
 		}

 	}
 	
 	//Used when recovery ends
 	function stopRecovery(){
 		recovering = false;
 		if (character.isThrowingStar == false){
 		model.renderer.material.color = Color(.8,.6,.6);
 		}
 	}
 	
// *******************************************
// 			   Attacks
// *******************************************

 	//Subroutine
 	//Hero swings sword across (angle) over (time), recovering for (recovery) seconds.
 	function swing(angle : int, time : float, recovery : float){
 		swingSound.Play(); // Plays the sound

 		startSwinging();
 		var t : float = 0;
 		//Swinging motion
 		while (t < time/1.25){
 				t += Time.deltaTime;
 			//model.transform.eulerAngles = baseRotation + Vector3(0, 0, angle*(t/time));
 				model.transform.RotateAround(model.transform.position, Vector3.forward, 1.25*angle/time * Time.deltaTime);
 			
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
 	
 	
 	function pauseSwing(angle : int, time : float, recovery : float, pTime:float){
 		swingSound.Play(); // Plays the sound

 		startSwinging();
 		var t : float = 0;
 		//Swinging motion
 		while (t < time/1.25){
 				t += Time.deltaTime;
 			//model.transform.eulerAngles = baseRotation + Vector3(0, 0, angle*(t/time));
 				model.transform.RotateAround(model.transform.position, Vector3.forward, 1.25*angle/time * Time.deltaTime);
 			
 			yield;
 		}
 		yield WaitForSeconds(pTime);
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
 	
 	function dualSwing(angle : int, time : float, recovery : float){ // swing for the dual weild sword
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
  	function tossStar(distance : float, time : float, spinSpeed : float, recovery : float, rotation: int){	
 		canThrow = false;
 		model.transform.parent = null;
 		if (rotation == 0) {
 			var heading : Vector3 = owner.model.transform.up;
 		} else if (rotation == 180) {
 			heading = -owner.model.transform.up;
 		} else if (rotation == 90) {
 			heading = owner.model.transform.right;
 		}
 		else if (rotation == 270) {
 			heading = -owner.model.transform.right;
 		}
 		Vector3.Normalize(heading);
 		swinging = true;

 		tossSpeed = distance/time;
 		tossTime = 0;
 		//Throw outward
 		var moveAdder:Vector3 = character.model.heading/8;// 8 was a guess and check arbitrary number. Print out "tosstime" to see how
 		// similar the tosstime is for each movement pattern
 		while (tossTime < time && !hasHit){
 			if(!tossSound.isPlaying) tossSound.Play();
 			tossTime += Time.deltaTime;
 			//model.transform.Rotate(Vector3(0, 0, spinSpeed * Time.deltaTime));
 			//model.transform.RotateAround(model.transform.position, Vector3.forward, spinSpeed * Time.deltaTime);
 			model.transform.position += (heading * tossSpeed * Time.deltaTime);//+moveAdder; // i think move adder isn't needed for these 
 			yield;
 		}
 		
 		hasHit = false;
 		var t:float=0;
 		
 	
 		
 		while (t < recovery){
 			t += Time.deltaTime;
 			yield;
 		}
 		swinging = false;
 		/*model.transform.position = owner.model.transform.position;
		model.transform.parent = owner.model.transform;
		model.transform.localEulerAngles = baseRotation;
 		model.transform.localPosition = basePosition;
 		model.transform.localScale = Vector3.one;
 		*/
 		
 		//model.transform.parent = character.model.transform;
 		//resetPosition();
 		
 	
 	}
 	
 	function clubSwing(angle : int, time : float, recovery : float){
 		swingSound.Play(); // Plays the sound

 		//startSwinging();
 		var t : float = 0;
 		//Swinging motion
 		while (t < time/1.25){
 				t += Time.deltaTime;
 			//model.transform.eulerAngles = baseRotation + Vector3(0, 0, angle*(t/time));
 				model.transform.RotateAround(model.transform.position, Vector3.forward, 1.25*angle/time * Time.deltaTime);
 				 model.transform.RotateAround(model.transform.position, Vector3.right, 1.0*angle/time * Time.deltaTime);

 			
 			yield;
 		}
 		
 		//stopSwinging();
		//startRecovery();
		clubStrike();
		clubSound.Play();
		//Recovery motion
 		while (t < time + recovery){
 			t += Time.deltaTime;
 			model.transform.RotateAround(model.transform.position, Vector3.forward, -angle/recovery * Time.deltaTime);
 			model.transform.RotateAround(model.transform.position, Vector3.right, -1.0*angle/time * Time.deltaTime);

 			yield;
 		}
 		model.transform.localEulerAngles = baseRotation;
 		model.transform.localPosition = basePosition;
 		//stopRecovery();
 	}
 	function attack(range : float, speed : float, home : float, width :float, depth : float, headingOffset : float, color : Color, destructible : boolean, fade : boolean, keyword : String, texture : String){
		var attackObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	
		var attack : HeroAttack = attackObject.AddComponent("HeroAttack") as HeroAttack;						
		attack.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		attack.transform.position = character.model.transform.position + headingOffset * character.model.lookDirection;
		attack.transform.rotation = character.model.transform.rotation;
		attack.name = "HeroAttack";											// Name the object.
		attack.renderer.material.mainTexture = Resources.Load("Textures/" + texture, Texture2D);	// Set the texture.  Must be in Resources folder.
		attack.renderer.material.color = color;												// Set the color (easy way to tint things).
		attack.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
		attack.transform.localScale = Vector3(width,depth,1); 
		attack.init(range, speed, fade);
		attack.hero = character;
		//attack.transform.parent = bulletFolder.transform;
		attackObject.collider.enabled = false;
		attackObject.AddComponent(BoxCollider);
		attackObject.GetComponent(BoxCollider).name = "HeroAttack d:" + destructible + " " + keyword;
		attackObject.GetComponent(BoxCollider).isTrigger = true;
		attackObject.GetComponent(BoxCollider).size = Vector3(.5,.5,10);
		attackObject.AddComponent(Rigidbody);
		attackObject.GetComponent(Rigidbody).isKinematic = false;
		attackObject.GetComponent(Rigidbody).useGravity = false;
		attackObject.GetComponent(Rigidbody).inertiaTensor = Vector3(.1, .1, .1);
		attackObject.GetComponent(Rigidbody).freezeRotation = true;

	}
	
	function attack(range:float, speed:float, width : float, depth : float, color:Color){
		attack(range, speed, 0, width, depth, 0, color, false, false, "", "ball");
	}
	function attack(range:float, speed:float, width:float, depth : float){
		attack(range, speed, 0, width, depth, 0, Color.white, false, false, "", "ball");
	}
	function clubStrike(){
		attack(.2, 1, 0, 2, 2.5, 1, clubAttackColor, false, true, "club", "ball");
	}

 	
 	
 	// h is the heading vector, fromChar is a boolean saying whether this function was called from the character
function tossBoomerang(distance : float, time : float, spinSpeed : float, recovery : float, h:Vector3, fromChar:boolean) : IEnumerator{ // toss function	
 		model.transform.parent = null;
 		var heading : Vector3 = h;
 		Vector3.Normalize(heading);
 		startSwinging();

 		tossSpeed = distance/time;
 		tossTime = 0;
 		//Throw outward
 		var moveAdder : Vector3 = Vector3.zero;
 		if (fromChar) moveAdder = character.model.heading/8;// 8 was a guess and check arbitrary number. Print out "tosstime" to see how
 		// similar the tosstime is for each movement pattern
 		while (tossTime < time && !hasHit){
 			if(!tossSound.isPlaying) tossSound.Play();
 			tossTime += Time.deltaTime;
 			model.transform.RotateAround(model.transform.position, Vector3.forward, spinSpeed * Time.deltaTime);
 			model.transform.position += (heading * tossSpeed * Time.deltaTime)+moveAdder; 
 			yield;
 		}
 		
 		hasHit = false;
 		var t:float=0;
 		//Recover until sword reaches hero
 		while (distanceFromOwner() > .1){
 			t += Time.deltaTime;
 			 if(!tossSound.isPlaying) tossSound.Play();

 			model.transform.RotateAround(model.transform.position, Vector3.forward, spinSpeed * Time.deltaTime);
 			heading = model.transform.position - owner.model.transform.position;
 			model.transform.position -= (heading.normalized * tossSpeed * Time.deltaTime);
 			yield;
 		}
 
 		if (character.model.jumping) {
 			Time.timeScale = .25; // slow motion
			//stopSwinging();
 			tossBoomerang(distance, time,spinSpeed, recovery, -h.normalized, false);
 			yield WaitForSeconds(.5);
 			Time.timeScale = 1;
 			return;
 		}
 
 		model.transform.parent = owner.model.transform;
		model.transform.localEulerAngles = baseRotation;
 		model.transform.localPosition = basePosition;
 		model.transform.position = owner.model.transform.position;
 		model.transform.localScale = Vector3.one;
 		
 		stopSwinging();
 
 		
 		
 		
 	}
 	
// *******************************************
// 			   Key Input
// *******************************************

 	//Looks for key input, executes proper function depending on color.
 	function Update(){
		
 	}
 	
// *******************************************
// 			   Cleanup
// *******************************************

 	//Subroutine called at initialization
	//Constantly places sword at hero. This deals with the issue of the sword moving while the hero runs against an obstacle.
	function resetPosition(){
		while (true){
			if(isMeele || (!swinging && !vibrating && canThrow))
				model.transform.position = owner.model.transform.position;
				
			yield WaitForSeconds(.01);
			//print("Test");
		}
	}
	
	function toBoomerang(){
		spriteRenderer.sprite = UnityEngine.Sprite.Create(Resources.Load("Textures/boomerang", Texture2D), new Rect(40,0,60,100), new Vector2(0.5f, 0), 100f);
 		
	}
	function toHammer(){
		spriteRenderer.sprite = UnityEngine.Sprite.Create(Resources.Load("Textures/club", Texture2D), new Rect(0,0,256,512), new Vector2(0.5f, 0), 400f);
 		model.renderer.material.color = Color(1,1,1);

	}
	function toThrowingStar(){
		spriteRenderer.sprite = UnityEngine.Sprite.Create(Resources.Load("Textures/throwingstar", Texture2D), new Rect(0,0,250,250), new Vector2(0.5f, 0), 200f);
		model.renderer.material.color = Color(1,1,1);

	}
	
	function toStick(){
		spriteRenderer.sprite = UnityEngine.Sprite.Create(Resources.Load("Textures/stick2", Texture2D), new Rect(40,0,60,100), new Vector2(0.5f, 0), 100f);
 	
	}
	
	function vibrateFor(duration:float){
		var timer:float =0;
		vibrating = true;
		while (timer<duration){
			timer+=Time.deltaTime;
			vibrate();
			yield;
		}
		vibrating = false;
		
	}
	
		
	function vibrateIntense(intensity:float){
		model.transform.position = owner.model.transform.position;
		model.transform.Translate(0, Random.Range(-intensity, intensity), 0);
		
	}
	
	function vibrate(){
		vibrateIntense(.2);
	}
	
	function vibrateOnce(){
		vibrating = true;
		vibrateIntense(.2);
		yield;
		vibrating = false;
	
	}
	
	function starActive(){
		canThrow = true;
		swinging = false;
		
		model.transform.position = owner.model.transform.position;
		model.transform.parent = owner.model.transform;
		model.transform.localEulerAngles = baseRotation;
 		model.transform.localPosition = basePosition;
 		model.transform.localScale = Vector3.one;
	}

	
	
	
	
 }