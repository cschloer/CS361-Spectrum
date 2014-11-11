

// Zee Pulling MagnetMate

public class Monster8 extends Monster {
	
	var rotateTimer : float;
	var currMovement : int;
	var magnetSound : AudioSource;
	var soundTime : float = 0;
	function init(c : Character) {
		super.init(c);
		model.renderer.material.mainTexture = Resources.Load("Textures/magnetmate_pull", Texture2D);	// Set the texture.  Must be in Resources folder.
		magnetSound = gameObject.AddComponent("AudioSource") as AudioSource;
		magnetSound.clip = Resources.Load("Sounds/wum") as AudioClip;
		rotateTimer = 0.0;
		health = 1;
	}
	
	function act() {
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
		
		if (distanceToHero() <= 6 && distanceToHero() >= 2) {
			soundTime += Time.deltaTime;
			var heroTo : Vector3 = model.transform.position - hero.model.transform.position;
			hero.model.transform.position += heroTo.normalized * Time.deltaTime*freeze*moveSpeed *1.5;
		}	
		if(soundTime > .65){
			soundTime = 0;
			magnetSound.Play();
		}
	}
}