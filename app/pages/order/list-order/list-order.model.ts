import { Observable } from 'data/observable';
import { Utils, httpRequest, Order, ParseService, ShareDataService } from '../../../shared/tools';
import frames = require("ui/frame");
import statusBar = require("nativescript-status-bar");
import platformModule = require('platform');
import app = require("application");
import * as dialogs from "ui/dialogs";
import { Config } from "../../../shared/env-config";

export class ListOrderModel extends Observable {
    private actionBarTitle: string;
    private listOrder: Array<any>;
    private isEmptyProductList: boolean;
    private page: any;
    private isTapOrderListItem: boolean;
    constructor(page) {
        super();
        this.page = page;
        this.isTapOrderListItem = false;
        this.isEmptyProductList = false;
        this.listOrder = [];
        this.initActionBar();
        this.initOrderList();
    }

    initActionBar() {
        var listOrderType = ShareDataService.getData('listOrderType');
        switch (listOrderType) {
            case 'history':
                this.page.getViewById("actionBar").notify({
                    eventName: "actionBarTitleNotify",
                    object: this,
                    eventData: Config.TITLE.ORDER_HISTORY_PAGE
                });
                break;
            case 'check':
                this.page.getViewById("actionBar").notify({
                    eventName: "actionBarTitleNotify",
                    object: this,
                    eventData: Config.TITLE.CHECK_ORDER_PAGE
                });
                break;
            default:
                break;
        }
    }

    initOrderList() {
        var self = this;
        Utils.showLoadingIndicator();
        ParseService.cloud('getOrderList', { type: ShareDataService.getData('listOrderType') == 'history' ? 'bill' : 'order' })
            .then((res) => {
                Utils.hideLoadingIndicator();
                if (res.data.length) {
                    for (let i in res.data) {
                        if (res.data[i] && res.data[i].attributes) {
                            self.listOrder.push(self.parseOrder(res.data[i]));
                        }
                    }
                }
                else {
                    self.isEmptyProductList = true;
                }
                self.notifyPropertyChange('listOrder', self.listOrder);
                console.log(self.listOrder.length);
                self.page.getViewById('lv').refresh();
            })
            .catch((err) => {
                Utils.hideLoadingIndicator();
                console.log(err)
            })
        this.notifyPropertyChange('actionBarTitle', this.actionBarTitle);
    }

    parseOrder(order: any) {
        var orderData = order.attributes;
        return {
            orderId: order.id,
            orderNumber: orderData.order_number,
            name: orderData.delivery_address.name,
            telephone: orderData.delivery_address.telephone,
            address: `${orderData.delivery_address.street}, ${orderData.delivery_address.commune}, ${orderData.delivery_address.district}, ${orderData.delivery_address.city}`,
            totalPrice: Utils.numberToFormatedString(orderData.total_price),
            timeOrder: `${orderData.createdAt.getDate()}/${orderData.createdAt.getMonth() + 1}/${orderData.createdAt.getFullYear()}`
        }
    }

    onListOrderTap(args) {
        console.log("onListOrderTap");
        Utils.showLoadingIndicator();
        ShareDataService.setData('currentOrderId', this.listOrder[args.index].orderId)
        Utils.navigate('pages/order/order-details/order-details');
    }

    goBack() {
        Utils.goBack();
    }
}