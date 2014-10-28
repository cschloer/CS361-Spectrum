
// Shielded bug - to be taken out by a throw more easily.

public class Monster1 extends Monster {
	var lunging : boolean;
	var metalSound : AudioSource;
	function init(c: Character){
		super.init(c);
		health = 1;
		model.renderer.material.mainTexture = Resources.Load("Textures/Monster1", Texture2D);	// Set the texture.  Must be in Resources folder.
		//Adds the shield. The shield passes collision information to this monster to make it shield when struck.
		var min : Minion = createMinion("TestMinion");
		min.setTexture("shield");
		min.setSize(1.2, 1);
		min.setLocalPosition(Vector3(0, .6, 0));
		lunging = false;
		//Add sound
		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
	}
	//Approaches hero. If it's lined up, it will lunge. 
	function act(){
		if(!lunging){
			turnToHero(.8);
			if(distanceToHero() < 3){
				moveFromHero(1);
				if(angleToHero() < 2 || angleToHero() > 358) lunge(.5, .2, .5, 3, .5, 2);
			}else{
				move(1.5);
			}
		}
	}
	//Rears up and charges at hero, attacking at its finish. 
	function lunge(chargeTime : float, chargeSpeed : float, lungeTime : float, lungeSpeed : float, retreatTime : float, retreatSpeed : float){
		lunging = true;
		while(chargeTime > 0){
			chargeTime -= Time.deltaTime;
			moveFromHero(chargeSpeed);
			yield;
		}
		while(lungeTime > 0){
			lungeTime -= Time.deltaTime;
			move(lungeSpeed);
			yield;
		}
		attack(3, 6, 0, 1, .3, Color.red, false, true, "");
		
		while(retreatTime > 0){
			retreatTime -= Time.deltaTime;
			moveFromHero(retreatSpeed);
			yield;
		}
		lunging = false;
	}

		
	function shield(time : float){
		metalSound.Play();
		invincible = true;
		model.renderer.material.color = Color(2, 2, 2);
		while (time > 0){
			time -= Time.deltaTime;
			yield;
		}
		model.renderer.material.color = Color(1, 1, 1);

		invincible = false;
	}
	
	function minionCollision(minion : Minion, col : Collider){
		if(col.gameObject.name == "WeaponObject" && col.gameObject.GetComponent(WeaponModel).weapon.swinging && !hurting && health > 0){
			shield(1);
		}
	}

}