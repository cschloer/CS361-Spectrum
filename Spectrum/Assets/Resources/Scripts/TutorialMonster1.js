
// Drops nothing, when killed ends level.
public class TutorialMonster1 extends Monster {
	
	var rotateTimer : float;
	var currMovement : int;
	var type : float;
	function init(c:Character){
		init(c, 0);
	}
	function init(c : Character, t : int) {
		super.init(c);
		model.renderer.material.mainTexture = Resources.Load("Textures/magnetmate_pull", Texture2D);	// Set the texture.  Must be in Resources folder.
		
		rotateTimer = 0.0;
		health = 1;	
		type = t;
	}
	
	function act() {
		rotateTimer = rotateTimer + Time.deltaTime;
		if (rotateTimer > 1) {
			rotateTimer = 0;
	

			if (currMovement == 1) {
				currMovement = 0;
			}else {
				currMovement = 1;
			}
			
		}
		
		if (currMovement == 1){
			moveLeft(2);
		}else{
			moveRight(2);
		}
	}
	
	function die(deathTime: float) {
		//manager.winScreen = true;
		if (type == 1){
			dropColor("yellow", 999);
			 manager.addCake(0.5,34);

		} else if(type == 2){
			dropColor("blue", 999);
			manager.addCake(24,-4);
			manager.displayText = "Tip: Combine to do Combos!";

		}
		var t : float = 0;

		while (t < deathTime){
			t += Time.deltaTime;
			model.renderer.material.color.a = 1-(t/deathTime);
			yield;
		}
		Destroy(this.gameObject);

	}
	
	
}