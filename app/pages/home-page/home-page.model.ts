import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable, fromObject } from "data/observable";
import { httpRequest, Utils, DisplayActionBar, ShareDataService, Product, ManagementCategoryMap, ParseService } from "../../shared/tools";
import { Error } from "../../shared/tools/error";
import platformModule = require('platform');
import { RadSideDrawer } from "nativescript-telerik-ui/sidedrawer";
import dialogs = require("ui/dialogs");
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance } from "nativescript-geolocation";
import { isAndroid, isIOS, device, screen } from "platform";
import * as LabelModule from "tns-core-modules/ui/label";
import { Config } from "../../shared/env-config";
import * as enums from "ui/enums";
var http = require("http");
var app = require("application");
var localStorage = require("nativescript-localstorage");
var frames = require("ui/frame");
var searchBarModule = require('ui/search-bar');
var parseService = ParseService;
var managementCategoryMap = ManagementCategoryMap;
declare var android;

export class HomePageViewModel extends Observable {
    private shelf: ObservableArray<Category>;
    private _items: ObservableArray<any>;
    private _itemName: string;
    private accessToken = localStorage.getItem("accessToken");
    private url = 'scanngo_v1/category';
    private screenWidth: number;
    private showListSuggest: Boolean = false;
    private listSuggest = new ObservableArray<any>();
    private displayActionBar = new DisplayActionBar(1);
    private getWidth = screen.mainScreen.widthDIPs;
    private titleActionBar;
    private titleActionBarTemp;
    private fontIcon;
    private _searchBar;
    private imageUrl = "https://scanngo.sstechvn.com/media/catalog/category/product_1.png";
    user = {
        firstName: '',
        lastName: '',
        image: ''
    }
    textSearchBar: string;
    constructor(page) {
        super();
        var currentUser = ParseService.currentUser().attributes;
        if (currentUser) {
            this.user.firstName = currentUser.first_name;
            this.user.lastName = currentUser.last_name;
            this.user.image = (currentUser.avatar && currentUser.avatar.url) ? currentUser.avatar.url() : '';
        }
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.notifyPropertyChange("user", this.user);
        var self = this;
        if(!managementCategoryMap.categoryMap) {
            managementCategoryMap.initCategoryMap()
            .then(()=>{
                managementCategoryMap.init();
                self.initCategoryItemsFromLocalData();
            })
            .catch((err)=>{
                console.log('constructor - initCategoryMap- homepage.model.ts - ', err);
            })
        }
        else {
             self.initCategoryItemsFromLocalData();
        }
    }
    getCurrentWarehouse(){
            
    }
    get dataItems() {
        return this._items;
    }

    onSearchTap(args) {
        console.log("onSearch Tap");
    }
    onItemLoading(args) {
        if (app.ios) {
            args.ios.selectionStyle = UITableViewCellSelectionStyle.None;
        }
    }
    openSideBar() {
        let sideDrawer: RadSideDrawer = <RadSideDrawer>(frames.topmost().getViewById("sideBar"));
        if(sideDrawer) {
            sideDrawer.gesturesEnabled = true;
            sideDrawer.showDrawer();
        }  
    }
    tapCategoryItem(args) {
        // var mapCategory = ManagementCategoryMap.categoryMap ;
        // var current = ManagementCategoryMap.current() ;
        // // var next = ManagementCategoryMap.next() ;
        // var previous = ManagementCategoryMap.previous() ;
        // var arrSubcategory = ManagementCategoryMap.getSubCategoryWithCategoryId('303');
        var categoryInfo: any;
        if (app.ios) {
            managementCategoryMap.init(args.view.content.categoryId);   
            categoryInfo = {
                categoryId: args.view.content.categoryId,
                categoryName: args.view.content.categoryName,
                categoryImage: args.view.content.categoryImage != '' ? args.view.content.categoryImage : null
            }
        } else {
            managementCategoryMap.init(args.object.getSelectedItems()[0].categoryId);   
            categoryInfo = {
                categoryId: args.object.getSelectedItems()[0].categoryId,
                categoryName: args.object.getSelectedItems()[0].categoryName,
                categoryImage: args.object.getSelectedItems()[0].categoryImage
            }
        }
        Utils.showLoadingIndicator();
        setTimeout(function() {
            frames.topmost().navigate({
                moduleName: "pages/product-list/product-list",
                context: categoryInfo,
                animated: false,
                clearHistory: false
            })
        },100)
        
        // Utils.navigate(, false, categoryInfo);
    }

    // private initCategoryItems() {
    //     var self = this;
    //     this._items = new ObservableArray<Category>();
    //     if (!Utils.checkInternetConnection()) {
    //         return;
    //     }
    //     Utils.showLoadingIndicator();
    //     httpRequest.get(self.url, self.accessToken)
    //         .then(function (res: any) {
    //             if (res && res.statusCode == 200) {
    //                 try{
    //                     var categoryList = res.content.toJSON().data;
    //                     for (var i = 0; i < categoryList.length; i++) {
    //                         var category = new Category(i, categoryList[i].id, categoryList[i].name.toUpperCase(), categoryList[i].image_url, self.tapCategoryItem);
    //                         self._items.push(category);
    //                     }
    //                     Utils.hideLoadingIndicator();
    //                     self.notifyPropertyChange("dataItems",self.dataItems);
    //                 }
    //                 catch(err){
    //                     Utils.hideLoadingIndicator();
    //                     console.log("Error - initCategoryItems - home-page.model.ts ", res.statusCode);
    //                     Utils.toastAlert("Có lỗi xảy ra trong quá trình xử lý!");
    //                 }

    //             }
    //             else{
    //                 Utils.hideLoadingIndicator();
    //                 console.log("Error - getPorductIntoCart - home-page.model.ts ", res.statusCode);
    //                 Utils.toastAlert("Có lỗi xảy ra khi tải dữ liệu siêu thị");
    //             }

    //         })
    //         .catch(function (err) {
    //             console.log("Error - initCategoryItems - home-page.model.ts ",err);
    //             Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
    //             Utils.hideLoadingIndicator();
    //         })

    // }

    private initCategoryItemsFromLocalData() {
        this._items = new ObservableArray<Category>();
        if (ManagementCategoryMap.categoryMap) {
            var categoryList = ManagementCategoryMap.categoryMap;
            for (var i in categoryList) {
                var category = new Category(i, categoryList[i].categoryId, categoryList[i].categoryName.toUpperCase(), categoryList[i].imageUrl, this.tapCategoryItem);
                this._items.push(category);
            }
            this.notifyPropertyChange("dataItems", this.dataItems);
        }
        else {
            console.log("Error - initCategoryItemsFromLocalData - home-page.model.ts ");
            Utils.toastAlert(" Có lỗi trong quá trình lấy dữ liệu ngành hàng");
        }
    }
}



class Category {
    private index;
    private categoryName;
    private categoryImage;
    private categoryId;
    private tapCategoryFunc: Function;
    private width: any;
    private height: any;

    constructor(index, categoryId, categoryName, categoryImage, tapCategoryFunc) {
        this.index = index;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryImage = categoryImage;
        this.tapCategoryFunc = tapCategoryFunc;
        this.width = platformModule.screen.mainScreen.widthDIPs;
        this.height = this.width * 1 / 2;
    }
}
