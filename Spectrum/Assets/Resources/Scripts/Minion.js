#pragma strict
//A utility class for broadening monster functionality. A monster can have a number of minions which can pass their collision 
//information to the master. Minions could serve as smaller enemies, boss components, collision detectors, etc.

//By default they have colliders, are invincible, and are transform-parented to their master. Change these when creating minions in your monster.

public class Minion extends Monster{
	var master : Monster;
	var relativePosition : Vector3;
	public function init(m:Monster){
		super.init(m.hero);
		master = m;
		invincible = true;
		health = 1;
		modelObject.GetComponent(BoxCollider).isTrigger = true;
		model.transform.parent = master.model.transform;
		model.transform.position = master.model.transform.position;
		
	}
	
	public function setTexture(t : String){
		model.renderer.material.mainTexture = Resources.Load("Textures/" + t, Texture2D);
	}
	
	public function passCollision(col: Collider){
		//print("Passing collision to master");
		master.minionCollision(this, col);
	}
	
	public function setLocalPosition(pos : Vector3){
		relativePosition = pos;
	}
	//Since Master collides and Minion by default does not, we need to place the minion at its artificial local position to prevent it from running away when its master collides.
	//Override Act to change this behavior.
	public function act(){
		model.transform.localPosition = relativePosition;
		//Does nothing
	}
	
}