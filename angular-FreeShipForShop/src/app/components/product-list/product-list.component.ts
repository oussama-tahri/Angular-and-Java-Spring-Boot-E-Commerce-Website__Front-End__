import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
 // templateUrl: './product-list.component.html',

  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number =1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;


  thePreviousKeyword: string = "";
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() =>{
    this.listProducts();
    });
  }
 
  listProducts(){
    //we're gonna check if the route has a parameter of keyword
    //keyword came from the path in app.module.ts
    //keyword passed in from the value given in SearchComponent
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
    this.handleListProducts();
    }
      
  
  }

    handleSearchProducts(){
      const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
      
      // if we have a different keyword than previous
      // set thePageNumber to 1

      if(this.thePreviousKeyword != theKeyword){
        this.thePageNumber = 1;
      }
      
      this.thePreviousKeyword = theKeyword;
      console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

      // now search for the products using keyword
      this.productService.searchProductsPaginate(this.thePageNumber -1,
                                                  this.thePageSize,
                                                  theKeyword).subscribe(this.processResult());
  }

  handleListProducts(){
     //check if "id" parameter is available
     const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
     // get the "id" param string, convert string to number using "+"
     if(hasCategoryId){
       this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
     }
     else{
       // not category id available
       //default to category id 1
       this.currentCategoryId = 1; 
     }
 
     //
     // check if we have a different category id than previous
     // Angular will reuse a component if it's currently being viewed

     // if we have a different category id than previous
     // then set thePageNumber back to 1
     if (this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
     }

     this.previousCategoryId = this.currentCategoryId;
     console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber${this.thePageNumber}`);

     this.productService.getProductListPaginate(this.thePageNumber -1 , //angular 1 based and spring 0 based
                                                this.thePageSize,
                                                this.currentCategoryId).subscribe(
                                                  data =>{
                                                    this.products = data._embedded.products;
                                                    this.thePageNumber = data.page.number + 1;//angular 1 based and spring 0 based
                                                    this.thePageSize = data.page.size;
                                                    this.theTotalElements = data.page.totalElements;
                                                  }
                                                );

  }

  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return (data: any) =>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number +1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
}
