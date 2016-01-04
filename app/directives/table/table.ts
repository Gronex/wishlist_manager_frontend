import {Component, Input} from 'angular2/core';
import {NgClass} from 'angular2/common';

export class TableHeader {
  private identifier: string;
  private text: string;

  constructor(identifier: string, text: string) {
    this.identifier = identifier;
    this.text = text;
  }
}

export enum DataType {
  Text,
  Link,
  WarningButton
}

export class TableRow {

  constructor(private data: Map<string, TableData>, private link?: (row: TableRow) => void){
    this.link = link;
    this.data = data;
  }

  get(key: string): TableData {
    return this.data.get(key);
  }

  onClick(){
    if (this.link) this.link(this);
  }
}


export class TableData {
  private data: any;
  private onClick: () => any;
  private type: DataType;

  constructor(data: any, type?: DataType, onClick?: () => any){
    if (!type) this.type = DataType.Text;
    else this.type = type;

//FIXME: onClick is undefined
    if (type == DataType.Link && !onClick){
      console.log("hello")
      this.onClick = () => data.toString();
    }
    else{
      this.onClick = onClick;
    }
    console.log(onClick);
    this.data = data;
  }

  format(): string {
    if (this.data instanceof Date){
      return this.data.toLocaleDateString([], {year: "numeric", month: "2-digit", day: "2-digit"});
    }
    else {
      return this.data;
    }
  }

  update(val : any){
    this.data = val;
  }
}

@Component({
  templateUrl: "build/directives/table/table.html",
  selector: "custom-table",
  directives: [NgClass]
})
export class Table{
  private hasHttpRegEx = new RegExp("^http(s)?://");
  private hasWwwRegEx = new RegExp("(^http(s)?://www)|(^www)");

  @Input() data: Array<TableRow>;
  @Input() headers: Array<TableHeader>;
  @Input() link: boolean;

  formatLink(link: string){
    if (!this.hasWwwRegEx.test(link)){
      link = "www." + link;
    }

    if (!this.hasHttpRegEx.test(link)){
      link = "http://" + link;
    }
    return link;
  }

  click(row: TableRow) {
    if (this.link){
      row.onClick();
    }
  }
}
