import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Md5 } from 'md5-typescript';
import { DomSanitizer } from '@angular/platform-browser';
import { UserServiceService } from 'src/app/services/user-service.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  constructor(public _router: Router, public sanitizer:DomSanitizer, private toastr: ToastrService, private userService:UserServiceService) { }

  ngOnInit(): void {
  }

  name:string = "";
  username: string = "";
  pass: string = "";
  pass2: string = "";
  seleccionoImagen:boolean = false;
  ruta: string = "";
  image: any;
  imgDescription:string = "";
  
  previsualizacion: string = "";


  registrar(){

    if(this.name=="" || this.username=="" || this.pass=="" || this.pass2==""){
      this.toastr.error("Por favor, llenar todos los campos", "Formulario incompleto", {
        progressBar: true,
        timeOut: 3000,
        progressAnimation: 'decreasing'
      })
      return;
    }
    if(this.pass!=this.pass2){
      this.toastr.error("Las contraseñas no coinciden", "Confirmacion de contraseña", {
        progressBar: true,
        timeOut: 3000,
        progressAnimation: 'decreasing'
      })
      return;
    }
    if(!this.seleccionoImagen){
      this.toastr.warning("Es necesario que suba una foto de perfil", "Foto de perfil", {
        progressBar: true,
        timeOut: 3000,
        progressAnimation: 'decreasing'
      })
      this.ruta = "";
      return;
    }else{
      this.ruta = this.image.name;
    }
    //console.log(this.ruta);
    var arr = this.previsualizacion.split(";base64,");
    var arr2 = arr[0].split("/");
    //console.log(arr2[1]);
    //console.log(arr[1]);
    //return;
    let photo = {
      'extension': arr2[1],
      'base64': arr[1]
    }
    //console.log(photo.base64);
    let UserData = {
      'name': this.name,
      'user': this.username,
      'password': Md5.init(this.pass),
      'confirmpass': Md5.init(this.pass2),
      'photo': photo
    }
    
    // AGREGAR DESCRIPCION DE LA IMAGEN
    this.userService.RegistroUsuario(UserData).subscribe({
      next: (res:any)=> {
        //console.log("response");
        if(res.codigo==200){
          //console.log("entra");
          this.limpiarCampos();
          this.toastr.success(res.mensaje, "Bienvenido", {
            progressBar: true,
            timeOut: 4000,
            progressAnimation: 'decreasing'
          })
        }else{
          this.toastr.error(res.mensaje, "Error", {
            progressBar: true,
            timeOut: 4000,
            progressAnimation: 'decreasing'
          });
        }
      },
      error: (e)=>{
        console.log('Error al crear usuario');
        console.log(e);
        this.toastr.error(e.error.mensaje, "Error", {
          progressBar: true,
          timeOut: 4000,
          progressAnimation: 'decreasing'
        });
      }
    });
  }

  // capturar imagen
  capturarFile(event:any){
    if(event.target.files.length > 0){
      this.seleccionoImagen = true;
      const file = event.target.files[0];
      this.image = file;
      //console.log(this.image);
      this.extraerBase64(this.image).then((im:any) => {
        this.previsualizacion = im.base;
        //console.log(this.previsualizacion);
      })
    }
  }

  // EXTRAER BASE 64 DE UNA IMAGEN
  extraerBase64 = async($event:any) => new Promise((resolve, rejects) => {
    try{
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
    }catch (e){
      console.log(e);
    }
  });

  limpiarCampos(){
    this.name = "";
    this.username = "";
    this.pass = "";
    this.pass2 = "";
    this.previsualizacion = "";
    this.seleccionoImagen = false;
    this.ruta = "";
  }
}
