import { Component } from 'angular2/core';
import {Table, TableData, TableHeader, TableRow, DataType} from '../directives/table/table';
import {Router} from 'angular2/router';
import { BackendService } from '../services/backend';
import {AuthenticationService} from '../services/authentication';

@Component({
  templateUrl: "build/me/wishlist.html",
  directives: [Table]
})
export class WishlistComponent {
  private headers = [
    new TableHeader("name", "Name"),
    new TableHeader("description", "Description"),
    new TableHeader("link", "Link")
  ];

  private wishlist: TableRow[] = [];
  private editing: {};

  constructor(private backend: BackendService, private auth: AuthenticationService, private router: Router){
    this.wishlist = [];
    this.clearEdit();
  }

  ngOnInit() {
    if (!this.auth.currentUser()) {
      this.router.navigate(["Home"]);
      return;
    }
    this.backend.get('users', this.auth.currentUser().id)
      .then(resp => {
        resp.data.items.forEach(item => {
          var rowData = new Map<string, TableData>();
          rowData.set('id', new TableData(item.id));
          rowData.set('name', new TableData(item.name));
          rowData.set('description', new TableData(item.description));
          rowData.set('link', new TableData(item.link, DataType.Link));
          this.wishlist.push(new TableRow(rowData, (row) => this.chooseItem(row, this.wishlist)));
        });
      });
  }

  chooseItem(item: TableRow, list: TableRow[]): void{
    this.editing = {
      "id": item.get("id").format(),
      "name": item.get("name").format(),
      "description": item.get("description").format(),
      "link": item.get("link").format()
    };
  }

  clearEdit(){
    this.editing = {
      "editing": false,
      "name": "",
      "description": "",
      "link": ""
    };
  }

  save(){
    if (this.editing["id"]){
      var tmp = this.editing;
      this.backend
        .put(this.editing, "items", this.editing["id"])
        .then(resp => {
          var rowData = this.wishlist.find((val) => val.get("id").format() == tmp["id"]);
          rowData.get("name").update(tmp["name"]);
          rowData.get("description").update(tmp["description"]);
          rowData.get("link").update(tmp["link"]);
        });
    }
    else{
      this.backend
        .post(this.editing, "items")
        .then(item => {
          var rowData = new Map<string, TableData>();
          rowData.set('id', new TableData(item.id));
          rowData.set('name', new TableData(item.name));
          rowData.set('description', new TableData(item.description));
          rowData.set('link', new TableData(item.link, DataType.Link));
          this.wishlist.push(new TableRow(rowData, (row) => this.chooseItem(row, this.wishlist)));
        });
    }
    this.clearEdit();
  }
}
