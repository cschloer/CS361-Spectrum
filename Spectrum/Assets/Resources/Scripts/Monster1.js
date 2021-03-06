
// Shielded bug - to be taken out by a throw more easily.

public class Monster1 extends Monster {
	var lunging : boolean;
	var metalSound : AudioSource;
	var shootSound : AudioSource;
	function init(c: Character){
		super.init(c);
		health = 1;
		model.renderer.material.mainTexture = Resources.Load("Textures/Monster1", Texture2D);	// Set the texture.  Must be in Resources folder.
		//Adds the shield. The shield passes collision information to this monster to make it shield when struck.
		var min : Minion = createMinion("TestMinion");
		min.setTexture("shield");
		min.setSize(1.2, 1);
		min.setLocalPosition(Vector3(0, .6, 0));
		//min.modelObject.GetComponent(BoxCollider).isTrigger = false;
		lunging = false;
		//Add sound
		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
		metalSound.playOnAwake = false;
		shootSound = gameObject.AddComponent("AudioSource") as AudioSource;
		shootSound.clip = Resources.Load("Sounds/wew") as AudioClip;
		color = "red";
	}
	//Approaches hero. If it's lined up, it will lunge. 
	function act(){
		if(!lunging){
			turnToHero(.8);
			if(distanceToHero() < 5){
				moveFromHero(1);
				if(angleToHero() < 2 || angleToHero() > 358) lunge(.2, .4, .6, 5, .3, 2);
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
		attack(6, lungeSpeed*1.5, 0, 1, .3, Color.red, false, true, "");
		while(lungeTime > 0){
			lungeTime -= Time.deltaTime;
			move(lungeSpeed);
			yield;
		}
		
		playSound(shootSound);
		while(retreatTime > 0){
			retreatTime -= Time.deltaTime;
			moveFromHero(retreatSpeed);
			yield;
		}
		lunging = false;
	}

		
	function shield(time : float){
		playSound(metalSound);
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
		if(col.gameObject.name.Contains("WeaponObject") && col.gameObject.transform.parent.GetComponent(WeaponModel).weapon.swinging && !hurting && health > 0){
			shield(1);
			col.gameObject.transform.parent.gameObject.GetComponent(WeaponModel).hasHit();
			
		}
	}

}