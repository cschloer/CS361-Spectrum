#pragma strict
public class MonsterBoss extends Monster{
	var weakspot : Minion;
	var showingSpot : boolean;
	var shielding : boolean;
	var metalSound : AudioSource;
	function init(c: Character){
		super.init(c);
		health = 3;
		model.renderer.material.mainTexture = Resources.Load("Textures/bossProto", Texture2D);	// Set the texture.  Must be in Resources folder.
		setSize(2, 2.5);
		
		//Add sound
//		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
//		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
		weakspot = createMinion("weakspot");
		weakspot.setTexture("yellowBlob");
		showingSpot = false;
		shielding = false;
		metalSound = gameObject.AddComponent("AudioSource") as AudioSource;
		metalSound.clip = Resources.Load("Sounds/metalSound") as AudioClip;
		invincible = true;
	}
	
	function act(){
		if (!showingSpot) revealWeakSpot(Vector3.down*.4, 1, 1);
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
		if(col.gameObject.name == "WeaponObject" && col.gameObject.GetComponent(WeaponModel).weapon.swinging && !hurting && health > 0 && !shielding){
			invincible = false;
			hurt();
			invincible = true;
		}
	}
}