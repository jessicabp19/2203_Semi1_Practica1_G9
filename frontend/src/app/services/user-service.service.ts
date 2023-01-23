import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { map } from 'rxjs';

export interface UserData {
  user:string,
  name:string,
  password:string,
  photoUrl:string,
  etiquetas:string
}

@Injectable({
  providedIn: 'root'
})

export class UserServiceService {

  bucketImages:string = "https://bucket-imagen-semi1.s3.us-east-2.amazonaws.com/";
  
  url:string = "http://54.166.110.144:5000/";

  userData:UserData = {
    user : "",
    name: "",
    password: "",
    photoUrl: "",
    etiquetas: ""
  }
  constructor(public http: HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    //'Origin': '*',
    'Accept':'*',
    'Access-Control-Allow-Methods':['GET', 'POST','OPTIONS'],
    'Access-Control-Allow-Headers':['access-control-allow-methods','access-control-allow-origin','content-type']
  });


  GET(){
    return this.http.get(this.url, {headers:this.headers}).pipe(map(data=>data));
  }

  Login(user:string, pass:string){
    var endpoint=this.url+'iniciarSesion';
    return this.http.post(endpoint, {
      "user": user,
      "password": pass
    }, {headers:this.headers})//.pipe(map(data=>data))
  }

  LoginCamera(user:string, image:string){
    var endpoint = this.url+'iniciarSesionCamara';
    return this.http.post(endpoint, {
      "user": user,
      "photo":image
    }, {headers:this.headers})
  }

  RegistroUsuario(UserData:any){
    //console.log(UserData);
    var endpoint=this.url+'crearUsuario';
    return this.http.post(endpoint, {
      'name': UserData.name,
      'user': UserData.user,
      'password': UserData.password,
      'confirmpass': UserData.confirmpass,
      'photo': UserData.photo
    }, {headers:this.headers})
  }

  ModificarUsuario(UserData:any){
    var endpoint = this.url+'modificarDatos';
    return this.http.post(endpoint, {
      'user': UserData.user,
      'newuser': UserData.newuser,
      'name': UserData.name,
      'password': UserData.password,
      'photo': UserData.photo
    }, {headers:this.headers})
  }

  GetFotos(user:string){
    var endpoint = this.url+'getFotos'
    return this.http.post(endpoint,{
      'user':user
    }, {headers:this.headers})
  }

  GetAlbumes(user:string){
    var endpoint = this.url+'getAlbums';
    return this.http.post(endpoint, {
      'user':user
    }, {headers: this.headers})
  }

  CrearFoto(PhotoData:any){
    var endpoint = this.url+'crearFoto'
    return this.http.post(endpoint,{
      'photo': PhotoData.photo,
      'user': PhotoData.user,
      'description': PhotoData.description
    }, {headers: this.headers})
  }

  ObtenerTexto(photo:any){
    var endpoint = this.url+"extraerTexto";
    return this.http.post(endpoint, {
      'photo':photo
    }, {headers: this.headers})
  }

  TraducirTexto(target:number, texto:string){
    var endpoint = this.url+"traducir";
    return this.http.post(endpoint, {
      'target': target,
      'text':texto
    }, {headers: this.headers})
  }

  AgregarAlbum(AlbumData:any){
    var endpoint = this.url+'crearAlbum';
    return this.http.post(endpoint, {
      'user': AlbumData.user,
      'album': AlbumData.album
    }, {headers: this.headers})
  }

  ModificarAlbum(AlbumData:any){
    var endpoint = this.url+'editarAlbum';
    return this.http.post(endpoint, {
      'user': AlbumData.user,
      'album': AlbumData.album,
      'new': AlbumData.new
    }, {headers: this.headers})
  }

  EliminarAlbum(AlbumData:any){
    var endpoint = this.url+'eliminarAlbum';
    return this.http.post(endpoint, {
      'user': AlbumData.user,
      'album': AlbumData.album
    }, {headers: this.headers})
  }

  getUser(){
    return this.userData.user;
  }

  getImagePath(ruta:string){
    //console.log("ruta "+ruta);
    return this.bucketImages+ruta;
  }

  getUserInfo():UserData{
    return this.userData;
  }

  updateUserInfo(user:string, name:string, foto:string, newDescription:string){
    this.userData.user = user;
    this.userData.name = name;
    this.userData.photoUrl = foto;
    this.userData.etiquetas = newDescription
  }

  getUserImage(){
    return this.userData.photoUrl;
  }

  setUserInfo(user:string, name:string, pass:string, base64:string, description:string){
    this.userData.user = user;
    this.userData.name = name;
    this.userData.password = pass;
    this.userData.photoUrl = base64;
    this.userData.etiquetas = description;
    //console.log("userData: ", this.userData);
  }

  logOut(){
    this.userData.name = "";
    this.userData.etiquetas = "";
    this.userData.password = "";
    this.userData.user = "";
    this.userData.photoUrl = ""
  }
}
