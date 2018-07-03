var app = require("application");
import { SearchProductListModel } from "./search-product-list.model";
import * as platformModule from "platform";
import { httpRequest} from "../../shared/tools";
var productListModel: any;
import { Utils} from "../../shared/tools";
import { SliderControl } from "../../shared/tools";
import * as utils from "utils/utils";
var application = require("application");
var frameModule = require("ui/frame");
var searchProductListModel : any;
var currentKeyword ;
var type ;
var previousKeyword = "" ; // keyword when previous search default = ""
var isFirst = {
    value : true
}
Utils.turnOffAnimateParentModalIOS();
export function onNavigatedTo(args){
    var page = args.object;
    currentKeyword = args.context.keyword
    type = args.context.type;
    Utils.showLoadingIndicator();
    page.getViewById("actionBar").visibility = "visible";
    page.getViewById("isCategory").visibility = "visible";
    var cartView = page.getViewById('cart');
    var cartIcon = page.getViewById('cart-icon');
    cartView.translateY = platformModule.screen.mainScreen.heightDIPs - 95 - Utils.getSoftButtonHeight();
    cartView.visibility = 'visible';
    cartIcon.visibility = 'hidden';
    if(type == 'many'){
        if(isFirst.value || (!isFirst.value && currentKeyword != previousKeyword)){
            isFirst.value = false;
            console.log("First");
            searchProductListModel = new SearchProductListModel(args.object, currentKeyword, Utils.getSoftButtonHeight(),isFirst);
            previousKeyword = currentKeyword;
            args.object.bindingContext = searchProductListModel;
        }
        else{
            console.log("Second");
            args.object.bindingContext = searchProductListModel;
            if(searchProductListModel) {
                searchProductListModel.initActionBar();
                searchProductListModel.initProductList();
            }
        }
    }
    else{
        console.log("First");
        isFirst.value = false;
        searchProductListModel = new SearchProductListModel(args.object, currentKeyword, Utils.getSoftButtonHeight(),isFirst);
        previousKeyword = currentKeyword;
        args.object.bindingContext = searchProductListModel;
        
    }
}

export function onLoaded(args){
    var activity = application.android.startActivity ||
        application.android.foregroundActivity ||
        frameModule.topmost().android.currentActivity ||
        frameModule.topmost().android.activity;
        activity.onBackPressed = function () {
            if (searchProductListModel && !searchProductListModel.isTapMenuHome) {
                searchProductListModel.isTapMenuHome = true;
                searchProductListModel.isFirst.value = true;
                Utils.navigate("pages/home-page/home-page", true);
                searchProductListModel.isTapMenuHome = false;
            }
        }
    if(app.android && args.object.getViewById("searchBar")) {
        console.log("android");
        args.object.getViewById("searchBar").android.clearFocus();
    }
    if(type == 'many'){
        searchProductListModel = new SearchProductListModel(args.object, currentKeyword, Utils.getSoftButtonHeight(),isFirst);
         if(isFirst.value || (!isFirst.value && currentKeyword != previousKeyword)){
            isFirst.value = false;
            console.log("First");
            searchProductListModel = new SearchProductListModel(args.object, currentKeyword, Utils.getSoftButtonHeight(),isFirst);
            previousKeyword = currentKeyword;
            args.object.bindingContext = searchProductListModel;
        }
        else{
            console.log("Second");
            if(searchProductListModel) {
                args.object.bindingContext = searchProductListModel;
                searchProductListModel.initActionBar();
                searchProductListModel.initProductList();
            }

        }
    }
    else{
        console.log("First");
        isFirst.value = false;
        searchProductListModel = new SearchProductListModel(args.object, currentKeyword, Utils.getSoftButtonHeight(),isFirst);
        previousKeyword = currentKeyword;
        args.object.bindingContext = searchProductListModel;
        searchProductListModel.initActionBar();
    }
     
}
