import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-extraer-texto',
  templateUrl: './extraer-texto.component.html',
  styleUrls: ['./extraer-texto.component.css']
})
export class ExtraerTextoComponent implements OnInit {

  nombre:string = "";
  descripcion:string = "cargando ...";

  image:any;
  imagen_:string = "";
  seleccionoImagen:boolean = false;
  traducido:boolean = false;

  constructor(public sanitizer:DomSanitizer, private toastr: ToastrService, private userService:UserServiceService) { }

  ngOnInit(): void {
  }

  extraerTexto(){
    //console.log("extraer texto");
    if(!this.seleccionoImagen){
      this.toastr.error('Por favor, agrega una imagen para subir', 'Error', {
        timeOut: 4000,
        progressAnimation: 'decreasing',
        progressBar: true
      })
      return;
    }

    this.descripcion = "cargando ...";
    var arr = this.imagen_.split(";base64,");
    var arr2 = arr[0].split("/");
    //console.log(arr2[1]);
    //console.log(arr[1]);
    //return;
    let photo = arr[1];
    
    this.userService.ObtenerTexto(photo).subscribe({
      next: (data:any)=>{
        if(data.codigo==200){
          console.log(data);
          this.toastr.info('Foto traducida', 'Todo correcto :D', {
            timeOut: 4000,
            progressAnimation: 'decreasing',
            progressBar: true
          })
          var arreglo = data.mensaje.split(";;;");
          this.descripcion = arreglo[0];
        }else{
          this.toastr.error('Error al intentar examinar la foto', 'Error', {
            timeOut: 4000,
            progressAnimation: 'decreasing',
            progressBar: true
          })
        }
      },
      error: (err:any)=>{
        console.log(err);
        this.toastr.error('Lo sentimos, algo malo ocurrio :c', 'Error', {
          timeOut: 4000,
          progressAnimation: 'decreasing',
          progressBar: true
        })
      }
    })

    this.traducido = true;
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
