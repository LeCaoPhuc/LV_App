import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable } from "data/observable";
import { httpRequest, Utils, DisplayActionBar,ShareDataService,ManagementCategoryMap,DataAPIServiceOfCategory } from "../../shared/tools";
import { RadSideDrawer } from "nativescript-telerik-ui/sidedrawer";
import platformModule = require('platform');
import { Config } from "../../shared/env-config";
var frames = require("ui/frame");
var app = require("application");
var localStorage = require("nativescript-localstorage");
var managementCategoryMap = ManagementCategoryMap;
export class SubCategoryModel extends Observable{
    private displayActionBar = new DisplayActionBar(2);
    private categoryInfo : any;
    private _dataItems: ObservableArray<any>;
    private isTapSubCategory = false;
    private isTapHome = false;
    private screenWidth: number;
    user = {
        firstName: '',
        lastName: '',
        image: ''
    }
    private mockDataSubCategory = [
        {
            id: 101,
            name: "Sản phẩm cho bé"
        },
        {
            id: 201,
            name: "Sản phẩm khuyến mãi"
        },
        {
            id: 301,
            name: "Chăm sóc sức khỏe và sắc đẹp"
        },
        {
            id: 401,
            name: "Hóa phẩm sản phẩm vệ sinh"
        },
        {
            id: 501,
            name: "Hóa phẩm hóa học"
        },
    ];

    constructor(page,categoryInfo){
        super();
        this.user.firstName = localStorage.getItem("userInfo").firstName;
        this.user.lastName = localStorage.getItem("userInfo").lastName;
        this.user.image = localStorage.getItem("userInfo").avatar;
        this.categoryInfo = categoryInfo;
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        // this.displayActionBar.titleActionBar = categoryInfo.categoryName ;
        // this.notifyPropertyChange("displayActionBar.titleActionBar",this.displayActionBar.titleActionBar);
        page.getViewById("actionBar").notify({
            eventName: "actionBarTitleNotify",
            object: this,
            eventData: categoryInfo.categoryName
        });
        this.initDataItemsFromLocalData(categoryInfo.categoryId);
    }
    get dataItems(){
        return this._dataItems;
    }
    initDataItems(categoryId){
        var self = this;
        this._dataItems = new ObservableArray<SubCategory>();
        Utils.showLoadingIndicator();
        var url = "scanngo_v1/category?page=1&per_page=10&parent_category_id="+ categoryId; 
        httpRequest.get(url,localStorage.getItem("accessToken"))
            .then((res: any)=>{
                if(res && res.statusCode == 200){
                    var results = res.content.toJSON();
                    if(results && results.data.length > 0){
                        for(var i = 0 ; i< results.data.length ; i++){
                            var subCategory = new SubCategory(i,results.data[i].id,results.data[i].name);
                            self._dataItems.push(subCategory);
                        }
                    }
                    else{
                        for(var i = 0 ; i < this.mockDataSubCategory.length ; i++){
                            var subCategory = new SubCategory(i,self.mockDataSubCategory[i].id,self.mockDataSubCategory[i].name);
                            self._dataItems.push(subCategory);
                        }
                    }    
                    Utils.hideLoadingIndicator();
                    self.notifyPropertyChange("_dataItems",self._dataItems);
                }
                else{
                    Utils.hideLoadingIndicator();
                    Utils.toastAlert("Có lỗi khi tải dữ liệu");
                }
            })
            .catch((err)=>{
                Utils.hideLoadingIndicator();
                Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
                console.log("Err initDataItems - sub-caterory.mode.ts :" + err);
            })
       
    }

    initDataItemsFromLocalData(categoryId){
        if(ManagementCategoryMap.getSubCategoryWithCategoryId && ManagementCategoryMap.getSubCategoryWithCategoryId(categoryId)){
            this._dataItems = new ObservableArray<SubCategory>();
            var subCategoryList = ManagementCategoryMap.getSubCategoryWithCategoryId(categoryId);
            for(var i = 0 ; i< subCategoryList.length; i++){
                    var subCategory = new SubCategory(i,subCategoryList[i].id,subCategoryList[i].name);
                    this._dataItems.push(subCategory);
            }
            this.notifyPropertyChange("_dataItems",this._dataItems); 
        }
    }
    tapSubCategoryItem(args){
        if(this.isTapSubCategory){
            return;
        }
        this.isTapSubCategory = true;
        Utils.showLoadingIndicator();
        var subCategoryInfo = {
        nameCategory: "",
        nameSubCategory: "",
        idSubCategory: "",
        isNavigate : true, // support for fix bug goback check in product-list.ts onLoaded
        }
        if(app.ios){
            subCategoryInfo.nameCategory = this.categoryInfo.categoryName;
            subCategoryInfo.nameSubCategory = args.view.nameSubCategory;
            subCategoryInfo.idSubCategory = args.view.idSubCategory;
            console.log("tap suncategory ios : " + args.view.idSubCategory);
        
        }else{
            subCategoryInfo.nameCategory = this.categoryInfo.categoryName;
            subCategoryInfo.nameSubCategory = args.object.getSelectedItems()[0].subCategoryName;
            subCategoryInfo.idSubCategory = args.object.getSelectedItems()[0].subCategoryId;
            console.log("tapCategoryItem : " + args.object.getSelectedItems()[0].subCategoryId);
        }
        ShareDataService.setData("currentCategory", this.categoryInfo);
        ShareDataService.setData("currentSubCategoryInfo", subCategoryInfo);
        managementCategoryMap.init( this.categoryInfo.categoryId,subCategoryInfo.idSubCategory);
        var manamentGetDataAPI = new DataAPIServiceOfCategory();
        setTimeout(function() {
            frames.topmost().navigate({
                moduleName: "pages/product-list/product-list",
                context: subCategoryInfo,
                animated: false,
                clearHistory: false
            });
        }, 100);
        this.isTapSubCategory = false;
        
    }
    openSideBar() {
        let sideDrawer: RadSideDrawer = <RadSideDrawer>(frames.topmost().getViewById("sideBar"));
        sideDrawer.gesturesEnabled = true;
        sideDrawer.showDrawer();
    }
    onItemLoading(args){
        if(app.ios){
            args.ios.selectionStyle = UITableViewCellSelectionStyle.None;
        } 
    }
    onTapMenuHome(args){
        if(this.isTapHome){
            return ;
        }
        this.isTapHome = true;
        Utils.goBack();
        // Utils.navigate("pages/home-page/home-page",true);
        this.isTapHome = false;
        
    }
}
class SubCategory{
    private index;
    private subCategoryId;
    private subCategoryName;
    constructor(index,subCategoryId,subCategoryName){
        this.index = index;
        this.subCategoryId = subCategoryId;
        this.subCategoryName = subCategoryName;
    }

}