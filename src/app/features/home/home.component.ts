import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { Router } from '@angular/router';
import { HttpService } from '../../core/http-service/http.service';
import { User } from '../Models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


  public user: User = new User();

  constructor(private readonly configService:ConfigService, private readonly router: Router, private readonly httpService: HttpService) {}

  ngOnInit(): void {
    if(sessionStorage.getItem('id_token') != null || undefined){
      this.httpService.get<User>('User').subscribe(response => {
        this.user = response;
      });
    }
    else{
      this.router.navigate(['']);
    }
  }

}
