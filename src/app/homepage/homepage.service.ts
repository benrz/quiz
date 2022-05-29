import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, EmailValidator } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  constructor(private firebase: AngularFireDatabase) { }
  userList: AngularFireList<any>;
  loggedUser: string;
  userOn: boolean;
  
  Loginform = new FormGroup({
    $id: new FormControl(null), 
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  Registerform = new FormGroup({
    $id: new FormControl(null), 
    username: new FormControl('', Validators.required),
    email: new FormControl('',
    [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', 
    [
      Validators.required,
      Validators.minLength(6)
    ]),
    school: new FormControl('', Validators.required),
    gpa: new FormControl(100)
  });

  retainUser(){
    this.userList = this.firebase.list('user');
    return this.userList.snapshotChanges();
  }

  insertUser(user){
    this.userList.push({
      username: user.username,
      email: user.email,
      password: user.password,
      school: user.school,
      gpa: 100
    });
  }

  fillForm(user){
    this.Registerform.setValue(user);
  }

  updateUser(user){
    this.userList.update(user.$id, {
      username: user.username,
      email: user.email,
      password: user.password,
      school: user.school,
      gpa: user.gpa
    });
  }

  deleteUser($id: string){
    this.userList.remove($id);
  }
}
