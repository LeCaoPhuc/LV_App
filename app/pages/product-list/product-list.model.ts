import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable, fromObject } from "data/observable";
import { httpRequest, Utils, DisplayActionBar, Pagination, ManagementProduct, ShareDataService, ManagementCategoryMap, ParseService } from "../../shared/tools";
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

export class ProductListModel extends Observable {
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
    private managementCategoryMap: any;
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
    private isEmptyProductList: boolean = false;
    private warehouseId;
    private isFirst: any;
    private test = 'test';
    constructor(page, categoryInfo, softButtonHeight, isFirst) {
        super();
        this.page = page;
        this.managementCategoryMap = ManagementCategoryMap;
        if (app.ios) {
            frames.topmost().ios.controller.view.removeGestureRecognizer(frames.topmost().ios.controller.interactivePopGestureRecognizer);
        }
        else {
             console.log("constructor");
        }
        this.isFirst = isFirst;
        this.initActionBar();
        this.pagination = new Pagination();
        this.pagination.page = 1;
        this.pagination.perPage = 9;
        var self = this;
        this.pagination.getData = function () {
            return ParseService.cloud('getProductListWithCategory',{
                categoryId : self.managementCategoryMap.current().categoryId,
                limit: self.pagination.perPage,
                page : self.pagination.page
            })
        }

        this.managementProduct = new ManagementProduct(this.page, typeOfListProduct.CATEGORY_LIST, this.pagination);
        this.managementProduct.resetSliderControlForPage();
        this.managementProduct.initSliderControlForPage();
        ShareDataService.setData(typeOfListProduct.CATEGORY_LIST, this.managementProduct);
        if (!ShareDataService.getData("cacheDepartmentData")) {
            ShareDataService.setData("cacheDepartmentData", {});
        }
        var currentProductList = this.managementProduct.getProductListOfCurrentSlide();

        Utils.showLoadingIndicator();
        this.initProductList();
    }

    initActionBar() {
        var self =this;
        var userInfo = ParseService.currentUser().attributes;
        this.user.firstName = userInfo.first_name;
        this.user.lastName = userInfo.last_name;
        this.user.image = userInfo.avatar ? userInfo.avatar.url() : '~/images/no_image.jpg';
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.page.getViewById("actionBar").notify({
            eventName: "actionBarTitleNotify",
            object: this,
            eventData: self.managementCategoryMap.current().categoryName
        });
        this.sliderView = this.page.getViewById("sliderView");
    }

    initProductList() {
        var self = this;
        this.managementProduct.resetSliderControlForPage();
        this.managementProduct.initSliderControlForPage();
        console.log("managementProductIsCreate product list");
        // ShareDataService.setData("cacheDepartmentData",{});
       
        var currentProductList = this.managementProduct.getProductListOfCurrentSlide();
        this.managementProduct.initProductList()
            .then((response) => {
                ShareDataService.setData("lastPage", response.last);
                self.lastPage = ShareDataService.getData("lastPage");
                    self.page.getViewById("departmentSlider").notify({
                        eventName: "managementProductIsCreate",
                        object: self,
                        eventData: typeOfListProduct.CATEGORY_LIST
                    })
                    self.page.getViewById("departmentSlider").notify({
                        eventName: currentProductList,
                        object: self,
                        eventData: response
                    })
                    Utils.hideLoadingIndicator();
            })
            .catch((err) => {
                Utils.hideLoadingIndicator();
                Utils.toastAlert("Có lỗi xảy ra khi tải dữ liệu");
                console.log("Error - product-list.model.ts - constructor: ", err);
            })
    }

    tapCart(args) {
        var list = ManageDepartmentList.getListOfDepartmentLocal();
        console.dir(list);
    }
    private checkFirstSlide = true; // beacuse onPan run many time , previous run manytime\
    private currentPageTemp = null;
    onPanSlider(args) {
        var self = this;
        var degree = SliderControl.calculateDegree(args.deltaX, args.deltaY)
        if (self.isEmptyProductList || degree.degreeOfUpperAngle > 30) {
            return;
        }
        console.log("show loading slider page ", args.state);
        // Utils.showLoadingIndicator();
        self.lastPage = ShareDataService.getData("lastPage");
        if (self.lastPage && args.deltaX < 0 && self.checkFirstSlide) {
            self.checkFirstSlide = false;
            console.log("/n /n /nDelta X : ", args.deltaX);
            if (self.managementCategoryMap.current().last) {
                self.managementProduct.pagination.page = self.managementCategoryMap.next().totalPage;
            }
            else {
                self.managementCategoryMap.next();
                self.managementProduct.pagination.page = 1;
            }

            self.initActionBar();
        }
        if (self.managementProduct.pagination.page == 1 && args.deltaX > 0 && self.checkFirstSlide) {
            self.checkFirstSlide = false;
            console.log("/t//t/t/t/t/t/t OnPan slider  -- -= = = = == = == = = ", args.deltaX)
            var cacheDepartmentData = ShareDataService.getData("cacheDepartmentData");
            self.currentPageTemp = self.managementProduct.pagination.page;
            if (self.managementCategoryMap.current().first) {
                self.managementProduct.pagination.page = 1;
            }
            else {
                self.managementProduct.pagination.page = self.managementCategoryMap.previous().totalPage;
            }
            self.initActionBar();
        }
        this.managementProduct.onPanSlider(args, self.lastPage, self.currentPageTemp)
            .then((response) => {
                self.currentPageTemp = null;
                self.checkFirstSlide = true;
                ShareDataService.setData("lastPage", response.last);
                self.lastPage = ShareDataService.getData("lastPage");
                var currentProductList = self.managementProduct.getProductListOfCurrentSlide();
                self.page.getViewById("departmentSlider").notify({
                    eventName: currentProductList,
                    object: self,
                    eventData: response
                })
                Utils.hideLoadingIndicator();
            })
            .catch((err) => {
                self.checkFirstSlide = true;
                Utils.hideLoadingIndicator();
                Utils.toastAlert("Có lỗi xảy ra khi tải dữ liệu");
                console.log("Error - product-list.model.ts - onPanSlider: ", err);
            })

    }

    onTapMenuHome(args) {
        if (!this.isTapMenuHome) {
            this.isTapMenuHome = true;
            this.isFirst.value = true;
            frames.topmost().navigate({
                moduleName: "pages/home-page/home-page",
                context: '',
                animated: false,
                clearHistory: true
            })
            this.isTapMenuHome = false;
        }
    }

    onTapMenuSubCategory(args) {
        if (!this.isTapMenuSubCategory) {
            this.isTapMenuSubCategory = true;
            this.isFirst.value = true;
            Utils.goBack();
            this.isTapMenuSubCategory = false;
        }

    }
    openSideBar() {
        let sideDrawer: RadSideDrawer = <RadSideDrawer>(frames.topmost().getViewById("sideBar"));
        if(sideDrawer) {
            sideDrawer.gesturesEnabled = true;
            sideDrawer.showDrawer();
        }  

    }

    onTapShowManyScreen(args) {
        var self = this;
        // Utils.showLoadingIndicator();
        console.log(this.isTapShowManyScreen);
        if (this.isTapShowManyScreen) {
            return;
        }
        this.isTapShowManyScreen = true;
        Utils.showModal(args.object.page, "pages/product-list/product-list-four-mode/product-list-four-mode", function (isNavigate, listProduct, page) {
            self.isTapShowManyScreen = false;
            if (isNavigate) {
                Utils.showLoadingIndicator();
                console.log("page", page);
                self.managementProduct.pagination.page = parseInt(page);
                var currentProductList = self.managementProduct.getProductListOfCurrentSlide();
                self.managementProduct.initProductList()
                    .then((response) => {
                        ShareDataService.setData("lastPage", response.last);
                        self.lastPage = ShareDataService.getData("lastPage");
                        console.log("initProductList then");
                        setTimeout(function () {
                            self.page.getViewById("departmentSlider").notify({
                                eventName: currentProductList,
                                object: self,
                                eventData: response
                            })
                            Utils.hideLoadingIndicator();
                        }, 300)
                    })
                    .catch((err) => {
                        Utils.hideLoadingIndicator();
                        Utils.toastAlert("Có lỗi khi tải dữ liệu");
                        console.log("Error onTapShowManyScreen - modal callback - product-list.model.ts ", err)
                    })
            }
        }, false, self.managementCategoryMap.current().subCategory.subCategoryId)
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
