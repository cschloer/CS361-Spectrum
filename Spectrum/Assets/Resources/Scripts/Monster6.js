#pragma strict
//Sneaks behind hero and attacks

public class Monster6 extends Monster{
	public var lunging : boolean; //boolean  to track if the monster is currently lunging
	public var lungeTimer : float;	//variable to decide how long the monster should lunge if it doesn't find the hero.
	public var laughSound : AudioSource;
	
	function init(c : Character){
		super.init(c);
		health = 1;	
		moveSpeed = 2;	//Moves faster
		lunging = false;
		lungeTimer = 0;
		model.renderer.material.mainTexture = Resources.Load("Textures/sneaker", Texture2D);	// Set the texture.  Must be in Resources folder.
		laughSound = gameObject.AddComponent("AudioSource") as AudioSource;
		laughSound.clip = Resources.Load("Sounds/laugh") as AudioClip;
	}
	//Monster's behaviour
	function act(){
		var distance : float = distanceToHero();
		if(!lunging){		
			if(heroAngle() > 140 && heroAngle() < 220 && distance < 4.1 && distance > 3.9){
				lunge(.15, .2, .8, 4, .5, .1);
			} else{
				circleBehind();
			}
		}
		
	}
			
	//Rears up and charges at hero, attacking at its finish. 
	function lunge(chargeTime : float, chargeSpeed : float, lungeTime : float, lungeSpeed : float, retreatTime : float, retreatSpeed : float){
		lunging = true;
		laughSound.Play();
		while(chargeTime > 0){
			chargeTime -= Time.deltaTime;
			moveFromHero(chargeSpeed);
			yield;
		}
		attack(6, 8, 0, 1.5, .4, Color.black, false, true, "");

		while(lungeTime > 0){
			lungeTime -= Time.deltaTime;
			move(lungeSpeed);
			yield;
		}
		
		while(retreatTime > 0){
			retreatTime -= Time.deltaTime;
			moveFromHero(retreatSpeed);
			yield;
		}
		flee(1, 1);
		lunging = false;
	}
				 
	//Maintain constant distance and get behind the hero. We can approach faster than we can back away.
	function circleBehind(){	
		if(heroAngle() < 180) moveRight(2);
		if(heroAngle() >= 180) moveLeft(2);
		turnToHero(1.5);
		if(distanceToHero() > 4){
			move();
		} else {
			moveBack(.5);
		}
	}
}