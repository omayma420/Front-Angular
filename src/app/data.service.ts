// File: data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'http://localhost:8088'; // Replace with your Spring Boot backend URL

  constructor(private http: HttpClient) { }

  getAllData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/patient`);
  }

  getDataById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/patient/${id}`);
  }

  postData(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/api/patient/`, data, { headers });
  }

  updateData(id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.baseUrl}/api/patient/${id}`, data, { headers, observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleUpdateError(error))
      );
  }

  private handleUpdateError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 200 && error.error === 'redirect:/patient') {
      // Handle redirect logic here
      // You may navigate to the /patient route or perform any other action
      // Return a new observable to satisfy the catchError signature
      return throwError('Redirected to /patient');
    } else {
      return throwError(error);
    }
  }

  deleteData(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/api/patient/delete/${id}`);
  }

  getPatientCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/patient/quantity`);
  }
}
