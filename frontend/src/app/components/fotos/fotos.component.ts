import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.css']
})
export class FotosComponent implements OnInit {

  constructor() { }

  @Input() album:any;
  nombreAlbum:string = "";
  listaFotos:any = [];
  // la idea es album.nombre (nombre del album)
  // album.fotos (arreglo de bases64)
  ngOnInit(): void {
    this.nombreAlbum = this.album.album;
    this.listaFotos = this.album.fotos;
    //this.listaFotos.push(1);
  }

}
