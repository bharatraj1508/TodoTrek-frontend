import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/interface/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  current: User = {
    user: {
      _id: '',
      email: '',
      isVerified: '',
    },
  };

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((res) => {
      this.current = res;
    });
  }

  login() {
    this.router.navigate(['login']);
  }
  register() {
    this.router.navigate(['register']);
  }
  logout() {
    this.authService.doLogout();
  }
}
