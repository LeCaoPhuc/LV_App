import { httpRequest } from './http';
export class Pagination {
  private _mode: string;
  private _getData: Function;
  private _search: Function;
  private _searchData: any;
  private _filter: Function;
  private _filterData: any;
  private _page: number = 1;
  private _perPage: number = 10;
  private _skipMore: number = 0;
  private _step : number = 1;
  private _numOfPage: number = 0;
  private _numOfRecord: number = 0;
  private _getNumOfPage: Function;
  private _data: any;
  private _loading: boolean = false;
  get mode(): string{
    return this._mode;
  }
  set mode(mode: string){
    this._mode = mode;
  }
  get getData(): Function {
    return this._getData;
  }
  set getData(getData: Function) {
    this._getData = getData;
  }
  get search(): Function {
    return this._search;
  }
  set search(search: Function) {
    this._search = search;
  }
  get searchData(): any {
    return this._searchData;
  }
  set searchData(searchData: any) {
    this._searchData = searchData;
  }
  get filter(): Function {
    return this._filter;
  }
  set filter(filter: Function) {
    this._filter = filter;
  }
  get filterData(): any {
    return this._filterData;
  }
  set filterData(filterData: any) {
    this._filterData = filterData;
  }
  get page() {
    return this._page;
  }
  set page(value: any) {
    this._page = value;
  }
  get perPage() {
    return this._perPage;
  }
  set perPage(value: any) {
    this._perPage = value;
    this.numOfPage = Math.ceil(this.numOfRecord / this.perPage);
  }
  get skipMore() {
    return this._skipMore;
  }
  set skipMore(value: any) {
    this._skipMore = value;
  }
   get step() {
    return this._step;
  }
  set step(value: any) {
    this._step = value;
  }
  get numOfPage() {
    return this._numOfPage;
  }
  set numOfPage(value: any) {
    this._numOfPage = value;
  }
  get getNumOfPage() {
    return this._getNumOfPage;
  }
  set getNumOfPage(value: any) {
    this._getNumOfPage = value;
  }
  get numOfRecord() {
    return this._numOfRecord;
  }
  set numOfRecord(value: any) {
    this._numOfRecord = value;
    this.numOfPage = Math.ceil(this.numOfRecord / this.perPage);
  }
  get data() {
    return this._data;
  }
  set data(value: any) {
    this._data = value;
  }
  get loading() {
    return this._loading;
  }
  set loading(value: any) {
    this._loading = value;
  }
  constructor(getData?: Function, getNumOfPage?: Function, page?: number, perPage?: number) {
    var self = this;
    this.getData = getData;
    if (page) this.page = page;
    else this.page = 1;
    if (perPage) this.perPage = perPage;
    else this.perPage = 10;
    if(getNumOfPage){
      this.getNumOfPage = getNumOfPage;
      this.executeGetNumOfPage();
    }
  }
  private executeGetData(): Promise<any> {
    this._mode = 'getData';
    var self = this;
    return new Promise(function (resolve: any, reject: any) {
      self.getData(self.page, self.perPage).then(function (data: any) {
        self.data = data;
        resolve(data);
      }).catch(function (err: any) {
        reject(err);
      })
    })
  }
  private executeSearch(data ?: any): Promise<any> {
    this._mode = 'search';
    if(data) this.searchData = data;
    var self = this;
    return new Promise(function (resolve: any, reject: any) {
      self.search(self.page, self.perPage, self.searchData).then(function (data: any) {
        self.data = data;
        resolve(data);
      }).catch(function (err: any) {
        reject(err);
      })
    })
  }
  private executeFilter(data ?: any): Promise<any> {
    this._mode = 'filter';
    if(data) this.filterData = data;
    var self = this;
    return new Promise(function (resolve: any, reject: any) {
      self.filter(self.page, self.perPage, self.filterData).then(function (data: any) {
        self.data = data;
        resolve(data);
      }).catch(function (err: any) {
        reject(err);
      })
    })
  }
  public executeGetNumOfPage(callback?: Function) {
    var self = this;
    this.getNumOfPage().then(function (count: number) {
      self.numOfRecord = count;
      self.numOfPage = Math.ceil(count / self.perPage);
      if (callback) callback();
    }).catch(function (err: any) {
      console.log(err);
    })
  }
  private getStartByPage(page?: number) {
    if (page) {
      return (page - 1) * this.perPage;
    } else {
      return (this.page - 1) * this.perPage;
    }
  }
  private executeData(data ?: any){
    if(this.loading) return new Promise(function(resolve, reject){
      resolve(null);
    });
    switch (this._mode) {
      case 'getData': {
        return this.executeGetData();
      }
      case 'search': {
        return this.executeSearch(data);
      }
      case 'filter': {
        return this.executeFilter(data);
      }
      default: {
        return this.executeGetData();
      }
    }
  }
  public getPage(page: number, data ?: any) {
    this.page = page;
    return this.executeData(data);
  }
  public nextPage(data ?: any) {
    this.page += this.step;
    return this.executeData(data);
  }
  public prevPage(data ?: any) {
    this.page -= this.step;
    return this.executeData(data);
  }
  public firstPage(data ?: any) {
    this.page = 1;
    return this.executeData(data);
  }
  public lastPage(data ?: any) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.executeGetNumOfPage(function () {
        self.page = self.numOfPage;
        resolve(self.executeData(data));
      });
    })
  }
}