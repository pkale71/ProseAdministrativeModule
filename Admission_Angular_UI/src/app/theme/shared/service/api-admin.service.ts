import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiAdminService {

  constructor(private http: HttpClient) { }

  get(url: string): any {
    return this.http.get(environment.apiAdminUrl + url);
  }

  getFile(url: string): any {
      return this.http.get(environment.apiAdminUrl + url, { responseType: 'blob' });
  }

  post(url: string, data: string): any {
      return this.http.post(environment.apiAdminUrl + url, data);
  }
  
  postJSONData(url: string, data: JSON): any {

    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    return this.http.post(environment.apiAdminUrl + url, data, httpOptions);
  }

  postData(url: string, formData: FormData): any {

      const httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded',
              'enctype': 'multipart/form-data'
          })
      };

      return this.http.post(environment.apiAdminUrl + url, formData, httpOptions);
  }

  delete(url: string): any {
      return this.http.delete(environment.apiAdminUrl + url);
  }

  private handleError(error: any) {
      return error.statusText;
  }

  private handleResponse(data: Object) {
      
      return data;
  }

  //gradeForm
//   post(url: string, data: string): any {
//     return this.http.post(environment.apiAdminUrl + url, data);
// }
}
