var colliderSize:float;
var destroying:boolean;
public class Monster12 extends Monster {

	function init(c : Character) {
		super.init(c);
		health = 1; 
		model.renderer.material.mainTexture = Resources.Load("Textures/bossProto", Texture2D);	
		setSize(.7, .7);
		colliderSize = .5;
		destroying = false;
		heartOffset = model.gameObject.GetComponent(BoxCollider).size.y;
	//	addHearts();
	
	}

	function act(){
		if (destroying) return;
		if (distanceToHero() < 1.25) {
			explodeMe();
		}
		else if (distanceToHero() > 5) {
				if(angleToHero() > 8 && angleToHero() < 352) 	turnToHero(4);
				else if (angleToHero() > 2 && angleToHero() < 358) turnToHero(1);
				move(8);
			}
		else {
			turnToHero(3);
			moveTowardHero(6);
		}	
	}

	function explodeMe(){
		if (destroying) return;
		super.model.renderer.enabled = false;
		//super.modelObject.GetComponent(BoxCollider).size = Vector3(colliderSize*2,colliderSize*2,2); // Collider gets bigger in explosion
		destroying = true;
		var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the mine texture.
		var mineScript:SpellMine = modelObject2.AddComponent("SpellMine");		// Add the mine.js script to the object.
																																								// We can now refer to the object via this script.
		mineScript.transform.parent = super.model.transform.parent;	// Set the mine's parent object to be the mine folder.							
		mineScript.init(Vector3(model.transform.position.x, model.transform.position.y, model.transform.position.y), modelObject2, 0, super.manager.character.model);	
		mineScript.ice = false;
		mineScript.isBig = true;
	
		while (mineScript != null) yield;
		
		Destroy(super.gameObject);
	}

}
