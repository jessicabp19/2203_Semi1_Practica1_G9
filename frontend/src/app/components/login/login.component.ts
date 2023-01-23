import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Md5 } from 'md5-typescript';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = "";
  pass: string = "";
  divWebcam: boolean = false;
  divLogin:boolean = true;

  constructor(public _router: Router, private toastr: ToastrService, private userService:UserServiceService) { }

  ngOnInit(): void {
  }
  
  login() {
    //console.log(this.username, this.pass);
    if(this.username=="" || this.pass==""){
      this.toastr.error("Por favor, llenar todos los campos", "Error al ingresar", {
        progressBar: true,
        timeOut: 3000,
        progressAnimation: 'decreasing'
      })
      return;
    }

    let data = {
      user: this.username,
      pass: Md5.init(this.pass)
    }
    //this._router.navigateByUrl("/inicio");
    //return;
    this.userService.Login(data.user, data.pass).subscribe({
      next: (res:any) => {
        //console.log(res);
        if(res.codigo==200){
          var mensaje = res.mensaje[0];
          //console.log(mensaje);
          this.userService.setUserInfo(mensaje.usuario, mensaje.nombre, mensaje.pass, mensaje.foto, mensaje.etiquetas);
          this.toastr.success("Bienvenid@ "+mensaje.usuario, undefined, {
            progressBar:true,
            timeOut: 3500,
            progressAnimation: 'decreasing'
          });
          this._router.navigateByUrl('/inicio');
        }else{
          this.toastr.error("Usuario y/o contraseña incorrectos", "Error al ingresar", {
            progressBar: true,
            timeOut: 3500,
            progressAnimation: 'decreasing'
          });
          return;
        }
      },
      error: (e:any) => {
        console.log(e.error);
        this.toastr.error("Usuario y/o contraseña incorrectos", "Error al ingresar", {
          progressBar: true,
          timeOut: 3500,
          progressAnimation: 'decreasing'
        })
        return;
      }
    })
  }

  registro(){
    this._router.navigateByUrl('/registro');
  }

  loginCamera(){
    //console.log("login camera");
    if(this.username==""){
      this.toastr.error("Ingrese el nombre de usuario","Inicio por camara", {
        progressBar: true,
        timeOut: 3500,
        progressAnimation: 'decreasing'
      })
      return;
    }
    this.divLogin = false;
    this.divWebcam = true;
  }

  regresar(){
    this.divWebcam = false;
    this.divLogin = true;
  }

  check(){
    //user media access
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 500,
        height: 500
      }
    }).then( (res)=>{
      console.log("response ", res);
      this.stream = res;
    }).catch(err => {
      console.log(err);
      if(err?.message === 'Permission denied') {
        console.log('Permission denied please try again by approving the access');
      } else {
        console.log('You may not having camera system, Please try again ...');
      }
    });
  }

  capturar(){
    console.log("capturar");
    this.trigger.next();
  }

  stream:any = null;
  trigger:Subject<void>= new Subject();
  imageCompareBase64Html:string = "";
  imageCompareBase64: string = "";
  isCapturated:boolean = false;

  get $trigger(): Observable<void>{
    return this.trigger.asObservable();
  }

  snapshot(event: WebcamImage){
     //console.log(event);
     this.imageCompareBase64Html = event.imageAsDataUrl;
     this.imageCompareBase64 = event.imageAsBase64;
     //console.log(this.imageCompareBase64);
     this.isCapturated = true;
  }

  userLogin2(){
    console.log("registro de usuario 2");
    // pendiente de modificar esto
    this.userService.LoginCamera(this.username, this.imageCompareBase64).subscribe({
      next: (res:any) => {
        if(res.codigo==200){
          var mensaje = res.mensaje[0];
          //console.log(mensaje);
          this.userService.setUserInfo(mensaje.usuario, mensaje.nombre, mensaje.pass, mensaje.foto, mensaje.etiquetas);
          this.toastr.success("Bienvenid@ "+mensaje.usuario, undefined, {
            progressBar:true,
            timeOut: 3500,
            progressAnimation: 'decreasing'
          })
          this._router.navigateByUrl('/inicio');
        }else{
          this.toastr.error("No coincide con la imagen de perfil", "Error al ingresar", {
            progressBar: true,
            timeOut: 3500,
            progressAnimation: 'decreasing'
          });
        }
      },
      error: (err:any)=>{
        console.log(err.error);
        this.toastr.error("Se presento un error", "Error al ingresar", {
          progressBar: true,
          timeOut: 3500,
          progressAnimation: 'decreasing'
        })
      }
    })
  }

}
