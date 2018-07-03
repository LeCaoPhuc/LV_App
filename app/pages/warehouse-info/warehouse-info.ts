import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { WarehouseInfoModel } from './warehouse-info.model';
import { Config } from '../../shared/env-config';
import { loadMapReady, drawMarker, selectMarkerDirection, setCameraPosition } from "../../shared/tools/map-control";
var warehouseInfoModel;
export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
	warehouseInfoModel  = new WarehouseInfoModel(args.object);
	page.bindingContext = warehouseInfoModel;
}

export function onLoaded(args) {
	args.object.bindingContext = warehouseInfoModel;
	args.object.getViewById("actionBar").notify({
		eventName: "actionBarTitleNotify",
		object: this,
		eventData: Config.TITLE.WAREHOUSE_INFO_PAGE
	});
}