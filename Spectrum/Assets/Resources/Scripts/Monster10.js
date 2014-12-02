
// Charlie Charger
public class Monster10 extends Monster {
	
	var timer : float;
	var charging10 : boolean;
	var firing : boolean;
	var startChargingTime : float;
	var timeElapsed : float = 0;
	
	function init(c : Character) {
		super.init(c);
		model.renderer.material.mainTexture = Resources.Load("Textures/Monster4", Texture2D);	// Set the texture.  Must be in Resources folder.
		charging10 = false;
		firing = false;
	}
	
	function act() {
		timer = timer + Time.deltaTime;
		var willItCharge : float = Random.value;
		
		if (!charging10 && willItCharge > .3 && !firing){
			charging10 = true;
			startChargingTime = timer;
			timeElapsed = 0;
		}
		
		if (charging10) {
			timeElapsed = timer - startChargingTime;
			if (timeElapsed >= 3) {
				charging10 = false;
				firing = true;
				model.renderer.material.color = Color(1, 1, 1);
				invincible = false;
			} else {
				model.renderer.material.color = Color(timeElapsed/3, 0, 0);
				invincible = true;
			}	
		}
		
		if (firing) {	
			attack(10, 5, 0, .5, .5, Color(255,137,0), false, true, "", "ball", 0);
			attack(10, 5, 0, .5, .5, Color(255,137,0), false, true, "", "ball",72);
			attack(10, 5, 0, .5, .5, Color(255,137,0), false, true, "", "ball",144);
			attack(10, 5, 0, .5, .5, Color(255,137,0), false, true, "", "ball",216);
			attack(10, 5, 0, .5, .5, Color(255,137,0), false, true, "", "ball",288);
			firing = false;


		}
	}
}