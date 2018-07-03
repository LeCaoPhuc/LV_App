import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable, fromObject } from "data/observable";
import { httpRequest, Utils, DisplayActionBar, Pagination, ManagementProduct,ShareDataService } from "../../../shared/tools";
import { Product, Shelf, DepartmentStore, Mode, ManageDepartmentList,typeOfListProduct } from "../../../shared/tools"
import { RadSideDrawer } from "nativescript-telerik-ui/sidedrawer";
import { SliderControl, sliderOfView } from "../../../shared/tools";
import * as platformModule from "tns-core-modules/platform";
import dialogs = require("ui/dialogs");
import localStorage = require("nativescript-localstorage");
import app = require('application');
import * as utils from "utils/utils";
import { Config } from "../../../shared/env-config";
var enums = require("ui/enums");
var frames = require("ui/frame");
var gestures = require("ui/gestures");
var localStorage = require("nativescript-localstorage");
const statusOfList = {
    ONE_PRODUCT : 'one_mode',
    MANY_PRODUCT : 'many_mode'
}
export class SearchRelatedProductListModel extends Observable {
    private actionBarTitle;
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
    private isEmptyProductList : boolean = false;
    private warehouseId;
    private currentSubCategoryInfo : any;
    private keyword : string;
    private typeOfSearchPage ;
    private relatedProductId;
    private isSearchPage = true;
    private isFirst;
    private statusOfList;
    private currentProduct : any;
    constructor(page, data, softButtonHeight,isFirst) {
        super();
        this.isFirst = isFirst;
        this.warehouseId = localStorage.getItem("warehouseInfo") ? localStorage.getItem("warehouseInfo").id : 49;
        this.page = page;
        this.keyword = data.keyword;
        this.typeOfSearchPage = data.type;
        this.relatedProductId = data.relatedId;
        if(data.mode == 'one'){
            this.statusOfList = statusOfList.ONE_PRODUCT;
        }
        else{
            this.statusOfList = statusOfList.MANY_PRODUCT;
        }
        this.initActionBar();
        this.currentProduct =  ShareDataService.getData("currentItem");
        var self = this;
        this.pagination = new Pagination();
        this.pagination.page = 1;
        this.pagination.perPage = 9;
        this.pagination.getData = function(){
            var url;
            if(self.typeOfSearchPage=="related"){
                 url  = `scanngo_v1/warehouse/${  self.warehouseId }/product/${ self.relatedProductId }/related?name=${ self.keyword }&page=${ self.pagination.page }&per_page=${ self.pagination.perPage }`;
            }
            console.log(url);
            url = Utils.encodeURLHTTP(url);
            return httpRequest.get(url,localStorage.getItem("accessToken"));
        }
        this.managementProduct = new ManagementProduct(this.page, typeOfListProduct.RELATED_SEARCH_LIST, this.pagination);
        ShareDataService.setData(typeOfListProduct.RELATED_SEARCH_LIST, this.managementProduct);
        ShareDataService.setData("cacheOtherDepartmentData",{});
        var currentProductList = this.managementProduct.getProductListOfCurrentSlide();
        Utils.showLoadingIndicator();
        if(this.statusOfList ==  statusOfList.MANY_PRODUCT) {
            this.managementProduct.resetSliderControlForPage();
            this.managementProduct.initSliderControlForPage();
            this.initProductList();
        }
        else {
            console.log("one_mode");
            this.managementProduct.resetSliderControlForPage();
            this.managementProduct.initSliderControlForPage();
            this.initProductListOneMode();
          
        }   
    }
    initActionBar(){
        this.user.firstName = localStorage.getItem("userInfo").firstName;
        this.user.lastName = localStorage.getItem("userInfo").lastName;
        this.user.image = localStorage.getItem("userInfo").avatar;
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.page.getViewById("actionBar").notify({
            eventName: "actionBarTitleNotify",
            object: this,
            eventData: Config.TITLE.SEARCH_RELATED_PRODUCT
        });
        var userInfo = localStorage.getItem("userInfo");
        this.sliderView = this.page.getViewById("sliderView");
    }
    initProductList(){
        var self = this;
        this.managementProduct.resetSliderControlForPage();
        this.managementProduct.initSliderControlForPage();
        var currentProductList = this.managementProduct.getProductListOfCurrentSlide();
        this.page.getViewById("departmentSlider").notify({
            eventName: "managementProductIsCreate",
            object: self,
            eventData: typeOfListProduct.RELATED_SEARCH_LIST
        })
        this.managementProduct.initProductList()
        .then((response)=>{
            ShareDataService.setData("lastPage", response.last );
            self.lastPage = ShareDataService.getData("lastPage");
            setTimeout(function(){
                self.page.getViewById("departmentSlider").notify({
                    eventName: currentProductList,
                    object: self,
                    eventData: response
                })
                Utils.hideLoadingIndicator();
            },200)
        })
        .catch((err)=>{
            Utils.hideLoadingIndicator();
            Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
            console.log("Error - initProductList - related-product-list-search-result.model.ts ",err);
        })
    }

    initProductListOneMode() {
        var self = this;
        var emtyProductData = {
            "entity_id": "10000",
            "type_id": "simple",
            "attribute_set_id": "4",
            "sku": "empty",
            "name": "empty",
            "department": "empty",
            "small_image": "empty",
            "sub_department": "1",
            "selling_u_m": "KG",
            "is_fresh": "0",
            "short_description": null,
            "upc": [
                "empty"
            ],
            "warehouse_id": "49",
            "final_price": "0.0000",
            "original_price": "0.0000",
            "is_salable": "1",
            "stock_item": {},
            "media_gallery": []
        };
        var productArr = [];
        for(var i = 0; i < 9 ; i++){
            if(i==7){
                var newProduct  = fromObject(this.currentProduct);
                productArr.push(newProduct);
            }
            else{
                var product = new Product(emtyProductData);
                product.productId = null;
                var productEmpty  = fromObject(product);
                productArr.push(productEmpty);
            }
        }
        this.page.getViewById("departmentSlider").notify({
            eventName: "managementProductIsCreate",
            object: self,
            eventData:  typeOfListProduct.RELATED_SEARCH_LIST
        })
        var response = {
            productArr : productArr,
            last : true
        }
        ShareDataService.setData("lastPage", response.last );
        self.page.getViewById("departmentSlider").notify({
            eventName: "notifySecondProductListBindingComplete",
            object: self,
            eventData: response
        })
        Utils.hideLoadingIndicator();
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
                var currentProductList = self.managementProduct.getProductListOfCurrentSlide();
                setTimeout(function(){
                    self.page.getViewById("departmentSlider").notify({
                        eventName: currentProductList,
                        object: self,
                        eventData: response
                    })
                    Utils.hideLoadingIndicator();
                },200)
            })
            .catch((err) => {
                Utils.hideLoadingIndicator();
                Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
                console.log("Error - onPanSlider - related-product-list-search-result.model.ts ",err);
            })
    }
    openSideBar() {
        let sideDrawer: RadSideDrawer = <RadSideDrawer>(frames.topmost().getViewById("sideBar"));
        sideDrawer.gesturesEnabled = true;
        sideDrawer.showDrawer();

    }
    goBack(){
        ShareDataService.setData("cacheOtherDepartmentData",{});
        this.isFirst.value = true;
        Utils.goBack();
    }
    onTapScanBarcode() {
        var self = this;
        if (!this.isTapScanBarCode) {
            Utils.scanBarCode(this.page, function (barCodeValue, _typeBarCodeManual) {
                self.isTapScanBarCode = false;
                if (_typeBarCodeManual) {
                    setTimeout(function () {
                        console.log('sdsds')
                        dialogs.prompt({
                            title: "Nhập mã barcode",
                            message: "Vui lòng nhập mã barcode",
                            okButtonText: "Xác nhận",
                            cancelButtonText: "Hủy",
                            inputType: dialogs.inputType.text
                        }).then(function (r) {
                            if (r.result) {
                                dialogs.alert({
                                    title: "Thông báo",
                                    message: "Bạn đã nhập mã barcode: " + r.text,
                                    okButtonText: "Đóng"
                                });
                            }

                        });
                    }, (app.android ? 0 : 600))

                }
                else {
                    setTimeout(function () {
                        dialogs.alert({
                            title: "Thông báo",
                            message: "Bạn đã nhập mã barcode: " + barCodeValue,
                            okButtonText: "Đóng"
                        });
                    }, (app.android ? 0 : 600))
                }
            }, function () {
                self.isTapScanBarCode = false;
            })
        }
    }
}
