import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estudiante } from '../interfaces/estudiantes';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  URL="http://localhost:8080/estudiantes";
  constructor(private http: HttpClient) { }

  add(estudiante:Estudiante):Observable<Estudiante>{
    return this.http.post<Estudiante>(this.URL,estudiante);
  }

  guardar(estudiante:any){
    return this.http.post<any>(this.URL,estudiante);
  }

  actualizar(estudiante:any){
    return this.http.post<any>(this.URL,estudiante);
  }

  eliminar(id:any){
    return this.http.delete<any>(this.URL+"/"+id);
  }

  listar(){
    return this.http.get<Estudiante[]>(this.URL);
  }

}
