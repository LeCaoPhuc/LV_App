import { Observable, fromObject } from 'data/observable';
import { Utils, ParseService, Product, SliderControl, Order, ShareDataService, typeOfProduct } from '../../../shared/tools';
import { Config } from "../../../shared/env-config";
import platformModule = require('platform');
import * as colorModule from "color";
var app = require("application");
import localStorage = require("nativescript-localstorage");
var Color = colorModule.Color;
export class OrderDetailsModel extends Observable {
	private actionBarTitle;
	private order;
	private orderDetail: any;
	private screenWidth: number;
	private itemWidth = "100";
	private page: any;
	private listProduct: Array<any>;
	constructor(page) {
		super();
		this.page = page;
		this.initActionBar();
		this.listProduct = [];
		var self = this;
		setTimeout(function () {
			self.initOrderDetail();
		}, 500)
		this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
		this.orderDetail = {
			totalPrice: 0,
			shippingFee: 0,
			address: ` - `,
			orderNumber: '0000',
			deliveryStatus: 'Đã đặt hàng',
			customerName: '',
			email: '',
			phoneNumber: ''
		}
	}

	initActionBar() {
		this.page.getViewById("actionBar").notify({
			eventName: "actionBarTitleNotify",
			object: this,
			eventData: Config.TITLE.ORDER_DETAILS
		});
	}

	initOrderDetail() {
		var self = this;
		ParseService.cloud('getOrderDetail', { orderId: ShareDataService.getData('currentOrderId') })
			.then((res) => {
				Utils.hideLoadingIndicator();
				var address = res.data[0].order_detail.attributes.order.attributes.delivery_address;
				self.orderDetail.totalPrice = Utils.numberToFormatedString(res.data[0].order_detail.attributes.order.attributes.total_price);
				self.orderDetail.address = `${address.street}, ${address.commune}, ${address.district}, ${address.city}`;
				self.orderDetail.orderNumber = res.data[0].order_detail.attributes.order.attributes.order_number;
				self.orderDetail.customerName = address.name;
				self.orderDetail.email = address.email;
				self.orderDetail.phoneNumber = address.telephone;
				self.orderDetail.deliveryStatus = res.data[0].order_detail.attributes.order.attributes.delivery_status == 'order' ? 'Đã đặt hàng' : 'Hoàn thành';
				for (let i in res.data) {
					let product = new Product(res.data[i].product_detail);
					product.quantity = res.data[i].order_detail.attributes.quantity_buy;
					product.productFinalPrice = res.data[i].order_detail.attributes.unit_price;
					product.productFinalPriceDisplay = Utils.numberToFormatedString(res.data[i].order_detail.attributes.unit_price);
					self.listProduct.push(product);
				}
				self.page.getViewById('lv').refresh();
				self.notifyPropertyChange('orderDetail', self.orderDetail);
			})
			.catch((err) => {
				Utils.hideLoadingIndicator();
				Utils.toastAlert('Không thể tải chi tiết đơn hàng ' + ShareDataService.getData('currentOrderId'));
				Utils.goBack();
				console.log(err);
			})
	}

	goBack() {
		Utils.goBack();
	}

	onItemLoading(args) {
		console.log("onItemLoading");
		if (app.ios) {
			args.ios.backgroundView.backgroundColor = (new Color(0.1, 0, 0, 0)).ios;
		}

	}
}
