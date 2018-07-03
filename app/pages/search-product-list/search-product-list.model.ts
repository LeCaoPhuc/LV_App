import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable, fromObject } from "data/observable";
import { httpRequest, Utils, DisplayActionBar, Pagination, ManagementProduct,ShareDataService,ParseService } from "../../shared/tools";
import { Product, Shelf, DepartmentStore, Mode, ManageDepartmentList, typeOfListProduct } from "../../shared/tools"
import { RadSideDrawer } from "nativescript-telerik-ui/sidedrawer";
import { SliderControl, sliderOfView } from "../../shared/tools";
import { MockDataProduct } from "./mock-data-product";
import * as platformModule from "tns-core-modules/platform";
import dialogs = require("ui/dialogs");
import localStorage = require("nativescript-localstorage");
import app = require('application');
import * as utils from "utils/utils";
import { Config } from "../../shared/env-config";
var enums = require("ui/enums");
var frames = require("ui/frame");
var gestures = require("ui/gestures");
var localStorage = require("nativescript-localstorage");
const statusOfList = {
    ONE_PRODUCT : 'one_mode',
    MANY_PRODUCT : 'many_mode'
}
export class SearchProductListModel extends Observable {
    private displayActionBar = new DisplayActionBar(2);
    private isOneMode = true;
    private productItems: Array<Product>;
    public departmentStore: DepartmentStore;
    public pagination: Pagination
    user = {
        firstName: '',
        lastName: '',
        image: ''
    }
    private page;
    private managementProduct;
    private screenWidth;
    private isTranslating = false;
    private isTapShowManyScreen = false;
    private isTapMenuHome = false;
    private isTapMenuSubCategory = false;
    private isTapScanBarCode = false;
    private sliderView;
    private lastPage = false;
    private isFirstSlide = true;
    private indexOfDepartment = ManageDepartmentList.indexOfDepartment();
    private isGestureProduct = false;
    private currentCategory : any;
    private currentProduct : any;
    private isEmptyProductList : boolean = false;
    private warehouseId;
    private currentSubCategoryInfo : any;
    private keyword : string;
    private isSearchPage = true;
    private isFirst ;
    private statusOfList;
    constructor(page, keyword, softButtonHeight,isFirst) {
        super();
        this.currentCategory =  ShareDataService.getData("currentCategory");
        this.currentProduct = ShareDataService.getData("currentItem");
        this.page = page;
        this.keyword = keyword;
        if(this.keyword){
            this.statusOfList = statusOfList.MANY_PRODUCT;
        }
        else{
            this.statusOfList = statusOfList.ONE_PRODUCT;
        }
        this.isFirst = isFirst;
        this.initActionBar();
        this.currentCategory =  ShareDataService.getData("currentCategory");
        var self = this;
        this.pagination = new Pagination();
        this.pagination.page = 1;
        this.pagination.perPage = 9;
        if(this.statusOfList == statusOfList.MANY_PRODUCT){ 
            this.pagination.getData = function(){ 
                return ParseService.cloud('searchWithProductName', {
                    keyword : self.keyword,
                    limit : self.pagination.perPage,
                    page : self.pagination.page
                })
            }
           
        }
        else {
            this.pagination.getData = function(){
                return ParseService.cloud('getProductDetailWithId', {
                    id : self.currentProduct.id,
                    limit : self.pagination.perPage,
                    page : self.pagination.page
                })
            }
        }
        this.managementProduct = new ManagementProduct(this.page, typeOfListProduct.SEARCH_LIST, this.pagination);
        ShareDataService.setData(typeOfListProduct.SEARCH_LIST, this.managementProduct);
        ShareDataService.setData("cacheOtherDepartmentData",{});
        this.initProductList();
    }
    initActionBar(){
        var userInfo = ParseService.currentUser().attributes;
        this.user.firstName = userInfo.first_name;
        this.user.lastName = userInfo.last_name;
        this.user.image = userInfo.avatar ? userInfo.avatar.url() : '~/images/no_image.jpg';
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.page.getViewById("actionBar").notify({
            eventName: "actionBarTitleNotify",
            object: this,
            eventData: Config.TITLE.SEARCH_LIST
        });
        this.sliderView = this.page.getViewById("sliderView");
    }
    initProductList(){
        var self =this;
        this.managementProduct.resetSliderControlForPage();
        this.managementProduct.initSliderControlForPage();
        var currentProductList = this.managementProduct.getProductListOfCurrentSlide();
        this.managementProduct.initProductList()
        .then((response)=>{
            ShareDataService.setData("lastPage", response.last );
            self.lastPage = ShareDataService.getData("lastPage");
            self.page.getViewById("departmentSlider").notify({
                eventName: "managementProductIsCreate",
                object: self,
                eventData:  typeOfListProduct.SEARCH_LIST
            })
            self.page.getViewById("departmentSlider").notify({
                eventName: currentProductList,
                object: self,
                eventData: response
            })
            Utils.hideLoadingIndicator();
        })
        .catch((err)=>{
            Utils.hideLoadingIndicator();
            Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
            console.log("Error - search-product-list.model.ts - constructor: ", err);
        })
    }
    tapCart(args) {
        var list = ManageDepartmentList.getListOfDepartmentLocal();
        console.dir(list);
    }
    onPanSlider(args) {
        var self = this;
        if(self.isEmptyProductList){
            return;
        }
        self.lastPage = ShareDataService.getData("lastPage");
        this.managementProduct.onPanSlider(args, self.lastPage)
            .then((response) => {
                ShareDataService.setData("lastPage", response.last);
                self.lastPage = ShareDataService.getData("lastPage");
                ShareDataService.setData(typeOfListProduct.SEARCH_LIST,self.managementProduct);
                var currentProductList = self.managementProduct.getProductListOfCurrentSlide();
                // setTimeout(function(){
                    self.page.getViewById("departmentSlider").notify({
                        eventName: currentProductList,
                        object: self,
                        eventData: response
                    })

                // },200)
            })
            .catch((err) => {
                Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
                console.log("Error - search-product-list.model.ts - onPanSlider: ", err);
            })
    }

    onTapMenuHome(args) {
        if (!this.isTapMenuHome) {
            this.isTapMenuHome = true;
            this.isFirst.value = true;
            Utils.navigate("pages/home-page/home-page", true);
            this.isTapMenuHome = false;
        }
    }

    onTapMenuSubCategory(args) {
        // if (!this.isTapMenuSubCategory) {
        //     this.isTapMenuSubCategory = true;
        //     Utils.navigate("pages/sub-category/sub-category", true, this.currentCategory);
        //     this.isTapMenuSubCategory = false;
        // }

    }
    openSideBar() {
        let sideDrawer: RadSideDrawer = <RadSideDrawer>(frames.topmost().getViewById("sideBar"));
        if(sideDrawer) {
            sideDrawer.gesturesEnabled = true;
            sideDrawer.showDrawer();
        }  

    }
}
