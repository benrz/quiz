import { Component, OnInit } from '@angular/core';
import { HomepageService } from './homepage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  successMessage: boolean;
  deleteMessage: boolean;
  userFound: boolean;
  showLogin: boolean = true;
  admin:boolean;

  showRegister: boolean = false;
  submitted: boolean = false;
  formControls: any;
  userArray = [];

  constructor(
    private homepageService: HomepageService,
    private route: Router
  ) { }

  ngOnInit() {
    this.homepageService.retainUser().subscribe(
      listUser => {
        this.userArray = listUser.map(item => {
          return{
            $id: item.key,
            ...item.payload.val()
          };
        });
      });
  }

  onLogin(){
    this.admin = false;
    this.userFound = false;
    this.submitted = true;
    this.formControls = this.homepageService.Loginform.controls;
    let username = this.homepageService.Loginform.get('username');
    let userpassword = this.homepageService.Loginform.get('password');

    for(let user of this.userArray){
      if(user.username == username.value || user.email == username.value){
        if(user.password == userpassword.value){
          this.userFound = true;
          this.homepageService.loggedUser = username.value;
          this.homepageService.userOn = true;

          if(userpassword.value == 'adminadmin' && username.value == 'admin')
            this.admin = true;
          break;
        }
      }
    }

    // if(this.userFound == false){
    //   this.route.navigate(['/exam']);
    //   alert('Username / Password is invalid');
    //   this.route.navigate(['/home']);
    // }

    this.homepageService.Loginform.reset();
    this.showLogin = false;

    localStorage.setItem('username', this.homepageService.loggedUser);
    if(this.userFound && !this.admin){
      alert('Welcome User!');
      this.route.navigate(['/exam']);
    }
    else if(this.userFound && this.admin){
      alert('Welcome admin!');
    }
    else{
      alert('Username / Password is invalid');
      this.showLogin = true;
    }
  }

  onRegister(){
    this.submitted = true;
    this.formControls = this.homepageService.Registerform.controls;

    if(this.homepageService.Registerform.valid){
      if(this.homepageService.Registerform.get('$id').value == null){
        this.homepageService.insertUser(this.homepageService.Registerform.value);
        this.successMessage = true;
        setTimeout(() => this.successMessage = false, 3000);
      }
      else{
        this.homepageService.updateUser(this.homepageService.Registerform.value);
      }
      this.submitted = false;
      this.showRegister = false;
      this.homepageService.Registerform.reset();
    }
  }

  onDelete($id){
    if(confirm('Are you sure to delete this user ?')){
      this.homepageService.deleteUser($id);
      this.deleteMessage = true;
      setTimeout(() => this.deleteMessage = false, 3000);
    }
  }

  getHomepageServiceLoginForm(){
    return this.homepageService.Loginform;
  }

}
