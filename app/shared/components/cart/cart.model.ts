import { EventData, fromObject } from 'data/observable';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import * as LabelModule from "tns-core-modules/ui/label";
import localStorage = require("nativescript-localstorage");
import { Feedback } from "nativescript-feedback";
import platformModule = require("platform");
import app = require('application');
import { httpRequest } from "../../tools/http";

import { Config } from '../../env-config';
import { Utils, ShareDataService, Product, ParseService } from '../../tools';
import dialogs = require("ui/dialogs");
import { closeCartView } from "./cart";

export class CartViewModel extends observable.Observable {
    private page: any;
    private cartView: any;
    private listItemsInCart: ObservableArray<any>;
    private prevDeltaY: number;
    private btnScan: any;
    private btnPayment : any;
    private iconArrow: any;
    private totalPrice: any;
    private showPromoView: boolean;
    private emptyCartView: boolean;
    private listItemsHeight: number;
    private softButtonHeight: number;
    private density: number;
    private firstLoad: boolean;
    private voucher: any;
    private finalPrice: any;
    private isTapScanBarCode: boolean;
    private countSuccessCheck: number; // use to control hide animation of successCheck
    private changeObject: any; // use this to save change in cart and sync cart with server
    private isShowSyncLoading: boolean;
    private feedback: Feedback;
    private isShowFeedBack: boolean;
    private isTapProductDetails: boolean;
    constructor(page) {
        super();
        this.page = page;
        var self = this;
        this.isTapProductDetails = false;
        this.isTapScanBarCode = false;
        this.listItemsInCart = new ObservableArray();
        this.softButtonHeight = Utils.getSoftButtonHeight();
        this.cartView = page.getViewById('cart');
        this.iconArrow = this.cartView.getChildById('iconArrow');;
        this.btnScan = this.cartView.getChildById('btnScan');
        this.btnPayment = this.cartView.getChildById('btnPayment');
        this.isShowFeedBack = false;
        this.totalPrice = fromObject({
            value: 0,
            display: '0',
        })
        this.finalPrice = fromObject({
            value: 0,
            display: '0',
        });
        this.changeObject = {};
        this.showPromoView = false;
        this.emptyCartView = true;
        this.firstLoad = true;
        this.countSuccessCheck = 0;
        this.initListItemsInCart();
        this.displayBtnScan(!!(this.cartView.showBtnScan == 'true'));
        /**
         * Avoid listen mutiltimes event
         */
        page.off("notifyAddProductToCart");
        page.off("notifyAddProductToCartFromProductDetails");
        page.off("cartViewSyncComplete");
        // -------
        page.on("notifyAddProductToCart", function (event) {
            if (event.eventData.product) {
                self.addItemToCart(event.eventData.product, event.eventData.quantity, true);
            }
        });
        page.on("notifyAddProductToCartFromProductDetails", function (event) {
            if (event.eventData.product) {
                self.addItemToCart(event.eventData.product, event.eventData.quantity, true);
            }
        });
    }

    initListItemsInCart() {
        var self = this;
        var listProductInCart = localStorage.getItem('listItemsInCart');
        for (let i in listProductInCart) {
            var product = fromObject({
                productFinalPrice: listProductInCart[i].productFinalPrice,
                productFinalPriceDisplay: listProductInCart[i].productFinalPriceDisplay,
                productId: listProductInCart[i].productId,
                productImageList: listProductInCart[i].productImageList,
                productIsFresh: listProductInCart[i].productIsFresh,
                productName: listProductInCart[i].productName,
                productOriginalPrice: listProductInCart[i].productOriginalPrice,
                productOriginalPriceDisplay: listProductInCart[i].productOriginalPriceDisplay,
                productSKUCode: listProductInCart[i].productSKUCode,
                promotion: listProductInCart[i].promotion,
                quantity: listProductInCart[i].quantity,
                showDeleteLayout: false,
            });
            this.listItemsInCart.push(product);
        }
        this.calcTotalPrice();
    }

    displayBtnScan(isShowBtnScan: boolean) {
        if (isShowBtnScan && this.cartView.showBtnScan == "true") {
            this.btnScan.visibility = 'visible';
            this.btnPayment.visibility = 'visible';
        }
        else {
            this.btnScan.visibility = 'collapsed';
            this.btnPayment.visibility = 'collapsed'
        }
    }

    onTapScanBarcode(args) {
        var self = this;
        if (!this.isTapScanBarCode) {
            Utils.scanBarCode(this.page, function (barCodeValue, _typeBarCodeManual) {
                self.isTapScanBarCode = false;
                if (_typeBarCodeManual) {
                    setTimeout(function () {
                        dialogs.prompt({
                            title: "Nhập mã barcode",
                            message: "Vui lòng nhập mã barcode",
                            okButtonText: "Xác nhận",
                            cancelButtonText: "Hủy",
                            inputType: dialogs.inputType.text
                        }).then(function (r) {
                            getProductDetails(r.text);
                        });
                    }, (app.android ? 0 : 600))
                }
                else {
                    getProductDetails(barCodeValue);
                }
            }, function () {
                self.isTapScanBarCode = false;
            })
        }
        function getProductDetails(sku) {
            Utils.showLoadingIndicator();
            ParseService.cloud('getProductDetailWithSKU', { sku: sku })
                .then((res) => {
                    Utils.hideLoadingIndicator();
                    var product = new Product(res.data[0]);
                    ShareDataService.setData('currentItem', product)
                    Utils.showModal(args.object.page, 'shared/components/product-details-modal/product-details-modal', function (eventData, state) {
                        self.isTapProductDetails = false;
                        if (state == "add") {
                            if (eventData) {
                                var product = eventData.product;
                                if(self.listItemsInCart.length <= 0) {
                                    if(product) {
                                        self.addItemToCart(product, 1, false);
                                    }
                                }
                                else {
                                    var addStatus = false;
                                    for (let i = 0; i < self.listItemsInCart.length; i++) {
                                        if (self.listItemsInCart.getItem(i).productId == product.productId) {
                                            // if this product already in cart, update quantity
                                            addStatus = true;
                                            var item = self.listItemsInCart.getItem(i);
                                            item.quantity = eventData.quantity;
                                            self.calcTotalPrice();
                                            self.showAddProductSuccessCheck();
                                            break;
                                        }
                                    }
                                    if(!addStatus && product) {
                                         self.addItemToCart(product, 1, false);
                                    }
                                }
                                
                            }
                            else {
                                console.log('close product details modal');
                            }
                        }
                        else {
                            console.log("close Callback with Other state");
                        }
                    }, true);
                })
                .catch((err) => {
                    Utils.hideLoadingIndicator();
                    Utils.alert('warning', 'Thông Báo', 'Không tìm thấy sản phẩm vừa quét', 'Đóng');
                    console.log(err);
                })
        }
    }

    onCheckOutTouch(args) {
        var self = this;
        if (args.action == 'down') {
            args.object.page.getViewById('cartViewBodyBottom').backgroundColor = '#cc3000';
        }
        else if (args.action == "up") {
            args.object.page.getViewById('cartViewBodyBottom').backgroundColor = '#FF5722';
             if (this.totalPrice.value <= 0) {
                Utils.toastAlert('Giỏ hàng 0đ không thể đặt');
                return;
            }
            closeCartView(args);
            Utils.showLoadingIndicator();
            setTimeout(function () {
                Utils.navigate('pages/payment/payment', false, self.finalPrice);
                Utils.hideLoadingIndicator();
            }, 1000);
        }
    }

    onSwipeCellStarted(args) {
        try {
            var swipeLimits = args.data.swipeLimits;
            var swipeView = args.swipeView;
            var rightItem = swipeView.getViewById('delete-view');
            swipeLimits.left = 0;
            swipeLimits.right = rightItem.getMeasuredWidth();
            swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
        } catch (error) {
            console.log(error);
        }

    }

    showAddProductSuccessCheck() {
        var self = this;
        var count;
        var page = this.page;
        var view = page.getViewById("confirmAddProductToCart");
        this.countSuccessCheck++;
        count = this.countSuccessCheck;
        view.visibility = "visible";
        view.class = "";
        view.class = "animationZoom";
        setTimeout(function () {
            if (count == self.countSuccessCheck) {
                view.visibility = "hidden"; // only the last success check can set "hidden" for VIEW("confirmAddProductToCart")
            }
        }, 2000)
    }

    addItemToCart(product, quantity, fromPanProduct) {
        var self = this;
        var qty = quantity ? quantity : 1;
        var isNewItem = true;
        // check in list cart item
        for (let i = 0; i < this.listItemsInCart.length; i++) {
            if (this.listItemsInCart.getItem(i).productId == product.productId) {
                // if this product already in cart, update quantity
                var item = this.listItemsInCart.getItem(i);
                var itemId = this.listItemsInCart.getItem(i).productId;
                if (fromPanProduct) {
                    item.quantity = qty;
                }
                else {
                    item.quantity += qty;
                }
                isNewItem = false;
                Utils.changeQuantityOfProductInCart(item.productId, item.quantity, this.page);
                break;
            }
        }
        /**
         * Add new item
         */
        if (isNewItem) {
            product.quantity = qty;
            this.listItemsInCart.push(product);
            Utils.changeQuantityOfProductInCart(product.productId, product.quantity, this.page);
        }
        this.calcTotalPrice();
        this.showAddProductSuccessCheck();
        var listItemsInCart = {};
        for (let i = 0; i < this.listItemsInCart.length; i++) {
            listItemsInCart[this.listItemsInCart.getItem(i).productId] = this.listItemsInCart.getItem(i);
        }
        localStorage.setItem('listItemsInCart', listItemsInCart);
    }

    calcTotalPrice() {
        var totalPrice: number = 0;
        var totalPriceOld: number = this.totalPrice.value;
        for (let i = 0; i < this.listItemsInCart.length; i++) {
            totalPrice += parseFloat(this.listItemsInCart.getItem(i).productFinalPrice) * this.listItemsInCart.getItem(i).quantity;
        }
        this.totalPrice.value = (totalPrice > 0) ? Math.round(totalPrice) : 0;
        this.finalPrice.value = this.totalPrice.value;
        this.totalPrice.display = Utils.numberToFormatedString(this.totalPrice.value);
        this.finalPrice.display = Utils.numberToFormatedString(this.finalPrice.value);
        this.notifyPropertyChange('totalPrice', this.totalPrice);
        this.notifyPropertyChange('finalPrice', this.finalPrice);
    }
}