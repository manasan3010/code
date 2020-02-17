import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
     'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient) { }

  // api = this.http.get('https://reqres.in/api/users');

  addStudents(paramValues) {
    console.log(paramValues)
    return this.http.post<any>('http://localhost:8000/student/add', paramValues);
  }
}
