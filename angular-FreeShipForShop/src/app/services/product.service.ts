import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  //unwrap the JSON from Spring Data REST _embedded entry

  private baseUrl = 'http://localhost:8080/api/products'
  private categoryUrl ='http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {
    
    //need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  //now we gonna use a method to return an observable
  //map the JSON data from SpringDataRest to product array
  getProductList(theCategoryId: number): Observable<Product[]> {
    
    //need to build URL based on category id

    const searchUrl = `${(this.baseUrl)}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }


  getProductListPaginate(thePage: number,
                        thePageSize: number,
                        theCategoryId: number): Observable<GetResponseProducts> {
    
    //need to build URL based on category id, page and size

    const searchUrl = `${(this.baseUrl)}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  searchProducts(theKeyword: string): Observable<Product[]> {
    //need to build URL based on keyword

    const searchUrl = `${(this.baseUrl)}/search/findByNameContaining?name=${theKeyword}`;
   
   return this.getProducts(searchUrl);
 }

 searchProductsPaginate(thePage: number,
                      thePageSize: number,
                      theKeyword: string): Observable<GetResponseProducts> {

//need to build URL based on keyword, page and size

const searchUrl = `${(this.baseUrl)}/search/findByNameContaining?name=${theKeyword}`
                + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
}

 private getProducts(searchUrl: string): Observable<Product[]> {
   return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
     map(response => response._embedded.products)
   );
 }

  getProductCategories(): Observable<ProductCategory[]> {
    //we will call REST API by using categoryUrl
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      
      //return maps the JSON data from Spring Data Rest to ProductCategory array
      map(response => response._embedded.productCategory)
    );
  }

}



interface GetResponseProducts{
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number, // we're not returning all elements, we'll use it for "count"
    totalPages: number,
    number: number
  }
}

//unwrap the JSON from Spring Data REST _embedded entry
interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}