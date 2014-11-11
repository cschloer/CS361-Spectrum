
// Zee pushing monster
public class Monster9 extends Monster {
	
	var rotateTimer : float;
	var currMovement : int;
	
	function init(c : Character) {
		super.init(c);
		model.renderer.material.mainTexture = Resources.Load("Textures/magnetmate_push", Texture2D);	// Set the texture.  Must be in Resources folder.
		
		rotateTimer = 0.0;
	
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
		
		if (distanceToHero() <= 10 && distanceToHero() >= 2) {
			var heroTo : Vector3 = model.transform.position + hero.model.transform.position;
			hero.model.transform.position += heroTo.normalized * Time.deltaTime*freeze*moveSpeed *3;
		}	
	}
}