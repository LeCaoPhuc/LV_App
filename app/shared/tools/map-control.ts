import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";
import { Observable } from "data/observable";
var mapsModule = require("nativescript-google-maps-sdk");
var application = require("application");
var Color = require("color").Color;
var http = require("http");
const decodePolyline = require('decode-google-map-polyline');
export function setCameraPosition(self,latitude,longitude)
{
    self.set("latitude", latitude);
    self.set("longitude", longitude);
    self.set("zoom", 18);
    self.set("bearing", 0);
    self.set("tilt", 1);
    self.set("padding", [0, 0, 0, 0]);

}
export function loadMapReady(mapView)
{
    mapView.myLocationEnabled = true;
    mapView.settings.myLocationButtonEnabled = true;
   
}

export function drawMarker( arrPoints,mapView) {
    for (var i = 0; i < arrPoints.length; i++) {
        var marker = new mapsModule.Marker();
        marker.position = mapsModule.Position.positionFromLatLng(arrPoints[i].lat,arrPoints[i].lng); //set toa do
        marker.title = arrPoints[i].title ? arrPoints[i].title : 'Title' ;//set title
        marker.snippet = arrPoints[i].snippet ? arrPoints[i].snippet : 'Marker here'; //set goi y
        marker.userData = { index: i };
        mapView.addMarker(marker);
    }
}

// export function drawPolygon(arrPoints,mapView,zIndex)
// {
//     for(var  j = 0 ; j < arrPoints.length-1; j++)
//     {
//         var polygon = new mapsModule.Polygon();
//         var polygon1 = new mapsModule.Polygon();
//         polygon.addPoints([
//             mapsModule.Position.positionFromLatLng(arrPoints[j].lat, arrPoints[j].lng),
//                 mapsModule.Position.positionFromLatLng(arrPoints[j+1].lat, arrPoints[j+1].lng)
//         ]);      
//         polygon1.addPoints([
//             mapsModule.Position.positionFromLatLng(arrPoints[j].lat, arrPoints[j].lng),
//             mapsModule.Position.positionFromLatLng(arrPoints[j+1].lat, arrPoints[j+1].lng)
//         ]);            
//     polygon.visible = true;
//     polygon.strokeColor = new Color('#4d4dff');
//     polygon.shape = "Circle";
//     polygon.zIndex = j+1;
//     polygon.strokeWidth = 20;
//     mapView.addPolygon(polygon);    

//     polygon1.visible = true;
//     // polygon1.fillColor = new Color('#ff0000');
//     polygon1.strokeColor = new Color('#ff0000');
//     polygon1.shape = "Circle";
//     polygon.zIndex = j;
//     polygon1.strokeWidth = 30;
//     mapView.addPolygon(polygon1);     
//     }   
// }
// export function drawLine(arrPoints,mapView,zIndex) {
//     var polyline = new mapsModule.Polyline();
//     var polyline1 = new mapsModule.Polyline();
//     for (var j = 0; j < arrPoints.length; j++) // chi chay toi 55 sau do +1 o lan cuoi cung la den vi tri 56
//     {

//         polyline.addPoint(
//             mapsModule.Position.positionFromLatLng(arrPoints[j].lat, arrPoints[j].lng) // duong gach noi den vi tri point
//         );

//         polyline1.addPoint(
//             mapsModule.Position.positionFromLatLng(arrPoints[j].lat, arrPoints[j].lng) // duong gach noi den vi tri point
//         );
//     }

//     polyline.visible = true;
//     polyline.jointtype = 2;
//     polyline.zIndex = zIndex;
//     polyline.width = 20;
//     polyline.color = new Color('#668cff');
//     polyline.geodesic = true;
//     mapView.addPolyline(polyline);

//     polyline1.visible = true;
//     polyline1.jointtype = 2;
//     polyline1.zIndex = zIndex-1;
//     polyline1.width = 30;
//     polyline1.color = new Color('#0039e6');
//     polyline1.geodesic = true;
//     mapView.addPolyline(polyline1);
// }
export function selectMarkerDirection(args, originAddress, destinationAddress) {
    var self = this;
    getCurrentLocation({}).
        then(function (loc) {
            if(loc) {
                var mapView = args.object;
                // noi di la diem hien tai current_location
                /* ---------*/
                // noi den dang toa độ
                var destination = {
                    latitude: args.marker.position.latitude,
                    longitude: args.marker.position.longitude
                }
                // nơi đến dạng address
                originAddress = originAddress.replace(/ /g, "+");
                destinationAddress = destinationAddress.replace(/ /g, "+"); //thay dau " " bang dau +
                var APIkey = "AIzaSyCczZw6SVati1GE6i7UV3IZ7TJVJ5BuDho";
                var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + originAddress + "&destination=" + destinationAddress + "&mode=driving&key=AIzaSyCczZw6SVati1GE6i7UV3IZ7TJVJ5BuDho";
                console.log(url);
                http.getJSON(url).then(function (r) {
                    for (var i = 0; i < r.routes.length; i++)  //r.routes
                    {
                        var encodePoints = r.routes[i].overview_polyline.points;
                        var decodePoints = decodePolyline(encodePoints);
                        // drawLine(decodePoints,mapView,2);
                        // self.drawMarker(decodePoints,mapView);
                    }
                }, function (e) {
                    console.log(e);
                });
            }
        }, function (e) {
            console.log("Errorssdsd: " + e.message);
        });
}
export function selectMarker(args,originAdress, destinationAdress) {

    // Vẽ line nếu cần
        // var self = this;
        // getCurrentLocation({}).
        //     then(function (loc) {
        //         if (loc) {
        //             self.current_location = loc;
        //             console.log("before i am here : ", self.current_location.latitude);
        //             var mapView = args.object;
        //             // noi di la diem hien tai current_location
        //             /* ---------*/
        //             // noi den dang toa độ
        //             var destination = {
        //                 latitude: args.marker.position.latitude,
        //                 longitude: args.marker.position.longitude
        //             }
        //             // nơi đến dạng address
        //             originAdress = originAdress.replace(/ /g,"+");
        //             destinationAdress = destinationAdress.replace(/ /g, "+"); //thay dau " " bang dau +

        //             var APIkey = "AIzaSyCczZw6SVati1GE6i7UV3IZ7TJVJ5BuDho";

        //             var url = "https://maps.googleapis.com/maps/api/directions/json?origin="+originAdress+"&destination="+destinationAdress+"&mode=driving&key=AIzaSyCczZw6SVati1GE6i7UV3IZ7TJVJ5BuDho";
        //             console.log(url);
        //             http.getJSON(url).then(function (r) {
        //                 for (var i = 0; i < r.routes.length; i++)  //r.routes
        //                 {
        //                     var encodePoints = r.routes[i].overview_polyline.points;
        //                     var decodePoints = decodePolyline(encodePoints);
        //                     drawLine(decodePoints,mapView,2);
        //                     // self.drawMarker(decodePoints,mapView);
        //                 }
        //             }, function (e) {
        //                 //// Argument (e) is Error!
        //                 console.log(e);
        //             });
        //         }
        //     }, function (e) {
        //         console.log("Errorssdsd: " + e.message);
        //     })
    }
