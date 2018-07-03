import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { OrderDetailsModel } from './order-details.model';
import { Utils, ShareDataService } from '../../../shared/tools';
import * as platformModule from "platform";
var orderDetailsModel;

export function navigatingTo(args: any) {
	let page = args.object;
    orderDetailsModel = new OrderDetailsModel(page);
    page.bindingContext = orderDetailsModel;
}

export function onLoaded(args) {
    if(orderDetailsModel) {
        orderDetailsModel.initActionBar();
    }
}

export function onProductTap(args) {
    var item = args.view.bindingContext;
    ShareDataService.setData('currentItem', item);
    ShareDataService.setData('productDetailsModalType', 'view');
    Utils.showModal(args.object.page, 'shared/components/product-details-modal/product-details-modal', function (eventData, state) {
    }, true);
}