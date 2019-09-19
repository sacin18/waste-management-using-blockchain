import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class DataService {

  httpOptions={
    headers: new HttpHeaders ({
      'Content-Type': 'application/json'
    }) 
  }

  constructor(private httpCLient: HttpClient) { }

  fetchData(url: string) {
    return this.httpCLient.get(url);
  }

  postData(url: string, data) {
    return this.httpCLient.post(url,data,this.httpOptions);
  }

}