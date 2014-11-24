
// Zee pushing monster
public class Monster9 extends Monster8 {
	
	var rotateTimer : float;
	var currMovement : int;
	var magnetSound : AudioSource;
	var soundTime : float = 0;
	function init(c : Character) {
		super.init(c);
		model.renderer.material.mainTexture = Resources.Load("Textures/magnetmate_push", Texture2D);	// Set the texture.  Must be in Resources folder.	
	}
	
	function moveHero(){
			var heroTo : Vector3 = model.transform.position - hero.model.transform.position;
			hero.model.transform.position -= heroTo * Time.deltaTime*freeze*moveSpeed;
	}
	
}