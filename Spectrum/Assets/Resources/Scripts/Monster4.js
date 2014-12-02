// Retreating Vomiter
public class Monster4 extends Monster {

	public var recovery : boolean;

	// Changing Init function to vary appearance and hitboxes. I'm changing this shit.
	public function init(c : Character) {
	
		super.init(c);
		health = 2;
		hurtRecovery = .2;
		moveSpeed = 1.5;
		model.transform.localScale = Vector3(.5,.5,.5);						// Make it small.
		model.renderer.material.mainTexture = Resources.Load("Textures/Monster4", Texture2D);	// Set the texture.  Must be in Resources folder.
 		modelObject.GetComponent(BoxCollider).size = Vector3(.4,.4,10);

 		
	}
	// This is a random comment.
	
	function Update(){
		if(health > 0){
			act();
		}else if (health > -100){
			super.die(1);
			health -= 101;
		}		
	}
	
	function act(){
		model.transform.position.z = 0;
		super.turnToHero();
		super.moveLeft();
		if(super.distanceToHero() < 1){ 
			flee(moveSpeed,1);
		}
		if(super.hero.weapon.swinging && super.distanceToHero() < 2){
			moveRight(3);
		}
		// Randomly spit with a low chance
		if(Random.value > 0.992){
			spit();
		}
	}
	
	function spit(){
		var attackObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	
		var attack : MonsterAttack = attackObject.AddComponent("MonsterAttack");
		attack.transform.parent = this.transform.parent;						
		attack.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		attack.transform.position = model.transform.position;
		attack.transform.rotation = model.transform.rotation;
		attack.name = "Monster Attack";											// Name the object.
		attack.renderer.material.mainTexture = Resources.Load("Textures/bullet2", Texture2D);	// Set the texture.  Must be in Resources folder.
		attack.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
		attack.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
		attack.transform.localScale = Vector3(.5,.5,1); 
		attack.init(10, 0.65, true, 4, true);
		attack.hero = hero;

		attackObject.collider.enabled = false;
		attackObject.AddComponent(BoxCollider);
		attackObject.GetComponent(BoxCollider).name = "spit attack";
		attackObject.GetComponent(BoxCollider).isTrigger = true;
		attackObject.GetComponent(BoxCollider).size = Vector3(.4,.4,10);
		attackObject.AddComponent(Rigidbody);
		attackObject.GetComponent(Rigidbody).isKinematic = false;
		attackObject.GetComponent(Rigidbody).useGravity = false;
		attackObject.GetComponent(Rigidbody).inertiaTensor = Vector3(1, 1, 1);
		attackObject.GetComponent(Rigidbody).freezeRotation = true;
	}

}