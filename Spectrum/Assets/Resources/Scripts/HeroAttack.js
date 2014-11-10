#pragma strict
var range : float;
var speed : float;
var fade : boolean;
var traveled : float;
var home : float;
var hero : Character;
var initialA : float;
function init(r : float, s : float, f : boolean){
	range = r;
	speed = s;
	fade = f;
	traveled = 0;
	initialA = renderer.material.color.a;
}

function Start () {

}

function Update () {
	traveled += Time.deltaTime * Mathf.Abs(speed);
	transform.position += transform.up * Time.deltaTime*speed;
	if(traveled >= range) Destroy(gameObject);
	if(fade) renderer.material.color.a = initialA*(1-(traveled/range));
}
