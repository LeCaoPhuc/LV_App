import { Observable, fromObject } from "data/observable";
import { SliderControl, sliderOfView,ShareDataService,Product, ManagementCategoryMap,typeOfListProduct, ParseService } from "../../../shared/tools";
var emtyProductData = {
            "id": "10000",
            "sku": "empty",
            "price": "0",
            "quantity": "1",
            "is_fresh": false
        };
export class DepartmentSliderModel extends Observable {
    private firstProductList ;
    private secondProductList; 
    private thirdProductList ; 
    private departmentLayout : any;
    private managementProductList : any;
    private cacheDepartmentData : any;
    private typeOfPageManagement: any;
    private managementCategoryMap = ManagementCategoryMap;
    constructor(departmentLayout){
        super();
        var productParseObj = ParseService.newObject('ProductDetail');
        var emptyProduct  = ParseService.setData(productParseObj,emtyProductData,false);
        var productArrEmpty = [];
        for(var i = 0 ; i < 9 ; i++){
            productArrEmpty.push(emptyProduct);
        }
        var departmentEmptyItem = new DepartmentSliderItem(productArrEmpty);
        this.firstProductList = departmentEmptyItem.productList;
        this.secondProductList = departmentEmptyItem.productList;
        this.thirdProductList = departmentEmptyItem.productList;
        this.departmentLayout = departmentLayout;
        
        // if(this.cacheDepartmentData[this.managementProductList.pagination.page]){
        //     this.secondProductList = this.cacheDepartmentData[this.managementProductList.pagination.page];
        // }
        // else{
        //     var departmentItem = new DepartmentSliderItem(productList.productArr);
        //     this.secondProductList = departmentItem.productList;
        //     this.cacheDepartmentData[this.managementProductList.pagination.page] = {
        //         productArr : this.secondProductList,
        //         last : productList.last
        //     };
        //     ShareDataService.setData("cacheDepartmentData", this.cacheDepartmentData);
        // }
        var self = this;
        console.log("managementProductIsCreate department");
        departmentLayout.on("managementProductIsCreate",function(typeOfPageProductList){
            self.typeOfPageManagement = typeOfPageProductList.eventData;
            self.managementProductList = ShareDataService.getData(self.typeOfPageManagement);
            console.log("managementProductIsCreate");
            departmentLayout.on("notifyFirstProductListBindingComplete", function (productList) {
                if(self.typeOfPageManagement == typeOfListProduct.CATEGORY_LIST){
                    self.cacheDepartmentData = ShareDataService.getData("cacheDepartmentData");
                    var key = self.managementCategoryMap.current().categoryId;
                    console.log("notifyfirstList");
                    // self.firstProductList = [];
                    if(self.cacheDepartmentData[key] && self.cacheDepartmentData[key][self.managementProductList.pagination.page]){
                        self.firstProductList = self.cacheDepartmentData[key][self.managementProductList.pagination.page].productArr;
                    }
                    else{
                        if(!self.cacheDepartmentData[key]){
                            self.cacheDepartmentData[key] = {};
                        }
                        var departmentItem = new DepartmentSliderItem(productList.eventData.productArr);
                        self.firstProductList = departmentItem.productList;
                        self.cacheDepartmentData[key][self.managementProductList.pagination.page] = {
                            productArr : self.firstProductList,
                            last : productList.eventData.last
                        };
                        ShareDataService.setData("cacheDepartmentData", self.cacheDepartmentData);
                    }
                }
                else{
                    self.managementProductList = ShareDataService.getData(self.typeOfPageManagement);
                    self.cacheDepartmentData = ShareDataService.getData("cacheOtherDepartmentData");
                    if(self.cacheDepartmentData && self.cacheDepartmentData[self.managementProductList.pagination.page]){
                        self.firstProductList = self.cacheDepartmentData[self.managementProductList.pagination.page].productArr;
                    }
                    else{
                        if(!self.cacheDepartmentData){
                            self.cacheDepartmentData = {};
                        }
                        var departmentItem = new DepartmentSliderItem(productList.eventData.productArr);
                        self.firstProductList = departmentItem.productList;
                        self.cacheDepartmentData[self.managementProductList.pagination.page] = {
                            productArr : self.firstProductList,
                            last : productList.eventData.last
                        };
                        ShareDataService.setData("cacheOtherDepartmentData", self.cacheDepartmentData);
                    }
                }
                self.notifyPropertyChange("firstProductList",  self.firstProductList);
            })
            var j = 0;
            departmentLayout.on("notifySecondProductListBindingComplete", function (productList) {
                if(self.typeOfPageManagement == typeOfListProduct.CATEGORY_LIST){
                    self.cacheDepartmentData = ShareDataService.getData("cacheDepartmentData");
                    var key = self.managementCategoryMap.current().categoryId;
                    console.log("notifysecondList");
                    // self.secondProductList = [];
                    if(self.cacheDepartmentData[key] && self.cacheDepartmentData[key][self.managementProductList.pagination.page]){
                        self.secondProductList = self.cacheDepartmentData[key][self.managementProductList.pagination.page].productArr;
                    }
                    else{
                        if(!self.cacheDepartmentData[key]){
                            self.cacheDepartmentData[key] = {};
                        }
                        var departmentItem = new DepartmentSliderItem(productList.eventData.productArr);
                        self.secondProductList = departmentItem.productList;
                        self.cacheDepartmentData[key][self.managementProductList.pagination.page] = {
                            productArr : self.secondProductList,
                            last : productList.eventData.last
                        };
                        ShareDataService.setData("cacheDepartmentData", self.cacheDepartmentData);
                    }
                }
                else{
                    self.managementProductList = ShareDataService.getData(self.typeOfPageManagement);
                    self.cacheDepartmentData = ShareDataService.getData("cacheOtherDepartmentData");
                    if(self.cacheDepartmentData && self.cacheDepartmentData[self.managementProductList.pagination.page]){
                        self.secondProductList = self.cacheDepartmentData[self.managementProductList.pagination.page].productArr;
                    }
                    else{
                        if(!self.cacheDepartmentData){
                            self.cacheDepartmentData = {};
                        }
                        var departmentItem = new DepartmentSliderItem(productList.eventData.productArr);
                        self.secondProductList = departmentItem.productList;
                        self.cacheDepartmentData[self.managementProductList.pagination.page] = {
                            productArr : self.secondProductList,
                            last : productList.eventData.last
                        };
                        ShareDataService.setData("cacheOtherDepartmentData", self.cacheDepartmentData);
                    }
                }
                self.notifyPropertyChange("secondProductList",  self.secondProductList);
            })
            var i =0;
            departmentLayout.on("notifyThirdProductListBindingComplete", function (productList) {
                if(self.typeOfPageManagement == typeOfListProduct.CATEGORY_LIST) {
                    self.cacheDepartmentData = ShareDataService.getData("cacheDepartmentData");
                    var key = self.managementCategoryMap.current().categoryId;
                    console.log("notifythirdList");
                    if( self.cacheDepartmentData[key] && self.cacheDepartmentData[key][self.managementProductList.pagination.page]){
                        self.thirdProductList = self.cacheDepartmentData[key][self.managementProductList.pagination.page].productArr;
                    }
                    else{
                        if(!self.cacheDepartmentData[key]){
                            self.cacheDepartmentData[key] = {};
                        }
                        var departmentItem = new DepartmentSliderItem(productList.eventData.productArr);
                        self.thirdProductList = departmentItem.productList;
                        self.cacheDepartmentData[key][self.managementProductList.pagination.page] =  {
                            productArr : self.thirdProductList,
                            last : productList.eventData.last
                        };
                        ShareDataService.setData("cacheDepartmentData", self.cacheDepartmentData);
                    }
                }
                else {
                    self.managementProductList = ShareDataService.getData(self.typeOfPageManagement);
                    self.cacheDepartmentData = ShareDataService.getData("cacheOtherDepartmentData");
                    console.log("notifythirdList");
                    if( self.cacheDepartmentData && self.cacheDepartmentData[self.managementProductList.pagination.page]){
                        self.thirdProductList = self.cacheDepartmentData[self.managementProductList.pagination.page].productArr;
                    }
                    else{
                        if(!self.cacheDepartmentData){
                            self.cacheDepartmentData= {};
                        }
                        var departmentItem = new DepartmentSliderItem(productList.eventData.productArr);
                        self.thirdProductList = departmentItem.productList;
                        self.cacheDepartmentData[self.managementProductList.pagination.page] =  {
                            productArr : self.thirdProductList,
                            last : productList.eventData.last
                        };
                        ShareDataService.setData("cacheOtherDepartmentData", self.cacheDepartmentData);
                    }
                }
                self.notifyPropertyChange("thirdProductList",  self.thirdProductList);
            })
        })
    }

    onPan(args) {
        console.log("-----------onPan");
    }
}
export class DepartmentSliderItem {
    private _productList = [];
    constructor(productList){
        var firstList = this.getFisrtList(productList);
        var secondList = this.getSecondList(productList);
        var thirdList = this.getThirdList(productList);
        this.setColForProduct(firstList);
        this.setColForProduct(secondList);
        this.setColForProduct(thirdList);
        this.productList = [
                {
                    row: "1",
                    productItems : firstList
                },
                {   
                    row: "5",
                    productItems : secondList
                },
                {
                    row: "9",
                    productItems : thirdList
                },
            ];
        console.log("department slider contructor");
    }
    get productList(){
        return this._productList
    }
    set productList(value : any){
        this._productList = value;
    }
    getFisrtList(list){
        var arr =[];
        var productParseObj = ParseService.newObject('ProductDetail');
        var emptyProduct  = ParseService.setData(productParseObj,emtyProductData,false);
        if(list.length == 0){
            for(var i = 0; i< 3; i++){
                console.log("productEmpty getFirstList");
                var product = new Product(emptyProduct);
                product.productId = null;
                var productObj  = fromObject(product);
                arr.push(productObj);
            }
            return arr;
        }
        for(var i = 0; i< 3 ; i++){
            if(i > 2){
                break;
            }
            if(!list[i]){
                var product = new Product(emptyProduct);
                product.productId = null;
                var productObj  = fromObject(product);
                arr.push(productObj); // if don't have product i then push Empty product
            }
            else{
                arr.push(list[i]);
            }
            
        }
        return arr;
    }
    getSecondList(list){
        var arr =[];
        var productParseObj = ParseService.newObject('ProductDetail');
        var emptyProduct  = ParseService.setData(productParseObj,emtyProductData,false);
        if(list.length == 0){
            for(var i = 0; i< 3; i++){
                console.log("productEmpty getSecondList");
                var product = new Product(emptyProduct);
                product.productId = null;
                var productObj  = fromObject(product);
                arr.push(productObj);
            }
            return arr;
        }
        for(var i = 3; i< 6; i++){
            if(i > 5){
                break;
            }
            if(!list[i]){
                var product = new Product(emptyProduct);
                product.productId = null;
                var productObj  = fromObject(product);
                arr.push(productObj); // if don't have product i then push Empty product
            }
            else{
                arr.push(list[i]);
            }
        }
        return arr;
    }
    getThirdList(list){
        var arr =[];
        var productParseObj = ParseService.newObject('ProductDetail');
        var emptyProduct  = ParseService.setData(productParseObj,emtyProductData,false);
        if(list.length < 7 || list.length == 0){
            for(var i = 0; i< 3; i++){
                console.log("productEmpty getThirdList");
                var product = new Product(emptyProduct);
                product.productId = null;
                var productObj  = fromObject(product);
                arr.push(productObj);
            }
            return arr;
        }
        for(var i = 6 ; i < 9 ; i++){
            if(!list[i]){
                var product = new Product(emptyProduct);
                product.productId = null;
                var productObj  = fromObject(product);
                arr.push(productObj); // if don't have product i then push Empty product
            }
            else{
               arr.push(list[i]);
            }
        }
        return arr;
    }
    setColForProduct(listproduct){
        for(var i = 0 ; i < listproduct.length ; i++){
            if(i == 0){
                    listproduct[i].col =  1;
            }
            else{
                if(i==1){
                        listproduct[i].col =  6;
                }
                else{
                        listproduct[i].col =  11;
                }
            }
        }
    }
}