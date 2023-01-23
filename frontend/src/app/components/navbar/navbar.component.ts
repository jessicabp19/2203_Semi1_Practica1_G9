import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private _router:Router, private userService:UserServiceService, private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  logOut(){
    this.userService.logOut();
    this.toastr.info("Vuelve pronto!", "Sesion finalizada", {
      timeOut:5000,
      progressBar: true,
      progressAnimation: 'decreasing'
    })
    this._router.navigateByUrl('/');
  }
  

}
