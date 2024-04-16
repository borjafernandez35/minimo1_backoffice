import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';;
import { User } from '../models/user';
import { Friend } from '../models/friend';
import { Activity } from '../models/activity';
import { Comment } from '../models/comment';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { CommentDetailsComponent } from '../comment-details/comment-details.component';
import { UserService } from '../services/user.service';
import { ActivityService } from '../services/activity.service';
import { FriendService } from '../services/friend.service';

@Component({
  selector: 'app-friend-details',
  standalone: true,
  imports: [FormsModule, NgIf, UpperCasePipe, CommonModule, ActivityDetailsComponent, CommentDetailsComponent,  ReactiveFormsModule],
  templateUrl: './friend-details.component.html',
  styleUrl: './friend-details.component.css'
})
export class FriendDetailsComponent {

  @Input() friend?: Friend;
  @Output() deselect = new EventEmitter<void>();
  @Output() showPostDetails = new EventEmitter<Activity>();
  @Output() friendUpdated = new EventEmitter<Friend>();
  @Output() activitySelected = new EventEmitter<boolean>();
  @Output() commentSelected = new EventEmitter<boolean>();

  editFriendForm: FormGroup;
  selectedActivity?: Activity;
  activityUpdated?: Activity;
  selectedComment?: Comment;
  commentUpdated?: Comment;

  activities: Activity[] = [];
  comments: Comment[] = [];
  friends: Friend [] = [];

  editFriend: Friend=   {  '_id': '',
  'nameFriends': '',
 'likes':'',
 'age':
};

  showActivityDetails: any;
  showCommentDetails:any;

constructor(public friendService: FriendService, public activityService: ActivityService, private formBuilder: FormBuilder) {
  this.editFriendForm = this.formBuilder.group({
    nameFriends:['', [Validators.required]],
    likes: ['', [Validators.required]],
    age: ['', [Validators.required]]
  });

  // Comprobar si hay un usuario recibido como entrada y actualizar el formulario si es necesario
}

public updateFormWithUserData(friend: Friend): void {
  // Actualizar los valores del formulario con los datos del usuario
  this.editFriendForm.patchValue({
    nameFriend: friend.nameFriends,
    likes: friend.likes,
    age: friend.age
    
  });
}

  update: boolean= false;
  isActivitySelected: boolean = false;
  isCommentSelected: boolean = false;


  ngOnInit() {
    if (this.friend) {
      this.updateFormWithFriendData(this.user);
    } 
    
    this.activities = this.user?.activities ?? [];
    this.comments = this.user?.comments ?? [];
  }
 
  onActivityUpdated(activity: Activity): void {
    this.activityUpdated = activity;
  }

  showActivity(activity: Activity): void {
    this.showActivityDetails.emit(activity);
  }

  onCommentUpdated(comment: Comment): void {
    this.commentUpdated = comment;
  }

  showComment(comment: Comment): void {
    this.showCommentDetails.emit(comment);
  }

  updateEdit(state: boolean) {
    this.update = state;
    console.log("Cambio modo edición/lectura", this.update);
  }

  updateUser(): void {

    const formData = this.editUserForm.value;
    this.editUser = {
      _id: this.user?._id!, // Usamos el _id del usuario actual
      name: {
        first_name: formData.name.first_name,
        middle_name: formData.name.middle_name,
        last_name: formData.name.last_name
      },
      email: formData.email,
      phone_number: formData.phone_number,
      gender: formData.gender
    };

    this.userService.updateUser(this.editUser).subscribe (editUser =>{
      this.user =   {
        '_id': this.editUser?._id!,
      'name': {
       'first_name': this.editUser?.name.first_name!,
       'middle_name': this.editUser?.name.middle_name!,
       'last_name': this.editUser?.name.last_name!,
     },
     'email':this.editUser?.email!,
     'phone_number':this.editUser?.phone_number!,
     'gender': this.editUser?.gender! 
    } 
      this.userUpdated.emit(this.editUser);
    });
  }

  onSelect(activity: Activity): void {
    this.selectedActivity = activity;
    this.isActivitySelected = true;
    this.activitySelected.emit(true);
  }

  deselectActivity(): void {
    if (this.selectedActivity && this.activityUpdated) {
      const index = this.activities.findIndex(activity => activity._id === this.selectedActivity!._id);
      if (index !== -1) {
        this.activities[index] = this.activityUpdated;
      }
    }
     
    this.selectedActivity = undefined;
    this.isActivitySelected = false;
    this.activitySelected.emit(false); 
  }

  onSelectComment(comment: Comment): void {
    this.selectedComment = comment;
    this.isCommentSelected = true;
    this.commentSelected.emit(true);
  }

  deselectComment(): void {
    if (this.selectedComment && this.commentUpdated) {
      const index = this.comments.findIndex(comment => comment._id === this.selectedComment!._id);
      if (index !== -1) {
        this.comments[index] = this.commentUpdated;
      }
    }
     
    this.selectedComment = undefined;
    this.isCommentSelected = false;
    this.commentSelected.emit(false); 
  } 


}
