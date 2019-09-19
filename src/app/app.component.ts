import { Component } from '@angular/core';
import {OnInit} from '@angular/core';
import {DataService} from './data.service';
import {Renderer2, ElementRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'waste-management';
  displayCollector: boolean;
  displayManure: boolean;
  displayFarmer: boolean;
  displayUser: boolean;
  displayTrade: boolean;
  data: Array<object>;
  manureId: string;
  quantity: string;
  ownerId: string;
  manureTradeId: string;
  newOwner: string;
  msg: string;
  showMsg: boolean;

  constructor(private dataService: DataService, private eleRef: ElementRef){

  }
  
  tabClicked(id){
    this.displayCollector=false;
    this.displayFarmer=false;
    this.displayManure=false;
    this.displayUser=false;
    this.displayTrade=false;
    this.msg='';
    this.showMsg=false;
    switch(id) {
      case 'collector':
        this.displayCollector=true;
        this.getData("http://localhost:3000/api/Owner?filter=%7B%22where%22%3A%7B%22role%22%3A%22collector%22%7D%7D");
        break;
      case 'manure':
        this.displayManure=true;
        this.getData("http://localhost:3000/api/Manure");
        break;
      case 'farmer':
        this.displayFarmer=true;
        this.getData("http://localhost:3000/api/Owner?filter=%7B%22where%22%3A%7B%22role%22%3A%22farmer%22%7D%7D");
        break;
      case 'user':
        this.displayUser=true;
        break;
      case 'trade':
        this.displayTrade=true;
        break;
    }
  }

    ngOnInit() {
      this.displayCollector=false;
      this.displayFarmer=false;
      this.displayManure=false;
      this.displayUser=false;
      this.displayTrade=false;
      this.showMsg=false;
    }

    computeTotalManure(ownerId: string) {
          this.dataService.fetchData(`http://localhost:3000/api/Manure?filter=%7B%22where%22%3A%7B%22owner%22%3A%22resource%3Aorg.example.mynetwork.Owner%23${ownerId}%22%7D%7D`).subscribe((response:Array<object>)=>{
          let sum=0;
          for(let obj of response) {
            sum=sum+ parseInt(obj['quantity']);
          }
            this.eleRef.nativeElement.querySelector(`#${ownerId}`).innerHTML=sum;
            this.eleRef.nativeElement.querySelector(`#${ownerId}`).classList.remove('hidden'); 
            this.eleRef.nativeElement.querySelector("#total-manure").classList.remove('hidden'); 
        })

    }

    submitManureDetails() {
      debugger;
        let data: object = {
          "$class": "org.example.mynetwork.Manure",
          'manureTimeOwner': this.manureId,
          'quantity':parseInt(this.quantity),
          'owner':this.ownerId
        }
        this.checkOwnerThenUpdate("http://localhost:3000/api/Owner/"+this.ownerId,"http://localhost:3000/api/Manure",data);
    }

    submitTradeDetails() {
      debugger;
      let data: object = {
        "$class": "org.example.mynetwork.Trade",
        'manure':`resource:org.example.mynetwork.Manure#${this.manureTradeId}`,
        'newOwner': `resource:org.example.mynetwork.Owner#${this.newOwner}`
      }
      this.postData("http://localhost:3000/api/Trade",data);
    }

    private getData(url: string) {
      this.dataService.fetchData(url).subscribe((response: Array<object>)=>{
        this.data=response;
      });
    }

    private checkOwnerThenUpdate(url: string,postUrl: string,data:object) {
      this.dataService.fetchData(url).subscribe((response: Array<object>)=>{
        this.data=response;
        console.log(response);
        if(response.length==0) {
          this.msg="Error: owner is not present in the blockchain";
          this.showMsg=true;
        } else {
          this.postData(postUrl,data);
        }
      },
      (error:Array<object>)=>{
        if(error['status']=="404") {
          this.msg="Error: owner is not present in the blockchain";
          this.showMsg=true;
        } else {
          this.msg="Error while checking presence of owner";
          this.showMsg=true;
        }
      });
    }

    private postData(url: string,data:object) {
      debugger;
      this.msg='';
      this.dataService.postData(url,data).subscribe((response)=>{
          this.msg="The data has been entered successfully";
          this.showMsg=true;
      },(error)=>{
          if(JSON.stringify(error).includes("'Participant:org.example.mynetwork.Owner' does not exist")) {
            this.msg=`Error: No such owner exists in the blockchain`;
            this.showMsg=true;
          } else if(JSON.stringify(error).includes("'Asset:org.example.mynetwork.Manure' does not exist")){
            this.msg=`Error: No such manure entity exists in the blockchain`;
            this.showMsg=true;
          } else if(JSON.stringify(error).includes("'Asset:org.example.mynetwork.Manure' as the object already exists")) {
            this.msg=`Error: Manure entity already exists in the blockchain`;
            this.showMsg=true;
          }else {
            this.msg=`Error ocurred while posting data ${JSON.stringify(error)}`;
            this.showMsg=true;
          }
      })
    }

}
