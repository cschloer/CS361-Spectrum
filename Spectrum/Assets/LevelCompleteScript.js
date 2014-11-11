#pragma strict

var startButton : Texture2D;
var exitButton : Texture2D;

function Start () {
	startButton = Resources.Load("Textures/NextLevelButton", Texture2D);
	exitButton = Resources.Load("Textures/ExitButton", Texture2D);
}

function Update () {

}

function OnGUI() {
	GUI.depth = 3;
	if (GUI.Button (Rect((Screen.width/10)*1, (Screen.height/7)*5, Screen.width/2.5, Screen.height/6), startButton)) {
        Application.LoadLevel("Spectrum");
    }
    
    if (GUI.Button (Rect((Screen.width/9)*5, (Screen.height/7)*5, Screen.width/3, Screen.height/6), exitButton)) {
        Application.Quit();
    }
}