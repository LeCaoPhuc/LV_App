import { Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import { DisplayActionBar, httpRequest, Utils, Product, ShareDataService, ParseService } from "../../shared/tools";
import platformModule = require("platform");
import * as colorModule from "color";
var localStorage = require("nativescript-localstorage");
var Color = colorModule.Color;
import app = require("application");
import * as utils from "utils/utils";
import { Config } from "../../shared/env-config";

export class NotificationModel extends Observable {
    private _dataItems: ObservableArray<any>;
    private isRefreshing: boolean;
    constructor(page, context) {
        super();
        this.dataItems = new ObservableArray<any>();
        this.loadListNotification();
        this.isRefreshing = false;
    }

    loadListNotification() {
        var self = this;
        Utils.showLoadingIndicator();
        ParseService.cloud('getNotifyList', {})
            .then((res) => {
                Utils.hideLoadingIndicator();
                for (let i in res.data) {
                    self.dataItems.push({
                        index: i,
                        id: res.data[i].id,
                        title: (res.data[i] && res.data[i].attributes && res.data[i].attributes.title) ? res.data[i].attributes.title : '',
                        content: (res.data[i] && res.data[i].attributes && res.data[i].attributes.content) ? res.data[i].attributes.content : '',
                        time: (res.data[i] && res.data[i].attributes && res.data[i].attributes.createdAt) ? self.parseDateTime(res.data[i].attributes.createdAt) : '',
                        viewed:  (res.data[i] && res.data[i].attributes && res.data[i].attributes.viewed) ? true : false
                    })
                }
                self.notifyPropertyChange('dataItems', self.dataItems);
            })
            .catch((err) => {
                Utils.hideLoadingIndicator();
            })
    }

    onLoaded(args) {

    }

    parseDateTime(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;
        return `${day}/${month}/${year}`;
    }

    onItemTap(args) {
        try {
            var itemSelectedData = args.view.bindingContext;
            args.view.bindingContext.viewed = true;
            args.object.refresh()
            this.notifyPropertyChange('dataItems',  this._dataItems);
            ParseService.cloud('viewNotify', {
                 id : itemSelectedData.id
             })
            .then(function(res){
                console.log('view notify succees');
            })
            .catch(function(err){
                console.log('err');
            })
            
            Utils.alert('info', itemSelectedData.title, `${itemSelectedData.content}\nNgày nhận: ${itemSelectedData.time}`, 'Đóng')
        }
        catch (ex) {
            Utils.toastAlert("Thông báo này đã bị xóa");
        }
    }

    onPullToRefreshInitiated(args) {
        var self = this;
        var listView = args.object;
        if (this.isRefreshing) {
            return;
        }
        else {
            this.isRefreshing = true;
        }
        ParseService.cloud('getNotifyList', {})
            .then((res) => {
                self.dataItems = new ObservableArray();
                for (let i in res.data) {
                    self.dataItems.push({
                        id: res.data[i].id,
                        title: (res.data[i] && res.data[i].attributes && res.data[i].attributes.title) ? res.data[i].attributes.title : '',
                        content: (res.data[i] && res.data[i].attributes && res.data[i].attributes.content) ? res.data[i].attributes.content : '',
                        time: (res.data[i] && res.data[i].attributes && res.data[i].attributes.createdAt) ? self.parseDateTime(res.data[i].attributes.createdAt) : '';
                        viewed: (res.data[i] && res.data[i].attributes && res.data[i].attributes.viewed) ? true : false
                    });
                }
                self.isRefreshing = false;
                listView.notifyPullToRefreshFinished();
                self.notifyPropertyChange('dataItems', self.dataItems);
            })
            .catch((err) => {
                self.isRefreshing = false;
                listView.notifyPullToRefreshFinished();
                console.log(err);
            })

    }

    goBack() {
        Utils.goBack();
    }

    get dataItems() {
        return this._dataItems;
    }

    set dataItems(dataItems) {
        this._dataItems = dataItems;
    }
}
