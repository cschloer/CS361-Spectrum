
public class Monster3 extends Monster {
	var dodging : boolean;
	var lastAttack : float;
	var dodgeSound : AudioSource;
	var hasDodgedThisSwing : boolean;
	function init(c : Character) {
		super.init(c);
		health = 1; 
		model.renderer.material.mainTexture = Resources.Load("Textures/Monster3", Texture2D);	
		setSize(.7, .7);
		dodging = false;
		hasDodgedThisSwing = false;
		
		dodgeSound = gameObject.AddComponent("AudioSource") as AudioSource;
		dodgeSound.clip = Resources.Load("Sounds/whistle") as AudioClip;
	}

	function act(){
		turnToHero(4);
		move(3);
		if((hero.weapon.swinging || hero.model.attacking) && !dodging && !hasDodgedThisSwing) dodge(.3, 6);
		if(!dodging && hasDodgedThisSwing && !hero.weapon.swinging) hasDodgedThisSwing = false;
		if(distanceToHero() < 1.5 && lastAttack < 0 && !dodging){
			simpleMelee();
			playSound(hissSound);
			lastAttack = 1;
		}
		lastAttack -= Time.deltaTime;
	}

	function dodge(time : float, speed : float){
		playSound(dodgeSound);
		dodging = true;
		hasDodgedThisSwing = true;
		var leftSpeed : float;
		if(heroAngle() > 180){
		 	leftSpeed = speed;
		 } else{
			leftSpeed = -speed;
		}
		while(time > 0){
			moveLeft(leftSpeed);
			time -= Time.deltaTime;
			yield;
		}
		dodging = false;
	}

}