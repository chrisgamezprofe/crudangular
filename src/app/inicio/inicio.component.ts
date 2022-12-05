import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Estudiante } from '../interfaces/estudiantes';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  id=0;
  editando=false;
  cargando = false;
  estudiantes:Estudiante[]=[];

  formulario !:FormGroup;

  constructor(private api:ApiService, private form:FormBuilder) { }

  ngOnInit(): void {
    this.getEstudiantes();

    this.formulario = this.form.group({
      dni:['',Validators.required],
      nombre:['',Validators.required],
      apellido:['',Validators.required],
      correo:['',[Validators.required,Validators.pattern("[^ @]*@[^ @]*")]]
    });
  }

  getEstudiantes() {
    this.cargando = true;
    this.api.listar().subscribe({
      next:res=>{
        this.estudiantes =res;
        this.cargando = false;
      },
      error:(err: HttpErrorResponse)=>{
        alert(err.message);
        this.cargando = false;
      }
    });
  }

  nuevo(){
    this.editando=false;
  }

  guardar() {
    this.cargando = true;
    this.api.guardar(this.formulario.value).subscribe({
      next:res=>{
        this.getEstudiantes();
        this.formulario.reset();
        let cerrar = document.getElementById("cerrarDialogo");
        cerrar?.click();
        let mensaje="El estudiante "+res.nombre+" "+res.apellido+" fue registrado."
        Swal.fire(
          'Registro exitoso',
          mensaje,
          'success'
        )
        this.cargando = false;
      },
      error:(err: HttpErrorResponse)=>{
        if(err.status==0){
          Swal.fire(
            'Upps',
            "Upps, servidor no disponible, intente más tarde. :"+err.status,
            'error'
          )
        }else if(err.status==500){
          Swal.fire(
            'Upps',
            "Upps, Ya existe un estudiante con el DNI:"+this.formulario.value.dni,
            'error'
          )
        }
        this.cargando = false;
      }
    });
  }


  actualizar() {
    console.log(this.editarDatos);
    this.cargando = true;
    this.editarDatos = this.formulario.value;
    this.editarDatos["id"]=this.id;
    this.api.actualizar(this.editarDatos).subscribe({
      next:res=>{
        this.getEstudiantes();
        this.formulario.reset();
        let cerrar = document.getElementById("cerrarDialogo");
        cerrar?.click();
        let mensaje="El estudiante "+res.nombre+" "+res.apellido+" fue actualizado."
        Swal.fire(
          'Actualización exitosa',
          mensaje,
          'success'
        )
        this.cargando = false;
      },
      error:(err: HttpErrorResponse)=>{
        if(err.status==0){
          Swal.fire(
            'Upps',
            "Upps, servidor no disponible, intente más tarde. :"+err.status,
            'error'
          )
        }else if(err.status==500){
          Swal.fire(
            'Upps',
            "Upps, El estudiante con el DNI:"+this.editarDatos.dni+" no existe.",
            'error'
          )
        }
        this.cargando = false;
      }
    });
  }


  eliminar(id:number) {
    this.cargando = true;
    this.api.eliminar(id).subscribe({
      next:res=>{
        this.getEstudiantes();
        if(res.respuesta){
          Swal.fire(
            'Mensaje',
            res.mensaje,
            'success'
          )
        }else{
          Swal.fire(
            'Mensaje',
            res.mensaje,
            'error'
          )
        }

        this.cargando = false;
      },
      error:(err: HttpErrorResponse)=>{
        if(err.status==0){
          Swal.fire(
            'Upps',
            "Upps, servidor no disponible, intente más tarde. :"+err.status,
            'error'
          )
        }else if(err.status==500){
          Swal.fire(
            'Upps',
            "Upps, El estudiante con el DNI:"+this.editarDatos.dni+" no existe.",
            'error'
          )
        }
        this.cargando = false;
      }
    });
  }

  editarDatos !:any;

  editar(data:any){
    this.editando=true;
    this.formulario.get('nombre')?.setValue(data.nombre);
    this.formulario.get('apellido')?.setValue(data.apellido);
    this.formulario.get('correo')?.setValue(data.correo);
    this.formulario.get('dni')?.setValue(data.dni);
    this.id = data.id;

  }

}
 

