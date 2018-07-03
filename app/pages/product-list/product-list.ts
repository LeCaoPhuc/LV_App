var app = require("application");
import { ProductListModel } from "./product-list.model";
import * as platformModule from "platform";
import { httpRequest} from "../../shared/tools";
var productListModel: any;
import { Utils} from "../../shared/tools";
import { SliderControl } from "../../shared/tools";
import * as utils from "utils/utils";
var productListModel : any;
var categoryInfo ;
var isFirst = {
    value : true,
};
Utils.turnOffAnimateParentModalIOS();
export function onNavigatingTo(args){
    var page = args.object;
    categoryInfo = args.context
    Utils.showLoadingIndicator();
    page.getViewById("actionBar").visibility = "visible";
    page.getViewById("isCategory").visibility = "visible";
    var cartView = page.getViewById('cart');
    cartView.backgroundColor= "transparent";
    cartView.translateY = platformModule.screen.mainScreen.heightDIPs - 95 - Utils.getSoftButtonHeight();
    if(isFirst.value || ( args.object._navigationContext.isNavigate && !isFirst.value)){
        isFirst.value = false;
        args.object._navigationContext.isNavigate = false;
        console.log("First onNavigatingTo");
        productListModel = new ProductListModel(args.object, categoryInfo, Utils.getSoftButtonHeight(),isFirst);
        args.object.bindingContext = productListModel;
    }
    else{
        Utils.hideLoadingIndicator();
        console.log("Second");
        args.object.bindingContext = productListModel;
        productListModel.initActionBar();
        productListModel.initProductList();
        
    }
    
}

export function onLoaded(args){  
    if(app.android) {
        console.log("android");
        args.object.getViewById("searchBar").android.clearFocus();
    }
    if(isFirst.value || ( args.object._navigationContext.isNavigate && !isFirst.value)){
        isFirst.value = false;
        args.object._navigationContext.isNavigate = false;
        console.log("First onLoaded");
        productListModel = new ProductListModel(args.object, categoryInfo, Utils.getSoftButtonHeight(),isFirst);
        args.object.bindingContext = productListModel;
    }
    else{
         console.log("First onLoaded");
        // Utils.hideLoadingIndicator();
        console.log("Second");
        args.object.bindingContext = productListModel;
        productListModel.initActionBar();
        productListModel.initProductList();
    }
}
