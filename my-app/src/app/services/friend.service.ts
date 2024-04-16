import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Friend } from '../models/friend';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private http:HttpClient) { }



  getFriends(page:Number,limit:Number) {
    return this.http.get<Friend[]>('http://127.0.0.1:3000/friend/'+ page + '/' + limit);
  }

  postFriend(newFriend : Friend |undefined) {
    return this.http.post('http://127.0.0.1:3000/friend', newFriend);
  }

  updateFriend(editFriend : Friend) {
    return this.http.put('http://127.0.0.1:3000/friend/'+ editFriend._id, editFriend);
  }

}
