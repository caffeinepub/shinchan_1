import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type OldDiaryEntry = {
    id : Nat;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    entryDate : Time.Time;
    title : Text;
    content : Text;
  };

  type OldDiaryEntriesByUser = Map.Map<Principal, List.List<OldDiaryEntry>>;

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, { name : Text }>;
    diaryEntriesByUser : OldDiaryEntriesByUser;
    nextId : Nat;
  };

  type NewUserProfile = {
    displayName : Text;
    bio : Text;
    avatarUrl : Text;
    createdAt : Time.Time;
  };

  type NewPost = {
    id : Nat;
    author : Principal;
    content : Text;
    imageUrl : ?Text;
    createdAt : Time.Time;
    likesCount : Nat;
  };

  type NewComment = {
    id : Nat;
    postId : Nat;
    author : Principal;
    content : Text;
    createdAt : Time.Time;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    nextPostId : Nat;
    nextCommentId : Nat;
    posts : Map.Map<Nat, NewPost>;
    follows : Map.Map<Principal, List.List<Principal>>;
    likes : Map.Map<Nat, List.List<Principal>>;
    comments : Map.Map<Nat, List.List<NewComment>>;
  };

  public func run(old : OldActor) : NewActor {
    let userProfiles = old.userProfiles.map<Principal, { name : Text }, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          displayName = oldProfile.name;
          bio = "";
          avatarUrl = "";
          createdAt = Time.now();
        };
      }
    );

    let posts = Map.empty<Nat, NewPost>();
    let follows = Map.empty<Principal, List.List<Principal>>();
    let likes = Map.empty<Nat, List.List<Principal>>();
    let comments = Map.empty<Nat, List.List<NewComment>>();

    {
      accessControlState = old.accessControlState;
      userProfiles;
      nextPostId = 1;
      nextCommentId = 1;
      posts;
      follows;
      likes;
      comments;
    };
  };
};
