export class Order {
    public static orderType = {
        processing: {
            nameVN: 'Đang xử lí',
            nameEN: 'processing'
        },
        pending: {
            nameVN: 'Đang chờ xử lí',
            nameEN: 'pending'
        },
        canceled: {
            nameVN: 'Đang xử lí',
            nameEN: 'Đã hủy'
        },
        picking: {
            nameVN: 'Đang soạn hàng',
            nameEN: 'picking'
        },
        picked: {
            nameVN: 'Đã soạn hàng',
            nameEN: 'picked'
        },
        outOfStock: {
            nameVN: 'Hết hàng',
            nameEN: 'out of stock'
        },
        waitForShipping: {
            nameVN: 'Chờ giao hàng',
            nameEN: 'wait for shipping'
        },
        shipping: {
            nameVN: 'Đã giao hàng',
            nameEN: 'shipping'
        },
        complete: {
            nameVN: 'Giao hàng thành công',
            nameEN: 'complete'
        },
        customerCanceled: {
            nameVN: 'Yêu cầu hủy đơn hàng',
            nameEN: 'customer canceled'
        },
        shipped: {
            nameVN: 'Đã giao hàng',
            nameEN: 'shipped'
        }
    }
    public static getOrderName(orderType: string) {
        var orderName: string = '';
        for (let i in this.orderType) {
            if (this.orderType[i].nameEN == orderType) {
                orderName = this.orderType[i].nameVN;
            }
        }
        return orderName;
    }
}