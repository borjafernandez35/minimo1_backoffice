import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Friend } from '../models/friend';
import {FormsModule} from '@angular/forms';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { FriendDetailsComponent } from '../friend-details/friend-details.component';
import { FriendService } from '../services/friend.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor, UpperCasePipe} from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, UpperCasePipe, UserDetailsComponent, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.css'
})
export class FriendComponent {
  @Input() totalFriends:any;
  @Input()currentPage:any;
  @Input()limit:any=2;
  @Input()total:any;
    @Output()
    pageChange!: EventEmitter<number>;
  totalPages:any;
  
  
    newFriendForm: FormGroup;
    friends: Friend[] = [];
    friend:any;
   
  
      count:number=0;
    page: number=1 ;
    limitUsers = [2,3, 6, 9];
    
  
    selectedFriend?: Friend;
    friendUpdated?: Friend;
    showAddFriendForm: boolean = false;
    isFriendSelected: boolean = false;
  
    constructor( public friendService: FriendService, private formBuilder: FormBuilder // Inyectamos el FormBuilder
    ) {
      this.newFriendForm = this.formBuilder.group({
        
          nameFriends: ['', [Validators.required]],
          likes: ['', [Validators.required]],
          age: ['', [Validators.required]],
        
      
      });
    }
  
    ngOnInit(): void {
      
      this.friendService.getFriends(this.page, this.limit).subscribe (friends =>{
        console.log("users",friends);
      this.friend=friends;
      this.totalPages=this.friend.totalPages;
      this.total=this.friend.totalFriends;
      this.friends=this.friend.users
        
        //this.count=users.totalPages;
        //this.totalUsers=users.totalUsers;
        console.log(this.count,this.page);
        console.log(this.total,this.totalFriends);
        console.log("estoy dentro",this.friends);
        
      
      })
    }
  
    handlePageChange(event: number): void {
      console.log(this.count);
      this.page = event;
      console.log(this.page);
      this.ngOnInit();
    }
  
    handleLimitChange(event: any): void {
      this.limit = event.target.value;
      this.page = 1;
      this.ngOnInit();
    }
  
    @Output() userSelected = new EventEmitter<boolean>();
  
    onSelect(friend: Friend): void {
      this.selectedFriend = friend;
      this.userSelected.emit(true);
    }
  
    onFriendUpdated(friend: Friend): void {
      this.friendUpdated = friend;
    }
  
    deselectFriend(): void {
      
      if (this.selectedFriend && this.friendUpdated) {
        const index = this.friends.findIndex(friend => friend._id === this.selectedFriend!._id);
        if (index !== -1) {
          this.friends[index] = this.friendUpdated;
        }
      }
      this.selectedFriend = undefined;
      this.userSelected.emit(false); // Emitir false cuando se deselecciona un usuario
    }
  
  
    postFriend(): void{
  
      if (this.newFriendForm.valid) {
        console.log(this.newFriendForm.value)
        this.friendService.postFriend(this.newFriendForm.value).subscribe((res: any) => {
          console.log("Amigo añadido!!!", res.user);
          this.friends.push(res.friend);
          this.newFriendForm.reset();
        });
      } else {
        console.error("El formulario no es válido. No se puede agregar el usuario.");
      }
    } 
  
    showAddFriend(state: boolean) {
      this.showAddFriendForm = state;
      console.log("Cambio modo edición/lectura", this.showAddFriendForm);
    }
  
    onFriendSelected(selected: boolean): void {
      this.isFriendSelected = selected;
    }
  }
  


