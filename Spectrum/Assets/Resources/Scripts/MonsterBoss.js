#pragma strict
public class MonsterBoss extends Monster{
	var weakspot : Minion;
	var showingSpot : boolean;
	var shielding : boolean;
	var metalSound : AudioSource;
	var chargeSound : AudioSource;
	var squirtSound : AudioSource;
	var lunging : boolean;
	function init(c: Character){
		super.init(c);
		health = 3;
		model.renderer.material.mainTexture = Resources.Load("Textures/bossProto", Texture2D);	// Set the texture.  Must be in Resources folder.
		setSize(2, 2.5);
		activateDistance = 2;
		//Add sound
//		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
//		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
		weakspot = createMinion("weakspot");
		weakspot.setTexture("yellowBlob");
		showingSpot = false;
		shielding = false;
		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
		chargeSound = gameObject.AddComponent("AudioSource") as AudioSource;
		chargeSound.clip = Resources.Load("Sounds/bigHiss") as AudioClip;
		squirtSound = gameObject.AddComponent("AudioSource") as AudioSource;
		squirtSound.clip = Resources.Load("Sounds/squirt") as AudioClip;
		invincible = true;
	}
	
	//Approaches hero. If it's lined up, it will lunge. 
	function act(){
		if(!lunging){
			turnToHero(.8);
			if(distanceToHero() < 4){
				moveFromHero(1.5);
				if(angleToHero() < 2 || angleToHero() > 358) lunge(.5, .3, .8, 6, .5, .3);
			}else{
				move(2);
			}
		}
	}
	//Rears up and charges at hero, attacking at its finish. 
	function lunge(chargeTime : float, chargeSpeed : float, lungeTime : float, lungeSpeed : float, retreatTime : float, retreatSpeed : float){
		lunging = true;
		revealWeakSpot(Vector3.down * .5, .5, 1);
		while(chargeTime > 0){
			chargeTime -= Time.deltaTime;
			moveFromHero(chargeSpeed);
			yield;
		}
		attack(5, 8, 0, 1.5, .5, Color.green, false, true, "");
		chargeSound.Play();
		while(lungeTime > 0){
			lungeTime -= Time.deltaTime;
			move(lungeSpeed);
			yield;
		}
		if(Random.value < .4){
			while(retreatTime > 0){
				retreatTime -= Time.deltaTime;
				model.renderer.material.color = Color((1+retreatTime)/2, 2-retreatTime, (1+retreatTime)/2);
				moveFromHero(retreatSpeed);

				yield;
			}
			model.renderer.material.color = Color(1, 1, 1);
			attack(3, -4, 0, 1.8, 2, Color.green, false, true, "");
			squirtSound.Play();
		}else{
			while(retreatTime > 0){
				retreatTime -= Time.deltaTime;
				moveFromHero(retreatSpeed);
				yield;
			}
		
		
		}
		lunging = false;

		
	}
	
	function revealWeakSpot(dir : Vector3, travelTime : float, waitTime : float){
		showingSpot = true;
		var tempTime : float = 0;
		
		while(tempTime < travelTime){
			tempTime += Time.deltaTime;
			weakspot.setLocalPosition((tempTime/travelTime) * dir);
			yield;
		}
		tempTime = waitTime;
		while(tempTime > 0){
			tempTime -= Time.deltaTime;
			weakspot.setLocalPosition(dir);
			yield;
		}
		tempTime = travelTime;
		while(tempTime > 0){
			tempTime -= Time.deltaTime;
			weakspot.setLocalPosition((tempTime/travelTime) * dir);
			yield;
		}
		showingSpot = false;
	}
	public function hurt(){
		if(!invincible && !shielding){
			hurtSound.Play();
			flee(2, hurtRecovery); 
			health--;
			hurting = true;
			model.renderer.material.color = Color(.5,.5,.5);

			var t : float = hurtRecovery;
			while (t > 0 && health > 0){
				t -= Time.deltaTime;
				yield;
			}
			hurting = false;
			model.renderer.material.color = Color(1,1,1);
		}
		else{
			shield(.8);
		}
			
	}
	function shield(time : float){
		metalSound.Play();
		shielding = true;
		model.renderer.material.color = Color(2, 2, 2);
		while (time > 0){
			time -= Time.deltaTime;
			yield;
		}
		model.renderer.material.color = Color(1, 1, 1);

		shielding = false;
	}
	function minionCollision(minion : Minion, col : Collider){
		if(col.gameObject.name.Contains("WeaponObject") && col.gameObject.GetComponent(WeaponModel).weapon.swinging && !hurting && health > 0 && !shielding){
			invincible = false;
			hurt();
			invincible = true;
		}
	}
}