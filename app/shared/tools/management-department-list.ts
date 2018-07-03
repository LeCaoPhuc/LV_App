import { Pagination, SliderControl ,sliderOfView  } from  "./";
import { Product, DepartmentStore, DepartmentItem, Mode,ManageDepartmentList,Utils,ShareDataService } from "./";
import { MockDataProduct} from "../../pages/product-list/mock-data-product";
export class ManagementDepartmentItem {

    private paginationFourMode : Pagination;
    private paginationNineMode : Pagination;
    private departmentItems ;
    private typeOfPage : any;
    private page: any;
    constructor(
        page,
        paginationFourMode,
        paginationNineMode,
    ){
        this.page = page;
        this.paginationFourMode = paginationFourMode;
        this.paginationNineMode = paginationNineMode;
    }
     getDepartmentItemOfCurrentSlide(mode){
        var currentDepartment ;
        if(mode == Mode.MODE_FOUR){
            if(SliderControl.sliderCenterModal.id == "firstSlider"){
                currentDepartment = "firstFourScreen";
            }else{
                if(SliderControl.sliderCenterModal.id =="secondSlider"){
                        currentDepartment = "secondFourScreen";
                    }else{
                        currentDepartment = "thirdFourScreen";
                    }
            }
        }else{
            if(SliderControl.sliderCenterModal.id == "firstSlider"){
                currentDepartment = "firstNineScreen";
            }else{
                if(SliderControl.sliderCenterModal.id =="secondSlider"){
                        currentDepartment = "secondNineScreen";
                    }else{
                        currentDepartment = "thirdNineScreen";
                    }
            }
        }
        return currentDepartment;
    }   
    initDepartmentStoreList(mode) {
        var self = this;
        var pagination;
        return new Promise(function(resolve,reject){
            // self.pagination.page = 0;
            if(mode == Mode.MODE_FOUR){
                 pagination = self.paginationFourMode;
            }
            if(mode == Mode.MODE_NINE){
                 pagination = self.paginationNineMode;
            } 
            pagination.getPage(pagination.page)
            .then((response)=>{
                if(response && response.statusCode == 200){
                    var res = response.content.toJSON();
                    if(res.data && res.data.length > 0){
                        Utils.hideLoadingIndicator();
                        self.departmentItems = new Array<DepartmentItem>();
                        for (var i = 0; i < res.data.length; i++) {
                            var departmentItem = new DepartmentItem(res.data[i].page,res.data[i].image,res.data[i].products,mode,i)
                            self.departmentItems.push(departmentItem);
                        }
                        resolve({
                            departmentItems : self.departmentItems,
                            lastPage: res.last
                        });
                    }
                    else{
                        Utils.hideLoadingIndicator();
                        resolve({
                            departmentItems : [],
                            lastPage: true
                        });
                    }
                }
                else{
                    Utils.hideLoadingIndicator();
                    resolve({
                        departmentItems : [],
                        lastPage: true
                    });
                    console.log("err- initDepartmentStoreList- statuscode != 200 management-department-list ");
                }
            })
            .catch((err)=>{
                Utils.hideLoadingIndicator();
                console.log("Err - initDepartmentStoreList - management-department-list "+ err);
                reject(err);
            })
        })
    }
    onPanSlider(args,mode,lastPage){
        var self = this;
        var pagination;
         if(mode == Mode.MODE_FOUR){
            pagination = self.paginationFourMode;
        }
        if(mode == Mode.MODE_NINE){
            pagination = self.paginationNineMode;
        } 
        SliderControl.onPanSliderOnModal(args, pagination.page-1,lastPage,function(id,delta){
            var departmentId ;
            if(mode == Mode.MODE_NINE){
                if(id=="firstSlider"){ 
                    departmentId = "firstNineScreen";
                }else{
                    if(id=="secondSlider"){
                        departmentId = "secondNineScreen";
                    }else{
                        departmentId = "thirdNineScreen";
                    }
                }
            }
            if(mode == Mode.MODE_FOUR){
                if(id=="firstSlider"){ 
                    departmentId = "firstFourScreen";
                }else{
                    if(id=="secondSlider"){
                        departmentId = "secondFourScreen";
                    }else{
                        departmentId = "thirdFourScreen";
                    }
                }
            }
            
            if(delta < 0) { //slide from right -> left
                self.loadNewData(self.page,departmentId,"next",mode);
            }else{
                self.loadNewData(self.page,departmentId,"previous",mode);
            }      
        })
    }
    resetSliderControlForModal(){
           SliderControl.resetLayout(this.page.getViewById("firstSlider"),this.page.getViewById("secondSlider"),this.page.getViewById("thirdSlider"),sliderOfView.MODAL);
    }
    initSliderControlForModal(){
        SliderControl.setFirstSliderPosition(this.page.getViewById("firstSlider"),sliderOfView.MODAL);
        SliderControl.setSecondtSliderPosition(this.page.getViewById("secondSlider"),sliderOfView.MODAL)
        SliderControl.setThirdSliderPosition(this.page.getViewById("thirdSlider"),sliderOfView.MODAL);
    }
    loadNewData(page,departmentId,state,mode){
        var self = this;
        var modeOfBinding = "";
        if(mode == Mode.MODE_FOUR){
            modeOfBinding = "notifyBindingFourScreenDepartment";
        }
        if(mode == Mode.MODE_NINE){
            modeOfBinding = "notifyBindingNineScreenDepartment";
        }
        if(state=="next"){
            self.initNextPageProductList(mode)
            .then((response: any)=>{
                    page.removeEventListener(modeOfBinding);
                    ShareDataService.setData("lastPageModal", response.lastPage );
                    page.getViewById(departmentId).notify({
                        eventName: modeOfBinding,
                        object : this,
                        eventData : response.departmentItems
                    })
                    page.getViewById(departmentId).visibility = "visible";
                    Utils.hideLoadingIndicator();
            })
            .catch((err)=>{
                Utils.hideLoadingIndicator();
                Utils.toastAlert("Có lỗi xảy ra khi tải dữ liệu");
                console.log("Error - management-department-list.model.ts - loadNewData: ", err);
            })
        }else{
            self.initPreviousProductList(mode)
            .then((response : any)=>{
                    console.log("loadNewData Next then");
                    page.removeEventListener(modeOfBinding);
                    ShareDataService.setData("lastPageModal", response.lastPage );
                    page.getViewById(departmentId).notify({
                        eventName: modeOfBinding,
                        object : this,
                        eventData : response.departmentItems
                    })
                    page.getViewById(departmentId).visibility = "visible";
                    Utils.hideLoadingIndicator();
            })
            .catch((err)=>{
                console.log("loadNewData Next catch",err);
                Utils.hideLoadingIndicator();
                Utils.toastAlert("Có lỗi xảy ra khi tải dữ liệu");
                console.log("Error - management-department-list.model.ts - loadNewData: ", err);
            })
        }   
    }
    initNextPageProductList(mode){
        var self = this;
        var pagination;
        return new Promise(function(resolve,reject){
            // self.pagination.page = 0;
            if(mode == Mode.MODE_FOUR){
                 pagination = self.paginationFourMode;
            }
            if(mode == Mode.MODE_NINE){
                 pagination = self.paginationNineMode;
            } 
            console.log("initNextPageProductList")
            pagination.nextPage()
            .then((response: any)=>{
                if(response && response.statusCode == 200){
                    console.log("Then initNextPageProductList")
                    var res = response.content.toJSON();
                    if(res.data && res.data.length > 0){
                        self.departmentItems = new Array<DepartmentItem>();
                        for (var i = 0; i < res.data.length; i++) {
                            var departmentItem = new DepartmentItem(res.data[i].page,res.data[i].image,res.data[i].products,mode,i)
                            self.departmentItems.push(departmentItem);
                        }
                        resolve({
                            departmentItems : self.departmentItems,
                            lastPage: res.last
                        });
                    }
                    else{
                        resolve({
                            departmentItems : [],
                            lastPage: true
                        });
                    }
                }
                else{
                    Utils.hideLoadingIndicator();
                    console.log("err- initNextPageProductList- statuscode != 200 management-department-list ");
                    resolve({
                        departmentItems : [],
                        lastPage: true
                    });
                }
                
            })
            .catch((err)=>{
                console.log("Error initNextPageProductList management-department-list ",err);
                Utils.hideLoadingIndicator();
                reject(err);
            })
        })
    }
    initPreviousProductList(mode){
        var self = this;
        var pagination;
        return new Promise(function(resolve,reject){
            // self.pagination.page = 0;
            if(mode == Mode.MODE_FOUR){
                 pagination = self.paginationFourMode;
            }
            if(mode == Mode.MODE_NINE){
                 pagination = self.paginationNineMode;
            } 
            pagination.prevPage()
            .then((response)=>{
                if(response && response.statusCode == 200){
                    var res = response.content.toJSON();
                    if(res.data && res.data.length > 0){
                        self.departmentItems = new Array<DepartmentItem>();
                        for (var i = 0; i < res.data.length; i++) {
                            var departmentItem = new DepartmentItem(res.data[i].page,res.data[i].image,res.data[i].products,mode,i)
                            self.departmentItems.push(departmentItem);
                        }
                        resolve({
                            departmentItems : self.departmentItems,
                            lastPage: res.last
                        });
                    }
                    else{
                        resolve({
                            departmentItems : [],
                            lastPage: true
                        });
                    }
                }
                else{
                    Utils.hideLoadingIndicator();
                    console.log("err- initPreviousProductList- statuscode != 200 management-department-list ");
                    resolve({
                        departmentItems : [],
                        lastPage: true
                    });
                }
            })
            .catch((err)=>{
                console.log("Err initPreviousProductList management-department-list "+ err);
                reject(err);
            })
        })
    }
} 