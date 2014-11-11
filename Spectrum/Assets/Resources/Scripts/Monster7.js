#pragma strict
//Sneaks behind hero and attacks

public class Monster7 extends Monster{
	var driftPeriod : float;
	var driftSpeed : float;
	var buddy : Monster7;
	var buddyAttacking : boolean;
	var spot: Vector3;
	function init(c : Character){
		super.init(c);
		health = 1;	
		moveSpeed = 1;	//Moves faster
		model.renderer.material.mainTexture = Resources.Load("Textures/lightningRobot", Texture2D);	// Set the texture.  Must be in Resources folder.
		//laughSound = gameObject.AddComponent("AudioSource") as AudioSource;
		//laughSound.clip = Resources.Load("Sounds/laugh") as AudioClip;
		driftPeriod = .5 + Random.value;
		driftSpeed = .5 + Random.value;
		buddyAttacking = false;
	}
	//Monster's behaviour
	function act(){
		if(!buddyAttacking){
			 drift(1);
			 if(distanceToHero() > 10){
			 	moveTowardHero(.5);
			 }else{
			 	move(.5);
			 	if(Random.value > .99){
			 		model.transform.eulerAngles.z = -90 + 180*Random.value + heroAngle();
			 	}
			 }
		}
			 	
		if(Random.value > .995 && buddy == null) findBuddy();
		if(Random.value > .99 && !buddyAttacking && buddy != null){
			buddyAttack(1.5, 1.8, .1);
			buddy.buddyAttack(1.5, 1.8, .1);
		}
		
	}
	
	function findBuddy(){
		for(var m : Monster in manager.monsters){
			if(m instanceof Monster7 && m != this && Vector3.Magnitude(model.transform.position - m.model.transform.position) < 8){
				var m7 : Monster7 = m;
				if(m7.buddy == null){
					buddy = m7;
					m7.buddy = this;
					break;
				}
			}
		}
	}
	
	function buddyAngle(){
		var vectorToBuddy : Vector3 = buddy.model.transform.position - model.transform.position;
		var anglesToBuddy : float = Mathf.Atan2(vectorToBuddy.y, vectorToBuddy.x) * Mathf.Rad2Deg - 90;
		var num : float = anglesToBuddy - model.transform.eulerAngles.z;
		return num % 360 + 360;
	}
	
	function buddyAttack(waitDuration : float, attackDuration : float, attackPause : float){
		buddyAttacking = true;
		var t : float = 0;
		model.renderer.material.color = Color(1.3, 1.3, 1.3);
		while(t<waitDuration){
			t += Time.deltaTime;
			drift(2);
			yield;
		}
		model.renderer.material.color = Color(1, 1, 1);
		t=0;
		if(buddy == null || buddy.health == 0 || buddy.hurting){
			buddy = null;
			return;
		}
		model.transform.eulerAngles.z += buddyAngle();
		spot = model.transform.position;
		while(t< attackDuration && buddy != null && buddy.health > 0 && !buddy.hurting && !hurting && health > 0){
			buddyShot();
			t += Time.deltaTime;
			model.transform.position = spot;
			yield WaitForSeconds(attackPause);

		}
		buddyAttacking = false;
		buddy = null;
	}
	
	function buddyShot(){
		if (buddy == null) return;
		attack(Vector3.Magnitude(model.transform.position - buddy.model.transform.position), 15, 0, .3, 1, Color.yellow, false, false, "");
	}
		
		
	
	function drift(factor : float){
		model.transform.position.x += Time.deltaTime * driftSpeed * factor * Mathf.Cos(Time.time*2*Mathf.PI/driftPeriod);
		model.transform.position.y += Time.deltaTime * driftSpeed * factor * Mathf.Sin(Time.time*2*Mathf.PI/driftPeriod);
	}	
				 
	
}