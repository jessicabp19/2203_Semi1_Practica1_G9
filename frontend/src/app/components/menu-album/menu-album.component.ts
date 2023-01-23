import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Album } from '../upload-image/upload-image.component'

@Component({
  selector: 'app-menu-album',
  templateUrl: './menu-album.component.html',
  styleUrls: ['./menu-album.component.css']
})
export class MenuAlbumComponent implements OnInit {
  @Input() albums:any;
  albumSeleccionado:string = ""; //id del album
  mostrarForm:boolean = false;

  listaAlbum:Array<string> = []
  textAlbum:string = "";
  textAlbum2: string ="";
  constructor(private userService: UserServiceService, private toastr: ToastrService) { }

  ngOnInit(): void {
    //var data = this.userService.getUserInfo()
    //this.getAlbumes(data.user);
    this.listaAlbum = this.albums;
  }

  cambio(val:string){
    this.textAlbum2 = val;
    this.textAlbum = val;
  }

  getAlbumes(user:string){
    this.listaAlbum = [];
    this.userService.GetFotos(user).subscribe({
      next: (data:any) => {
        //console.log(data);
        if(data.codigo){
          var arr:any = data.mensaje;
          var arr2:any = [];
          for(const x of arr){
            if(!arr2.includes(x.album)){
              arr2.push(x.album);
            }
          }
          //this.listaAlbum = [...this.listaAlbum];
          for(var x=0; x<arr2.length; x++){
            this.listaAlbum.push("{id:x, 'valor':arr2[x]}");
          }
          console.log(this.listaAlbum);
        }
      },
      error: (err:any) => {
        console.log(err);
      }
    })
  }

  Agregar(){
    if(this.textAlbum==""){
      this.toastr.warning('Por favor, llene el campo del Album', 'Aviso',{
        timeOut: 3500,
        progressAnimation: 'decreasing',
        progressBar: true
      })
    }
    let AlbumData = {
      'user' : this.userService.getUser(),
      'album': this.textAlbum
    }
    //console.log(AlbumData);
    //return;
    this.userService.AgregarAlbum(AlbumData).subscribe({
      next: (data:any)=>{
        console.log(data);
        if(data.codigo){
          this.toastr.info(data.mensaje, undefined,{
            timeOut: 3500,
            progressAnimation: 'decreasing',
            progressBar: true
          })
          this.getAlbumes2();
        }
      },
      error: (e:any) => {
        console.log(e);
        this.toastr.error('Ocurrio un error', 'Error',{
          timeOut: 3500,
          progressAnimation: 'decreasing',
          progressBar: true
        })
      }
    })
  }

  Modificar(){
    if(this.textAlbum==""){
      this.toastr.warning('Por favor, llene el campo del Album', 'Aviso',{
        timeOut: 3500,
        progressAnimation: 'decreasing',
        progressBar: true
      })
    }
    let AlbumData = {
      'user' : this.userService.getUser(),
      'album': this.textAlbum2,
      'new': this.textAlbum
    }
    //console.log(AlbumData);
    //return
    this.userService.ModificarAlbum(AlbumData).subscribe({
      next: (data:any)=>{
        console.log(data);
        if(data.codigo){
          this.toastr.info("Album modificado!", undefined,{
            timeOut: 3500,
            progressAnimation: 'decreasing',
            progressBar: true
          })
          this.getAlbumes2();
        }
      },
      error: (e:any) => {
        console.log(e);
        this.toastr.error('Ocurrio un error', 'Error',{
          timeOut: 3500,
          progressAnimation: 'decreasing',
          progressBar: true
        })
      }
    })
  }

  Eliminar(){
    let AlbumData = {
      'user' : this.userService.getUser(),
      'album': this.textAlbum
    }
    //console.log(AlbumData);
    //return;
    this.userService.EliminarAlbum(AlbumData).subscribe({
      next: (data:any)=>{
        console.log(data);
        if(data.codigo){
          this.toastr.info(data.mensaje, undefined,{
            timeOut: 3500,
            progressAnimation: 'decreasing',
            progressBar: true
          })
          this.getAlbumes2();
        }
      },
      error: (e:any) => {
        console.log(e);
        this.toastr.error('Ocurrio un error', 'Error',{
          timeOut: 3500,
          progressAnimation: 'decreasing',
          progressBar: true
        })
      }
    })
  }

  getAlbumes2(){
    var data = this.userService.getUserInfo();
    this.listaAlbum = []
    this.userService.GetAlbumes(data.user).subscribe({
      next: (res:any) => {
        console.log(res);
        if(res.codigo==200){
          var mensaje:any = res.mensaje;
          for(const y of mensaje){
            if(!this.listaAlbum.includes(y.album)){
              this.listaAlbum.push(y.album);
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

  prueba(){
    console.log(this.textAlbum);
  }
}
