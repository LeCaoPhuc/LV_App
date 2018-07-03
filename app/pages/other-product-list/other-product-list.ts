import {WishListProductModel} from "./other-product-list.model";
import { Observable, fromObject } from "data/observable";
import { Product, Shelf, DepartmentStore, Mode, ManageDepartmentList } from "../../shared/tools"
import { Utils,SliderControl } from "../../shared/tools";
import * as utils from "utils/utils";
import * as platformModule from "platform";
var app = require("application");
var localStorage = require("nativescript-localstorage");
var wishlistProducListModel;
var isFirst = {
    value : true
}
var frame = require('ui/frame');
export function onNavigatingTo(args){
    var page = args.object;
    var cartView = page.getViewById('cart');
    // var cartIcon = page.getViewById('cart-icon');
    var btnGroup = cartView.getChildById('btnGroup');
    cartView.translateY = platformModule.screen.mainScreen.heightDIPs - 95 - Utils.getSoftButtonHeight();
    // cartView.visibility = 'hidden';
    // cartIcon.visibility = 'hidden';
    btnGroup.visibility = 'hidden';
    if(isFirst.value){
        isFirst.value = false;
        console.log("First");
        wishlistProducListModel =  new WishListProductModel(args.object,isFirst);
        args.object.bindingContext = wishlistProducListModel; 
    }
    else{
        Utils.hideLoadingIndicator();
        console.log("Second");
        args.object.bindingContext = wishlistProducListModel;
        wishlistProducListModel.initActionBar();
        wishlistProducListModel.initProductList();
    }
}

export function onLoaded(args){
     if(isFirst.value){
        isFirst.value = false;
        console.log("First");
        wishlistProducListModel =  new WishListProductModel(args.object,isFirst);
        args.object.bindingContext = wishlistProducListModel; 
    }
    else{
        Utils.hideLoadingIndicator();
        console.log("Second");
        args.object.bindingContext = wishlistProducListModel;
        wishlistProducListModel.initActionBar();
        wishlistProducListModel.initProductList();
    }
    // trackAndroidKeyboard();
    // otherProducListModel =  new WishListProductModel();
    // args.object.bindingContext = otherProducListModel; 
}
