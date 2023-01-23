import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from 'src/app/services/user-service.service';

export interface Album{
  id:number,
  valor:string
}

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  @Input() albums:any;

  nombre:string = "";
  imgdescription:string = "";

  image:any;
  imagen_:string = "";
  seleccionoImagen:boolean = false;

  albumSeleccionado:string = "";
  mostrarForm:boolean = false;

  listaAlbum:Array<Album> = [];
  newAlbum:string = "";

  constructor(public sanitizer:DomSanitizer, private toastr: ToastrService, private userService:UserServiceService) { }

  ngOnInit(): void {
    var data = this.userService.getUserInfo()
    //console.log(this.listaAlbum);
    //this.getAlbumes(data.user);
  }

  subirFoto(){
    //console.log(this.nombre, this.imgdescription);
    if(!this.seleccionoImagen){
      this.toastr.error('Por favor, agrega una imagen para subir', 'Error', {
        timeOut: 4000,
        progressAnimation: 'decreasing',
        progressBar: true
      })
      return;
    }else if(this.imgdescription=="" || this.nombre==""){
        this.toastr.error('Agrega un nombre y/o descripcion para la imagen', 'Error', {
          timeOut: 4000,
          progressAnimation: 'decreasing',
          progressBar: true
        })
        return;
    }
    
    var arr = this.imagen_.split(";base64,");
    var arr2 = arr[0].split("/");
    //console.log(arr2[1]);
    //console.log(arr[1]);
    //return;
    let photo = {
      'extension': arr2[1],
      'base64': arr[1]
    }
    //console.log(photo.base64);
    let PhotoData = {
      'user': this.userService.getUser(),
      'description': this.imgdescription,
      'photo': photo,
    }
    console.log(PhotoData);
    //return;
    this.userService.CrearFoto(PhotoData).subscribe({
      next: (data:any)=>{
        console.log(data);
        if(data.codigo==200){
          this.toastr.success('Tu foto se ha subido exitosamente', 'Todo correcto :D', {
            timeOut: 4000,
            progressAnimation: 'decreasing',
            progressBar: true
          })
        }else{
          this.toastr.error('Error al intentar publicar la foto', 'Error', {
            timeOut: 4000,
            progressAnimation: 'decreasing',
            progressBar: true
          })
        }
      },
      error: (err:any) =>{
        console.log(err);
        this.toastr.error('Lo sentimos, algo ocurrio :c', 'Error', {
          timeOut: 4000,
          progressAnimation: 'decreasing',
          progressBar: true
        })
      }
    })

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
            this.listaAlbum.push({id:x, 'valor':arr2[x]})
          }
          
          console.log(this.listaAlbum);
          if(this.listaAlbum.length==0){
            this.mostrarForm = true;
          }
        }
      },
      error: (err:any) => {
        console.log(err);
      }
    })
  }

  crearAlbum(){
    if(this.newAlbum==""){
      this.toastr.error("Ingresar nombre de album", "Error", {
        timeOut:3500,
        progressAnimation: 'decreasing',
        progressBar:true
      })
      return;
    }
    
    this.listaAlbum.push({id:1, valor:this.newAlbum})
    this.toastr.info("Album creado", "Aviso", {
      timeOut:3000,
      progressAnimation: 'decreasing',
      progressBar: true
    })
    this.mostrarForm = false;
  }

  capturarFile(event:any){
    if(event.target.files.length > 0){
      this.seleccionoImagen = true;
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
