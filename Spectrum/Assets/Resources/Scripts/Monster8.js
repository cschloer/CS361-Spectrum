

// Zee Pulling MagnetMate

public class Monster8 extends Monster {
	
	var rotateTimer : float;
	var currMovement : int;
	var magnetSound : AudioSource;
	var soundTime : float = 0;
	var magnetTimer : float = 0;
	function init(c : Character) {
		super.init(c);
		model.renderer.material.mainTexture = Resources.Load("Textures/magnetmate_pull", Texture2D);	// Set the texture.  Must be in Resources folder.
		magnetSound = gameObject.AddComponent("AudioSource") as AudioSource;
		magnetSound.clip = Resources.Load("Sounds/wum") as AudioClip;
		rotateTimer = 0.0;
		health = 1;
	}
	
	function act() {
		if(magnetTimer <= 0){
			moveRandomly();
			if (distanceToHero() <= 6 && distanceToHero() >= 2 && Random.value > .95) {
				magnetTimer = .7;
				playSound(magnetSound);
				attack(2, 2, 0, 1, 1, Color.white, false, false, "", "sparkWaves", angleToHero(), false);

			}
		} else{
			magnetTimer -= Time.deltaTime;
			
			moveHero();	
			
		}
		
	}
	
	function moveHero(){
			var heroTo : Vector3 = model.transform.position - hero.model.transform.position;
			hero.model.transform.position += heroTo * Time.deltaTime*freeze*moveSpeed;
			
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
}