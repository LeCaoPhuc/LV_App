import { EventData } from 'data/observable';
import { Observable, PropertyChangeData } from 'data/observable';
import localStorage = require("nativescript-localstorage");
import { Config } from '../../shared/env-config';
import { httpRequest, Utils,ParseService } from '../../shared/tools';
import { loadMapReady, drawMarker, selectMarkerDirection, setCameraPosition } from "../../shared/tools/map-control";

export class WarehouseInfoModel extends Observable {
    private actionBarTitle: string;
    private warehouseName: string;
    private address: string;
    private phone: string;
    private time: string;
    private latitude: number;
    private longitude: number;
    private warehouseInfo: any;
    private page;
    private tilt = 1;
    constructor(page) {
        super();
        this.page = page;
        this.page.getViewById("actionBar").notify({
            eventName: "actionBarTitleNotify",
            object: this,
            eventData: Config.TITLE.WAREHOUSE_INFO_PAGE
        });
        Utils.showLoadingIndicator();
        var self =this;
        ParseService.cloud('getShopInfo',{})
        .then((res)=>{
            self.warehouseInfo = {};
            if(res && res.success) {
                if(res.data) {
                    self.warehouseInfo.time =  res.data.get('time_open');
                    self.warehouseInfo.phone = res.data.get('shop_phone_number');
                    self.warehouseInfo.warehouseName = res.data.get('shop_name');
                    self.warehouseInfo.address = res.data.get('shop_address');
                    self.warehouseInfo.latitude = res.data.get('latitude');
                    self.warehouseInfo.longitude = res.data.get('longitude');
                    self.warehouseInfo.description = res.data.get('shop_description')
                    self.notifyPropertyChange('warehouseInfo',self.warehouseInfo);
                    drawMarker([{
                        lat: self.warehouseInfo.latitude,
                        lng: self.warehouseInfo.longitude,
                        title: self.warehouseInfo.warehouseName,
                        snippet : self.warehouseInfo.description
                    }], self.page.getViewById('mapView'));
                    Utils.hideLoadingIndicator();
                }
            }
        })
        .catch((err)=>{
            Utils.hideLoadingIndicator();
            console.log("error - catch - cloud-getShopInfo - ", err);
        })
    }

    goBack() {
        Utils.goBack();
    }

    onMapReady(args) {
        var mapView = args.object;
        var page = mapView.parent.parent;
        mapView.settings.compassEnabled = false;
        var self = this;
        mapView.tilt = 1;
        mapView.zoom = 18;
        console.log("onMapready");

    }

}