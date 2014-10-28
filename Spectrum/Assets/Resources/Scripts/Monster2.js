// Distancer Blue
public class Monster2 extends Monster {

	public var timing : float;
	public var chargin : boolean;
	public var attacked : boolean;
	public var chargeSound : AudioSource; //Need one of these for each different clip.



	// Changing Init function to vary appearance and hitboxes.
	public function init(c : Character) {
	
		super.init(c);
		health = 3;
		hurtRecovery = .7;
		moveSpeed = .75;
		turnSpeed = 60;
		timing = 0;
		chargin = false;
		attacked = false;
			
		setSize(1.5, 1.5);					// Make him a big'un.
		model.renderer.material.mainTexture = Resources.Load("Textures/Monster2", Texture2D);	// Set the texture.  Must be in Resources folder.
 		

 		chargeSound = gameObject.AddComponent("AudioSource") as AudioSource; //Initialized AudioSource
		chargeSound.clip = Resources.Load("Sounds/snort"); //Loads proper clip. In Unity Editor make sure "3D Sound" is UNCHECKED. It's checked by default. MP3s seem to work well and Audacity can export them.

	}
	
	
	
	function act(){
		model.transform.position.z = 0;
		super.turnToHero();
		if( chargin ){
			charge();
		} else if ( super.distanceToHero() > 3) {
			move(moveSpeed);
			timing = Time.time;
		} else {
			chargin = true;
			turnSpeed = 120;
		}
		
		if(distanceToHero() < 1.5) simpleMelee();
	}
	
	function charge(){
		if(Time.time - timing > 2.5){
			chargin = false;
			attacked = false;
			turnSpeed = 60;
			timing = Time.time;
		} else if(Time.time - timing > 1.25){
			move(4.5);
		}
		if( super.distanceToHero() < 1 && !attacked){
			super.simpleMelee();
			chargeSound.Play();
			attacked = true;
		}
	}
	
}