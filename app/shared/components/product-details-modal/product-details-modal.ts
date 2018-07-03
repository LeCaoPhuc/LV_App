import { EventData } from 'data/observable';
import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import * as htmlViewModule from "tns-core-modules/ui/html-view";
import * as LabelModule from "tns-core-modules/ui/label";
import localStorage = require("nativescript-localstorage");
import { Config } from '../../env-config';
import { Utils, ShareDataService, httpRequest, Product } from '../../tools';
import platformModule = require("platform");
import app = require('application');
var page: pages.Page;
var context: any;
var closeCallback: Function;
var item: any;
var productDetailsModal: any;
Utils.transparentModalIOS();

export function onLoaded(args: observable.EventData) {
    page = <pages.Page>args.object;
    productDetailsModal = new ProductDetailsModal(ShareDataService.getData('currentItem'))
    page.bindingContext = productDetailsModal;
}

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;
}

export function goBack() {
    closeCallback();
}

export class ProductDetailsModal extends observable.Observable {
    private screenWidth: any;
    private screenHeight: any;
    private product: any; // data item
    private quantity: number;
    private totalPrice: any;
    private finalPrice: any;
    private interval: any;
    private isShowOriginalPrice: boolean;
    private minQuantity: number;
    private labelButtonConfirm: string;
    constructor(product) {
        super();
        this.product = product;
        this.loadDetails();
    }

    loadDetails() {
        try {
            if (this.product) {
                if (!this.product.quantity) {
                    this.labelButtonConfirm = 'Thêm vào giỏ hàng';
                    this.quantity = 1;
                }
                else {
                    this.labelButtonConfirm = 'Cập nhật giỏ hàng';
                    this.quantity = this.product.quantity;
                }
                this.minQuantity = this.product.productIsFresh ? 0.1 : 1;
                this.finalPrice = {
                    value: this.product.productFinalPrice,
                    display: this.product.productFinalPriceDisplay
                };
                this.isShowOriginalPrice = this.product.productFinalPrice != this.product.productOriginalPrice;
                this.totalPrice = Utils.assign(this.finalPrice);
                this.notifyPropertyChange('finalPrice', this.finalPrice);
                this.notifyPropertyChange('totalPrice', this.totalPrice);
                this.notifyPropertyChange('quantity', this.quantity);
                this.calcPrice();
            }
            else {
                console.log('loadDetails -- Error');
            }
        } catch (error) {
            console.log('ProductDetails --- loadDetails func --- Error: ', error);
        }
        
    }

    callAPIToGetProductDetails() {
        var self = this;
        if (!Utils.checkInternetConnection()) {
            return;
        }
    }

    onTapPlusButton() {
        this.quantity = Math.round((this.quantity + this.minQuantity) * 1000) / 1000;
        this.notifyPropertyChange('quantity', this.quantity);
        this.calcPrice();
    }

    onTapMinusButton() {
        if (this.quantity == 1) return;
        this.quantity = Math.round((this.quantity - this.minQuantity) * 1000) / 1000;
        this.notifyPropertyChange('quantity', this.quantity);
        this.calcPrice();
    }

    onTouchChangeQuantityButton(args) {
        var self = this;
        if (args.action == "down") {
            var typeButton = args.object.typeButton;
            switch (typeButton) {
                case 'plus':
                    this.interval = setInterval(() => {
                        this.onTapPlusButton();
                    }, 200);
                    break;
                case 'minius':
                    this.interval = setInterval(() => {
                        this.onTapMinusButton();
                    }, 200);
                    break;
                default:
                    break;
            }
        }
        else if (args.action == "up" || args.action == "cancel") {
            clearInterval(this.interval);
            this.calcPrice();
        }
    }

    calcPrice() {
        this.totalPrice.value = this.finalPrice.value * this.quantity;
        console.log(this.totalPrice.value)
        this.totalPrice.display = Utils.numberToFormatedString(this.totalPrice.value);
        this.notifyPropertyChange('totalPrice', this.totalPrice);
    }

    onAddToCartTap() {
        console.log('onAddToCartTap');
        var eventData = {
            product: this.product,
            quantity: this.quantity,
        }
        closeCallback(eventData, "add");
    }
}



