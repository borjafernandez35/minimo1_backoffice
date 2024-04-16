import { ObjectId } from "mongoose";

export interface Friend {
    _id: string;
    nameFriends: string,
    likes: String;
    age: Number;
    activities?: [],
    comments?: [],
    state?: Boolean;
    
  }