#pragma strict
//Sneaks behind hero and attacks

public class Monster6 extends Monster{
	public var lunging : boolean; //boolean  to track if the monster is currently lunging
	public var lungeTimer : float;	//variable to decide how long the monster should lunge if it doesn't find the hero.
	
	function init(c : Character){
		super.init(c);
		health = 2;	
		moveSpeed = 2;	//Moves faster
		lunging = false;
		lungeTimer = 0;
		model.renderer.material.mainTexture = Resources.Load("Textures/sneaker", Texture2D);	// Set the texture.  Must be in Resources folder.

	}
	//Monster's behaviour
	function act(){
		var distance : float = distanceToHero();
		
		//If we're at the proper distance and behind the hero, lunge!
		if(heroAngle() > 160 && heroAngle() < 200 && distance < 4.1 && distance > 3.9 && Random.value > .97){
			lunging = true;
		}
		//If we're lunging, head forward and increment lungeTimer. 
		if(lunging){
			move(2);
			lungeTimer += Time.deltaTime;
		} else {		// If we're not, get behind the hero.
			circleBehind();
		}
		//If we hit the hero, or have lunged for long enough, attack in front of us and stop lunging.
		if((distance < 1 && lunging) || lungeTimer > 2){
			simpleMelee();
			lunging = false;
			lungeTimer = 0;
		}
	}
			
		
				 
	//Maintain constant distance and get behind the hero. We can approach faster than we can back away.
	function circleBehind(){	
		if(heroAngle() < 180) moveRight();
		if(heroAngle() >= 180) moveLeft();
		turnToHero(1.5);
		if(distanceToHero() > 4){
			move();
		} else {
			moveBack(.5);
		}
	}
}