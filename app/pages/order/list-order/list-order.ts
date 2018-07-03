import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { ListOrderModel } from './list-order.model';
var listOrderModel = null;
export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
	console.log("navigatingTo ListOrderModel");
	listOrderModel = new ListOrderModel(args.object);
	page.bindingContext = listOrderModel;
}

export function onLoaded(args) {
	if(listOrderModel) {
		console.log("onLoaded have listOrderModel");
		args.object.bindingContext = listOrderModel;
		listOrderModel.initActionBar();
	}
}