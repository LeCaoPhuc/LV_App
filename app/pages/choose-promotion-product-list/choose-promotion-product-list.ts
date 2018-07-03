import {ChoosePromotionProductModel} from "./choose-promotion-product-list.model";
import { Observable, fromObject } from "data/observable";
import { Product, Shelf, DepartmentStore, Mode, ManageDepartmentList } from "../../shared/tools"
import { Utils,SliderControl } from "../../shared/tools";
import * as utils from "utils/utils";
import * as platformModule from "platform";
var app = require("application");
var localStorage = require("nativescript-localstorage");
var otherProducListModel;
var frame = require('ui/frame');
var isFirst = {
    value : true
}
var currentProductId ;
export function onNavigatingTo(args){
    var page = args.object;
    var cartView = page.getViewById('cart');
    // var cartIcon = page.getViewById('cart-icon');
    var btnGroup = cartView.getChildById('btnGroup');
    cartView.translateY = platformModule.screen.mainScreen.heightDIPs - 95 - Utils.getSoftButtonHeight();
    cartView.visibility = 'visible';
    // cartIcon.visibility = 'hidden';
    btnGroup.visibility = 'hidden';
}

export function onLoaded(args){
     Utils.hideLoadingIndicator();
     if(isFirst.value || (!isFirst.value && currentProductId != args.object._navigationContext)){
        isFirst.value = false;
        currentProductId = args.object._navigationContext ;      
        otherProducListModel =  new ChoosePromotionProductModel(args.object,args.object._navigationContext,isFirst);

        args.object.bindingContext = otherProducListModel; 
     }
     else{
        args.object.bindingContext = otherProducListModel;
        otherProducListModel.initProductList();
        otherProducListModel.initActionBar();
     }
    // trackAndroidKeyboard();
    // otherProducListModel =  new WishListProductModel();
    // args.object.bindingContext = otherProducListModel; 
}
export function onSearchTap(args) {
    var page = args.object.page;
    console.log("onSearchTap");
    Utils.showModal(page,"shared/components/search/search", function(action,keyword){
        if(action == "itemProductTap") {
            console.log("itemProductTap");
            Utils.showModal(page,"shared/components/product-details-modal/product-details-modal", function(action){
                
            }, false);
        }
        else{
            if(action =="submit"){
                    Utils.navigate("pages/search-product-list/search-product-list",false,keyword);
                }
                else{
                    console.log("Another action");
                }
        }
    }, true)
}

