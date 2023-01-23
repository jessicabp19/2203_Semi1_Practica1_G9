import { Component, OnInit } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Md5 } from 'md5-typescript';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  perfilBase64:string ="";
  username:string="";
  name:string = "";
  perfilDescription:string = "";

  divInfo:boolean = true;
  divEditarPerfil:boolean = false;
  divSubirFoto:boolean = false;
  divVerFotos:boolean = false;
  divEditarAlbum:boolean = false;
  divExtraerTexto: boolean = false;
  divChatBot: boolean = false;

  // actualizar perfil
  name_:string = "";
  username_:string = "";
  pass_:string = "";
  image:any;
  imagen_:string = "";
  seleccionoImagen:boolean = false;
  seleccionoImagen2:boolean = false;

  // album
  listaAlbum:any = []; // arreglo que tendra un listado del album y sus imagenes
  albums:Array<string> = [];

  constructor(public sanitizer:DomSanitizer, private toastr: ToastrService, private userService:UserServiceService) { }

  ngOnInit(): void {
    this.seleccionoImagen2 = false;
    this.getInfo();
  }

  getInfo(){
    var data = this.userService.getUserInfo();
    //console.log(data);
    this.perfilBase64 = this.userService.getImagePath(data.photoUrl);
    this.name = data.name;
    this.username = data.user;
    this.perfilDescription = data.etiquetas;
    this.getFotos(data.user);
    // albumes
    //this.getAlbumes(data.user);
  }

  actualizarInfo(){
    //actualizar datos
    if(this.username_=="" || this.name_==""){
      this.toastr.error("Por favor, llenar todos los campos", "Formulario incompleto", {
        progressBar: true,
        timeOut: 3000,
        progressAnimation: 'decreasing'
      })
      return;
    }
    var data = this.userService.getUserInfo();

    if(Md5.init(this.pass_)!= data.password){
      this.toastr.error("No coinciden las contraseñas", "Formulario incompleto", {
        progressBar: true,
        timeOut: 3000,
        progressAnimation: 'decreasing'
      })
      return;
    }
    let photo = {
      'extension' : "",
      'base64': ""
    }
    let sinPhoto = ""
    if(this.seleccionoImagen2){
      var arr = this.imagen_.split(";base64,");
      var arr2 = arr[0].split("/");
      //console.log(arr2[1]);
      //console.log(arr[1]);
      photo.extension = arr2[1];
      photo.base64 = arr[1];
    }else{
      sinPhoto = "null";
    }
    var info = {}
    if(this.seleccionoImagen2){
      var UserData = {
        'user': data.user,
        'newuser': this.username_,
        'name': this.name_,
        'password': data.password,
        'photo': photo
      }
      info = UserData;
    }else{
      var userData = {
        'user': data.user,
        'newuser': this.username_,
        'name': this.name_,
        'password': data.password,
        'photo': sinPhoto
      }
      info = userData;
    }
    //console.log(info);
    //return;
    //peticion
    this.userService.ModificarUsuario(info).subscribe({
      next: (res:any) => {
        console.log(res);
        if(res.codigo==200){
          var mensaje = res.mensaje[0];
          this.userService.updateUserInfo(mensaje.usuario, mensaje.nombre, mensaje.foto, mensaje.etiquetas);        
          this.toastr.success('Datos actualizados correctamente', undefined, {
            progressBar: true,
            timeOut: 3500,
            progressAnimation: 'decreasing'
          })
          this.pass_ = "";
        }else{
          this.toastr.error('Error al modificar los datos', undefined, {
            progressBar: true,
            timeOut: 3500,
            progressAnimation: 'decreasing'
          })
        }
      },
      error: (err:any) => {
        console.log('Error al modificar');
        console.log(err);
        this.toastr.error("No se pudo actualizar la informacion", "Error", {
          progressBar: true,
          timeOut: 4000,
          progressAnimation: 'decreasing'
        });
      }
    })
    this.seleccionoImagen2 = false;
  }

  showInfo(){
    this.divInfo=true;
    this.divEditarPerfil = false;
    this.divSubirFoto = false;
    this.divVerFotos = false;
    this.divEditarAlbum = false;
    this.divExtraerTexto = false;
    this.divChatBot = false;
    // setear nuevamentes los valores
    var data = this.userService.getUserInfo();
    this.name = data.name;
    this.username = data.user;
    this.perfilBase64= this.userService.getImagePath(data.photoUrl);
    this.getFotos(this.userService.getUser());
    //this.getAlbumes(data.user);
  }

  showEditarPerfil(){
    this.divInfo=false;
    this.divEditarPerfil = true;
    this.divSubirFoto = false;
    this.divVerFotos = false;
    this.divEditarAlbum = false;
    this.divExtraerTexto = false;
    this.divChatBot = false;
    var data = this.userService.getUserInfo();

    var urlImagen = this.userService.getImagePath(data.photoUrl);
    this.name_ = data.name;
    this.username_ = data.user;
    this.imagen_ = urlImagen;
    
    //console.log(this.imagen_);
  }

  showSubirFoto(){
    this.divInfo=false;
    this.divEditarPerfil = false;
    this.divSubirFoto = true;
    this.divVerFotos = false;
    this.divEditarAlbum = false;
    this.divExtraerTexto = false;
    this.divChatBot = false;
    //this.getAlbumes(this.userService.getUser());
  }

  showVerFotos(){
    this.divVerFotos = !this.divVerFotos;
    this.divEditarAlbum = false;
    this.divExtraerTexto = false;
    this.divChatBot = false;
    this.getFotos(this.userService.getUser());
  }

  getFotos(user:string){
    this.listaAlbum = [];
    this.userService.GetFotos(user).subscribe({
      next: (data:any) => {
        console.log(data);
        if(data.codigo){
          var arr:any = data.mensaje;
          var dict:any = {}
          var cont = 0;
          for(const x of arr){
            //console.log(x);
            if(dict[x.album]){
              dict[x.album].push({num:cont, foto:x.foto, description:x.descripcion});
            }else{
              dict[x.album] = [];
              dict[x.album].push({num:cont, foto:x.foto, description:x.descripcion});
            }
            cont++;
          }
          for(const [key, value] of Object.entries(dict)){
            this.listaAlbum.push({'album':key, 'fotos':value})
          }
          console.log(this.listaAlbum);
        }
      },
      error: (err:any) => {
        console.log(err);
      }
    })
  }

  getAlbumes(user:string){
    this.albums = []
    this.userService.GetAlbumes(user).subscribe({
      next: (res:any) => {
        console.log(res);
        if(res.codigo==200){
          var mensaje:any = res.mensaje;
          for(const y of mensaje){
            if(!this.albums.includes(y.album)){
              this.albums.push(y.album);
            }
          }
          //console.log("Lista de albums");
          //console.log(this.albums);
        }
      },
      error: (err:any) =>{
        console.log("error al cargar los albums")
        console.log(err);
      }
    })
  }

  recorrerArreglo(item:string){
    console.log(item);
  }

  showEditarAlbum(){
    this.divEditarAlbum = !this.divEditarAlbum;
    this.divVerFotos = false;
    //this.getAlbumes(this.userService.getUser());
  }

  // mostrar div para extraer texto
  showExtraerTexto(){
    this.divExtraerTexto = true;
    this.divVerFotos = false;
    this.divEditarPerfil = false;
    this.divSubirFoto = false;
    this.divInfo = false;
    this.divChatBot = false;
  }

  showChatbot(){
    this.divChatBot = true;
    this.divExtraerTexto = false;
    this.divVerFotos = false;
    this.divEditarPerfil = false;
    this.divSubirFoto = false;
    this.divInfo = false;
  }

  getBase64Url(url:string){
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx:any = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    //console.log("URL, ",dataURL);
    //this.imagen_ = dataURL;
    //console.log(dataURL);
  }
    img.src = url
    console.log(img.src);
  }

  capturarFile(event:any){
    if(event.target.files.length > 0){
      if(this.divEditarPerfil){
        this.seleccionoImagen2 = true;
      }else{
        this.seleccionoImagen = true;
      }
      const file = event.target.files[0];
      this.image = file;
      this.extraerBase64(this.image).then((im:any) => {
        this.imagen_ = im.base;
        //console.log(this.imagen_);
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
  
}
