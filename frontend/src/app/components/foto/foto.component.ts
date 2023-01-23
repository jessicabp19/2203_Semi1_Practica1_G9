import { Component, OnInit, Input } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-foto',
  templateUrl: './foto.component.html',
  styleUrls: ['./foto.component.css']
})
export class FotoComponent implements OnInit {

  @Input() imagen:any; //objeto que va a tener imagen y descripcion
  base64:string = "";
  opcion:number = 0;
  description:string = "";
  traduccion:string = "";
  data_bs_target:string = "";
  id:string ="";
  constructor(private userService: UserServiceService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.id = "exampleModal"+this.imagen.num;
    this.data_bs_target = "#"+this.id;
    //console.log("imagen recibida ", this.imagen);
    this.base64 = this.userService.getImagePath(this.imagen.foto);
    this.description = this.imagen.description;//"hola soy una descripcionnnnnnnn";
    this.traduccion = "Aqui podras ver el resultado de tu traduccion :D";
  }

  traducir(){
    console.log("opcion seleccionada ", this.opcion);
    if(this.opcion==0){
      this.toastr.error("Por favor, selecciona un idioma", "Error al traducir", {
        progressBar: true,
        timeOut: 3000,
        progressAnimation: 'decreasing'
      })
      return;
    }
    var target = 0;
    if(this.opcion==1){target=1}
    else if(this.opcion==2){target=2;}
    else{ target=3;}
    this.userService.TraducirTexto(target, this.description).subscribe({
      next: (res:any)=>{
        if(res.codigo==200){
          this.traduccion = res.mensaje;
        }else{
          this.traduccion = "Lo sentimos, no pudimos traducir tu mensaje :c";
        }
      },
      error: (err:any)=>{
        this.traduccion = "Ocurrio un error, no pudimos traducir tu mensaje :c";
        console.log(err);
      }
    })
  }

}
