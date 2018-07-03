import * as platformModule from "tns-core-modules/platform";
import { Utils, typeOfListProduct, ManagementCategoryMap } from "../../shared/tools";
var utils = require("tns-core-modules/utils/utils");
import { Image } from "ui/image";
var app = require("application");
var enums = require("ui/enums");
var imageSource = require("image-source");
import * as LabelModule from "tns-core-modules/ui/label";
import {ImageCacheIt} from 'nativescript-image-cache-it';
var StackLayout = require("ui/layouts/stack-layout").StackLayout;
import { PercentLength } from "ui/styling/style-properties"
export const sliderOfView = {
    PAGE : 1,
    MODAL: 2
}
const limitSliderX = 50;
const limitSliderY = 40;
const limitGestureProductItemX = 70;
const limitGestureProductItemY = 10;
const maxDeltaX = 55;
const maxDeltaY = 30;
const limitDegree = 60;
const animateDurationTime = 250;
export class SliderControl{
    // page
    private static sliderLeft;
    public static sliderCenter;
    private static sliderRight;
    private static isTranslating = false;
    private static isSliding = false;
    // modal
    private static sliderLeftModal;
    public static sliderCenterModal;
    private static sliderRightModal;
    private static isTranslatingModal = false;
    private static isSlidingModal = false;

    private static screenWidth = platformModule.screen.mainScreen.widthDIPs;
    private static screenHeight = platformModule.screen.mainScreen.heightDIPs;
    public static resetLayout(firstLayout,secondLayout,thirdLayout,typeOfView){
        var self =this;
         switch (typeOfView) {
            case 1 :
                this.sliderLeft = firstLayout;
                this.sliderCenter = secondLayout;
                this.sliderRight = thirdLayout;
                this.sliderLeft.translateX = 0;
                this.sliderLeft.translateY = 0;
                this.sliderCenter.translateX = 0;
                this.sliderCenter.translateY = 0;
                this.sliderRight.translateX = 0;
                this.sliderRight.translateY = 0;

            break;
            case 2:
                this.sliderLeftModal = firstLayout;
                this.sliderCenterModal = firstLayout;
                this.sliderRightModal = firstLayout;
                this.sliderLeftModal.translateX = 0;
                this.sliderLeftModal.translateY = 0;
                this.sliderCenterModal.translateX = 0;
                this.sliderCenterModal.translateY = 0;
                this.sliderRightModal.translateX = 0;
                this.sliderRightModal.translateY = 0;
            break;
            default:

            break;
        }
    }
    public static setFirstSliderPosition(firstLayout,typeOfView) {
        var self = this;
        switch (typeOfView) {
            case 1 :
                this.sliderLeft = firstLayout;
                this.sliderLeft.translateX = self.sliderLeft.translateX - self.screenWidth;
                this.sliderLeft.translateY = self.sliderLeft.translateY;
            break;
            case 2:
                this.sliderLeftModal = firstLayout;
                this.sliderLeftModal.translateX = self.sliderLeftModal.translateX - self.screenWidth;
                this.sliderLeftModal.translateY = self.sliderLeftModal.translateY;
            break;
            default:

            break;
        }

    }
    public static setSecondtSliderPosition(secondLayout,typeOfView) {
         switch (typeOfView) {
            case 1 :
                this.sliderCenter = secondLayout;
            break;
            case 2:
                this.sliderCenterModal = secondLayout;
            break;
            default:
            break;
        }

    }

    public static setThirdSliderPosition(secondLayout,typeOfView) {
        var self = this;
        switch (typeOfView) {
            case 1 :
                this.sliderRight = secondLayout;
                this.sliderRight.translateX = self.sliderRight.translateX + self.screenWidth;
                this.sliderRight.translateY = self.sliderRight.translateY;
            break;
            case 2:
                this.sliderRightModal = secondLayout;
                this.sliderRightModal.translateX = self.sliderRightModal.translateX + self.screenWidth;
                this.sliderRightModal.translateY = self.sliderRightModal.translateY;
            break;
            default:

            break;
        }
    }
    public static onPanSlider(args,currentPage,lastPage, typeOfPage ,callback) {
        if(!Utils.checkInternetConnection()){
            return;
        }
        var self = this;
        if(!Utils.checkInternetConnection()) {
            return;
        }
        if (args.state == 1) {
        }
        else if (args.state == 2) {
            var degree = self.calculateDegree( args.deltaX, args.deltaY);
            if ( args.deltaX > limitSliderX && degree.degreeOfUpperAngle <= 30) {
                 console.log("-------------Can currentPage--------------"+ args.deltaX);
                if(self.isSliding) {
                    return;
                }
                self.isSliding = true;
                if (self.isTranslating) {
                    return;
                } 
                var managementCategory = ManagementCategoryMap;
                if((currentPage-1 <= 0 && typeOfPage != typeOfListProduct.CATEGORY_LIST) || 
                    (currentPage-1 <= 0 && typeOfPage == typeOfListProduct.CATEGORY_LIST  && managementCategory.current().first)) {
                    Utils.hideLoadingIndicator();
                    return;
                }
                self.isTranslating = true;
                var left = self.sliderLeft;
                var center = self.sliderCenter;
                var right = self.sliderRight;
                //
                right.translateX = left.translateX;
                right.translateY = left.translateY;
                //
                left.animate({
                    translate: {
                        x: left.translateX + self.screenWidth,
                        y: left.translateY
                    },
                    duration: animateDurationTime,
                    curve: enums.AnimationCurve.easeIn
                });
                //
                center.animate({
                    translate: {
                        x: center.translateX + self.screenWidth,
                        y: center.translateY
                    },
                    duration: animateDurationTime,
                    curve: enums.AnimationCurve.easeIn
                })
                .then(function () {
                    var temp ;
                    self.sliderLeft = right;
                    self.sliderRight = center;
                    self.sliderCenter = left;
                    self.isTranslating = false;
                    callback(self.sliderCenter.id,args.deltaX);
                });
                
            }
            else if (args.deltaX < -limitSliderX && degree.degreeOfUpperAngle <= 30) {
                console.log("/n /n /n -------------Can currentPage-------------- " + args.deltaX);
                if(self.isSliding) {
                    return;
                }
                self.isSliding = true;
                if (self.isTranslating) {
                    return;
                }
                var managementCategory = ManagementCategoryMap;
                if((lastPage && typeOfPage != typeOfListProduct.CATEGORY_LIST) || 
                    (lastPage && (typeOfPage == typeOfListProduct.CATEGORY_LIST) && managementCategory.current().last && currentPage == managementCategory.current().totalPage  )){
                    Utils.hideLoadingIndicator();
                    return;
                }
                self.isTranslating = true;
                var left = self.sliderLeft;
                var center = self.sliderCenter;
                var right = self.sliderRight;
                //
                left.translateX = right.translateX;
                left.translateY = right.translateY;
                //
                right.animate({
                    translate: {
                        x: right.translateX - self.screenWidth,
                        y: right.translateY
                    },
                    duration: animateDurationTime,
                    curve: enums.AnimationCurve.easeIn
                });
                //
                center.animate({
                    translate: {
                        x: center.translateX - self.screenWidth,
                        y: center.translateY
                    },
                    duration: animateDurationTime,
                    curve: enums.AnimationCurve.easeIn
                })
                .then(function () {
                    self.sliderRight = left;
                    self.sliderLeft = center;
                    self.sliderCenter = right;
                    self.isTranslating = false;
                    callback(self.sliderCenter.id,args.deltaX);
                });
             
            }
            else{
                if(!degree){

                }
                console.log("----------Can't run onPanSlider -------");
                console.log("degree : " + degree.degreeOfUpperAngle);
                console.log("========== deltaX ====== " + args.deltaX);
                console.log("========== deltaY====== " + args.deltaY);
                Utils.hideLoadingIndicator();
            }
        }
        else if (args.state == 3) {
            self.isSliding = false;
        }
    }



    public static onPanSliderOnModal(args,currentPage,lastPage,callback) {
        if(!Utils.checkInternetConnection()){
            return;
        }
        var self = this;
        if(!Utils.checkInternetConnection()) {
            return;
        }
        if (args.state == 1) {
        }
        else if (args.state == 2) {
            if (args.deltaX > 0) {
                if (self.isTranslatingModal) {
                    Utils.hideLoadingIndicator();
                    return;
                }
                
                if(currentPage <= 0) {
                    Utils.hideLoadingIndicator();
                    return;
                }
                self.isTranslatingModal = true;
                var left = self.sliderLeftModal;
                var center = self.sliderCenterModal;
                var right = self.sliderRightModal;
                //
                right.translateX = left.translateX;
                right.translateY = left.translateY;
                //
                left.animate({
                    translate: {
                        x: left.translateX + self.screenWidth,
                        y: left.translateY
                    },
                    duration: animateDurationTime,
                    curve: enums.AnimationCurve.easeIn
                });
                //
                center.animate({
                    translate: {
                        x: center.translateX + self.screenWidth,
                        y: center.translateY
                    },
                    duration: animateDurationTime,
                    curve: enums.AnimationCurve.easeIn
                })
                    .then(function () {
                        self.sliderLeftModal = right;
                        self.sliderRightModal = center;
                        self.sliderCenterModal = left;
                        self.isTranslatingModal = false;
                         callback(self.sliderCenterModal.id,args.deltaX);
                    });
            }
            else if (args.deltaX < 0) {
                if (self.isTranslatingModal) {
                     Utils.hideLoadingIndicator();
                    return;
                }
                 if(lastPage){
                     Utils.hideLoadingIndicator();
                    return;
                }
                self.isTranslatingModal = true;
                var left = self.sliderLeftModal;
                var center = self.sliderCenterModal;
                var right = self.sliderRightModal;
                //
                left.translateX = right.translateX;
                left.translateY = right.translateY;
                //
                right.animate({
                    translate: {
                        x: right.translateX - self.screenWidth,
                        y: right.translateY
                    },
                    duration: animateDurationTime,
                    curve: enums.AnimationCurve.easeIn
                });
                //
                center.animate({
                    translate: {
                        x: center.translateX - self.screenWidth,
                        y: center.translateY
                    },
                    duration: animateDurationTime,
                    curve: enums.AnimationCurve.easeIn
                })
                .then(function () {
                    self.sliderRightModal = left;
                    self.sliderLeftModal = center;
                    self.sliderCenterModal = right;
                    self.isTranslatingModal = false;
                    callback(self.sliderCenterModal.id,args.deltaX);
                });
            }
        }
        else if (args.state == 3) {
        }
    }
    public static onPanProductImage(args,callback){
         var photo = args.object.getChildAt(0).getChildAt(0).getChildAt(0);
         
         var self = this;
        if (args.deltaY > 0 && args.deltaY > maxDeltaY) {
            if (args.state == 1) {
            // console.log("start...........");   
            }
            else if (args.state == 2) {
            }
            else if (args.state == 3) {
                if(app.ios) {
                    photo.visibility = "hidden";
                }
                else {
                    photo.visibility = "hidden";
                }
                var translateItemFunc = function(){
                    var stackLayout = new StackLayout();
                    var actionbarHeight = args.object.page.getViewById("actionBar").getActualSize().height; 
                    stackLayout.width = args.object.getChildAt(0).getChildAt(0).getActualSize().width;
                    stackLayout.height = args.object.getChildAt(0).getChildAt(0).getActualSize().height;
                    console.log(PercentLength.toDevicePixels(args.object.getChildAt(0).getChildAt(0).width,0,0));
                    var image = new ImageCacheIt();
                    image.imageUri = photo.imageUri;
                    image.height = photo.getActualSize().height;
                    image.width = photo.getActualSize().width;
                    image.stretch = "aspectFit";
                    stackLayout.addChild(image);
                    var departmentId;
                    stackLayout.verticalAlignment = "top";
                    stackLayout.horizontalAlignment = "left";
                    stackLayout.translateX = photo.getLocationOnScreen().x;
                    stackLayout.translateY = photo.getLocationOnScreen().y - photo.getActualSize().height + actionbarHeight;
                    if(app.ios){
                        if(self.sliderCenter &&  args.object.page.getViewById(self.sliderCenter.id)){
                            args.object.page.getViewById(self.sliderCenter.id).addChild(stackLayout);
                        }
                        else{
                             args.object.page.getViewById("productListLayout").addChild(stackLayout);
                        } 
                    }
                    else{
                        args.object.page.getViewById("productListLayout").addChild(stackLayout);
                    }
                    self.dropDownPhoto(stackLayout,photo,function(){
                        if(app.ios){
                            if(self.sliderCenter &&  args.object.page.getViewById(self.sliderCenter.id)){
                                args.object.page.getViewById(self.sliderCenter.id).removeChild(stackLayout);
                                stackLayout = undefined;
                                image = undefined;
                            }
                            else{
                                 args.object.page.getViewById("productListLayout").removeChild(stackLayout);
                                stackLayout = undefined;
                                image = undefined;
                            }
                        }
                        else{
                            args.object.page.getViewById("productListLayout").removeChild(stackLayout);
                            stackLayout = undefined;
                            image = undefined;
                        }
                        if(app.android) {
                            photo.visibility = "visible";
                        }
                        else {
                            photo.visibility = "visible";
                            photo.animate({
                                scale: { x: 1.2, y: 1.2},
                                duration: 200
                            })
                            .then(function(){
                                return photo.animate({
                                    scale: { x: 1, y: 1},
                                    duration: 200
                                });
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                        }
                        
                        callback();
                    });  
                } 
                // if(args.deltaX < 0 && Math.abs(args.deltaX) < maxDeltaX && Math.abs(args.deltaY) > maxDeltaY){
                //       translateItemFunc();
                // }   
                // else{
                //     if(Math.abs(args.deltaX) > maxDeltaX && Math.abs(args.deltaY) < maxDeltaY){
                //         this.onPanSlider(args,1,5,function(){

                //         })
                //     }
                //     else{
                //         console.log("Slider nothing ..... \n " + "args.deltaX : " + args.deltaX + " args.deltaY : " + args.deltaY );
                //     }
                // }

                // if( Math.abs(args.deltaX) < limitGestureProductItemX){
                //     console.log( "can slide -------- X  " + args.deltaX);
                //     console.log( "can slide --------  Y   " + args.deltaY);
                //     translateItemFunc()
                // }
                // else{
                //     console.log( "can't slide -------- X  " + args.deltaX);
                //     console.log( "can't slide -------- Y  " + args.deltaY);
                // }
                var degree = self.calculateDegree(args.deltaX,args.deltaY);
                // console.log("degree onPanProductImage : " + degree.degreeOfUnderAngle)
                if(degree.degreeOfUnderAngle < limitDegree)
                {
                    translateItemFunc();
                    
                }
                else{
                    if(app.android) {
                        photo.visibility = "visible";
                    }
                    else {
                        photo.animate({
                            scale: { x: 1.3, y: 1.3},
                            duration: 200
                        })
                        .then(function(){
                            return photo.animate({
                                scale: { x: 1, y: 1},
                                duration: 200
                            });
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                    }
                    console.log("Can't pan Product Image");
                }
            }
        }
        else{
            if(app.android) {
                photo.visibility = "visible";
            }
            else {
                photo.animate({
                    scale: { x: 1.3, y: 1.3},
                    duration: 200
                })
                .then(function(){
                    return photo.animate({
                        scale: { x: 1, y: 1},
                        duration: 200
                    });
                })
                .catch(function(err) {
                    console.log(err);
                });
            }
        }
    }

    public static dropDownPhoto(image,photo,callback) {
        var self = this;
        var delta = 5;
        var translateX ;
        var translateY;
        var timer ;
        /* right */
        if(self.screenWidth/2 < photo.getLocationOnScreen().x){
            // animate for right
            console.log("right");
            translateX =  -(photo.getLocationOnScreen().x - self.screenWidth/2 - photo.getActualSize().width - photo.getActualSize().width/2);
            translateY = self.screenHeight + 100;
        }
        else{
            if(self.screenWidth/2 - photo.getLocationOnScreen().x <= photo.getActualSize().width/2 + delta ) {
                 // animate for center
                console.log("center");
                translateX = image.translateX;
                translateY = self.screenHeight + 100;
            }
            else{
                 // animate for left
                 console.log("left");
                translateX = self.screenWidth/2 - image.getLocationOnScreen().x + photo.getActualSize().width/2;
                translateY = self.screenHeight + 100;
            }
        }  
        /* center */
        /* left */
        if(self.screenWidth/2)
        image.animate({
            translate: {
                x:  translateX,
                y:  translateY
            },
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        })
        .then(()=>{
            callback();
            console.log("call back");
        });
    }
    
    public static calculateDegree(deltaX, deltaY){
        /*
        x: upper;
        y: under
        ___________
            x    / |
               / y |
              /    |
              
        */
        var atan = Math.atan( Math.abs(deltaX)/ Math.abs(deltaY));
        var degree = (atan*180)/Math.PI;
        return {
            degreeOfUnderAngle : degree,
            degreeOfUpperAngle : 90-degree
        }
    }
}



