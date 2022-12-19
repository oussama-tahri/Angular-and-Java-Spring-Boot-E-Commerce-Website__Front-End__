import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  //value is the keyword that the user entered
  doSearch(value: string){
    //we will use console.log so we can look at it for debugging purposes if we need it
    console.log(`value=${value}`);
    //we will route the data to our "search" route
    //it will be handled by the ProductListComponent
    this.router.navigateByUrl(`/search/${value}`);
  }
}
