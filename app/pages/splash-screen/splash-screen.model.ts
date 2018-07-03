import { Observable } from "data/observable";
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance } from "nativescript-geolocation";
import { Utils } from "../../shared/tools";
var app = require("application");
export class SplashScreenModel extends Observable{
    private progressValue : number;
    private progressMaxValue: number;
    constructor(){
        super();
        this.progressValue = 0;
        this.progressMaxValue = 2000; 
    }
}