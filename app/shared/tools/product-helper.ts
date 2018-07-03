import { Observable } from "data/observable";
import { Utils, ShareDataService } from "../../shared/tools";
export const Mode = {
    MODE_ONE: 1,
    MODE_FOUR: 4,
    MODE_NINE: 9
}
export const typeOfProduct = {
    ORDER: 'order',
    FAVORITE : 'favorite'
}
export const typeOfListProduct = {
    CATEGORY_LIST : 'managementProductOfCategoryList',
    WISH_LIST: 'managementProductOfWishList',
    PROMOTION_LIST : 'managementProductOfPromotionList',
    RELATED_LIST: 'managementProductOfRelatedList',
    SEARCH_LIST: 'managementProductOfSearchList',
    REPLACE_LIST : "managementProductOfReplaceList",
    RELATED_SEARCH_LIST : 'managementProductOfRelatedSearchList',
    CHOOSE_PROMOTION_LIST : 'managementProductOfChoosePromotionList'
} 
export class  ManageDepartmentList {
    private static _indexOfDepartment = 0;
    private static _listOfDepartmentLocal = [];
    public static indexOfDepartment() {
        return this._indexOfDepartment;
    }
     public static increaseIndexOfDepartment(){
        this._indexOfDepartment++;
    }

    public static getListOfDepartmentLocal() {
        return this._listOfDepartmentLocal;
    }
    public static addListOfDepartmentLocal(typeOfCategory,valueNewDepartment){
        this._listOfDepartmentLocal.push({
            type: typeOfCategory,
            item: valueNewDepartment
        });
    }
}
export class Product  {
    public quantity = 0;
    public productFinalPrice: number;
    public productId: string;
    public productImageList = [];
    public productIsFresh: boolean;
    public productName: string;
    public productOriginalPrice: number;
    public productPercentPrice: string;
    public productOriginalPriceDisplay: string;
    public productFinalPriceDisplay : string;
    public productSKUCode : string;
    public typeOfManagementProductObject ;
    public col : number = 0;
    public enableGesture = true;
    public quantityOrder = 0;
    public itemWidth : number;
    public itemHeight : number;
    public isCheckOrder = false;
    public promotion: boolean = false;
    public showDeleteLayout : boolean;
    public description: string;
    constructor(
        product
    ) {
        console.log(product);
        if(product) {
            this.showDeleteLayout = false;
            this.productId = product.id;
            if (product.get('product')) {
                this.description = product.get('product').get('product_description');
            }
            if(product.get('product') && product.get('color') && product.get('material')) {
                this.productName = product.get('product').get('product_name') + ' - ' + product.get('material').get('material_name') + ' - ' + product.get('color').get('color_name');
            }
            if(product.get('is_fresh')) {
                this.productIsFresh = product.get('is_fresh');
            }
            else {
                this.productIsFresh = false;
            }
            this.productSKUCode = product.get('sku');
            if(product.get('promotion')) { // if have promotion 
                this.promotion = true;
                this.productOriginalPrice = product.get('price'); 
                this.productOriginalPriceDisplay = Utils.numberToFormatedString(product.get('price'));
                this.productFinalPrice = product.get('price') - (product.get('price') * product.get('promotion').get('percent'));
                this.productFinalPriceDisplay =  Utils.numberToFormatedString(parseInt(this.productFinalPrice.toString()));
            }
            else {
                this.promotion = false;
                this.productOriginalPrice = product.get('price'); 
                this.productOriginalPriceDisplay = Utils.numberToFormatedString(product.get('price'));
                this.productFinalPrice =  product.get('price')
                this.productFinalPriceDisplay =  Utils.numberToFormatedString(product.get('price'));
            }
            this.productImageList = [];
            console.log(this.productImageList.length);
            if(product.get('image')) {
                this.productImageList.push(product.get('image').url());
            }
        }
        // hard code id product favorite = product Id
    }
}

export class Shelf extends Observable {
    private isEmtyShelf: boolean = false;
    private listProductOnShelf: Array<Product> = [];
    private maxProductNumberOnShelf: number;
    private mode: number; // 1 : mode 1 , 4 : mode 4 , 9 : mode 9
    constructor(
        listProductOnShelf, 
        maxProductNumberOnShelf,
        mode) {
        super();
        this.maxProductNumberOnShelf = maxProductNumberOnShelf;
        this.listProductOnShelf = listProductOnShelf;
        this.mode = mode;
        if (listProductOnShelf.length < 1) {
            this.isEmtyShelf = true;
        }
    }
}

export class DepartmentStore extends Observable{
    private indexOfView;
    private isEmtylDepartmentStore : boolean;
    private listProductOnDepartmentStore : Array<Product> = [];
    private listShelfOnDepartmentStore : Array<Shelf> = [];
    private mode : number; // 1 : mode 1 , 4 : mode 4 , 9 : mode 9
    private productOnDepartmentStoreNumber : number;

    constructor(
        index,
        listProductOnDepartmentStore,
        maxProductNumberOnShelf,
        mode,
        typeOfProduct,
    ) {
        super();
        this.mode = mode;;
        this.indexOfView = index;
        if(listProductOnDepartmentStore.length > 0){
            for(var i = 0; i < listProductOnDepartmentStore.length; i = i+3){
                var listProduct : Array<Product> = [];
                for(var j = i ; j < i+3 ; j++){
                    if(listProductOnDepartmentStore[j]){
                        var productObj = new Product(listProductOnDepartmentStore[j])
                        listProduct.push(productObj);
                    }
                }
                var shelf = new Shelf(listProduct, 3, mode);
                this.listProductOnDepartmentStore = listProductOnDepartmentStore;
                this.listShelfOnDepartmentStore.push(shelf);
            }
        }else{
           this.listProductOnDepartmentStore = [];
           this.listShelfOnDepartmentStore = [];
        }
    }
}
/**
//mode 9

[  1   2   3 ]
[  4   5   6 ]
[  7   8   9 ]

//mode 4

[ 1  2 ]
[ 3  4 ]

 */

export const DefinePositionFourMode = {                 
    0 : { row: "0" , col : "0" , margin: "0 2 2 2" },  1 : { row: "0" , col : "1" , margin:"0 2 2 2" } ,
    2 : { row: "1" , col : "0" , margin:"2 2 0 2" } ,  3 : { row: "1" , col : "1" , margin: "2 2 0 2" }, 
}
export const DefinePositionNineMode = {                 
    0 : { row: "0" , col : "0" , margin: "0 2 2 0" },   1 : { row: "0" , col : "1" , margin: "0 2 2 2" },  2 : { row: "0" , col : "2" , margin: "0 0 2 2"},
    3 : { row: "1" , col : "0" , margin:  "2 2 2 0"},   4 : { row: "1" , col : "1" , margin: "2 2 2 2" },  5 : { row: "1" , col : "2" , margin: "2 0 2 2" },  
    6 : { row: "2" , col : "0" , margin:  "2 2 0 0"},   7 : { row: "2" , col : "1" , margin: "2 2 0 2" },  8 : { row: "2" , col : "2" , margin: "2 0 0 2", }  
}
export class DepartmentItem extends Observable {
    private departmentItemImage;
    // private departmentItemListProduct : Array<Product> = [];
    private departmentPage ;
    private styleFormat= {
        mode : 0,
        style: {},
    };
    constructor(numOfPage,
        image,productList,
        mode,
        indexOfListReponse){
        super();
        this.departmentItemImage = image;
        this.departmentPage  = numOfPage;
        this.styleFormat.mode = mode;
        if(mode == Mode.MODE_FOUR){
            this.styleFormat.style = DefinePositionFourMode[indexOfListReponse];
        }
        if(mode == Mode.MODE_NINE){
            this.styleFormat.style = DefinePositionNineMode[indexOfListReponse];
        } 
        // for(var i =0 ; i < productList.length ; i++){
        //     var product = new Product(
        //         productList[i],
        //     )
        //     this.departmentItemListProduct.push(product);
        // }
    }

}
