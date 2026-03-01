import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    displayName : Text;
    bio : Text;
    avatarUrl : Text;
    createdAt : Time.Time;
  };

  public type Post = {
    id : Nat;
    author : Principal;
    content : Text;
    imageUrl : ?Text;
    createdAt : Time.Time;
    likesCount : Nat;
  };

  public type Comment = {
    id : Nat;
    postId : Nat;
    author : Principal;
    content : Text;
    createdAt : Time.Time;
  };

  // User profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Posts (mapping post ID to Post)
  var nextPostId = 1;
  let posts = Map.empty<Nat, Post>();

  // Follow relationships (mapping follower principal to their following principals)
  let follows = Map.empty<Principal, List.List<Principal>>();

  // Likes (mapping postId to principal list of those who liked it)
  let likes = Map.empty<Nat, List.List<Principal>>();

  // Comments (mapping postId to list of comments)
  let comments = Map.empty<Nat, List.List<Comment>>();
  var nextCommentId = 1;

  // ---- Required profile methods for frontend ----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  // ---- Profile Management ----

  public shared ({ caller }) func createProfile(displayName : Text, bio : Text, avatarUrl : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can create a profile");
    };

    let profile : UserProfile = {
      displayName;
      bio;
      avatarUrl;
      createdAt = Time.now();
    };

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func updateProfile(displayName : Text, bio : Text, avatarUrl : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update a profile");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?existing) {
        let updatedProfile : UserProfile = {
          displayName;
          bio;
          avatarUrl;
          createdAt = existing.createdAt;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // ---- Post Management ----

  public shared ({ caller }) func createPost(content : Text, imageUrl : ?Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can create posts");
    };

    if (content.size() > 500) {
      Runtime.trap("Content exceeds max length (500 chars)");
    };

    let postId = nextPostId;
    let post : Post = {
      id = postId;
      author = caller;
      content;
      imageUrl;
      createdAt = Time.now();
      likesCount = 0;
    };

    posts.add(postId, post);
    nextPostId += 1;
    postId;
  };

  public query ({ caller }) func getPosts() : async [Post] {
    posts.values().toArray();
  };

  public query ({ caller }) func getPostsByUser(user : Principal) : async [Post] {
    posts.values().toArray().filter(
      func(post : Post) : Bool {
        post.author == user;
      }
    );
  };

  // ---- Likes ----

  public shared ({ caller }) func likePost(postId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can like posts");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existingPost) {
        let currentLikes = switch (likes.get(postId)) {
          case (null) { List.empty<Principal>() };
          case (?l) { l };
        };

        if (currentLikes.any(func(user : Principal) : Bool { user == caller })) {
          Runtime.trap("Already liked");
        } else {
          currentLikes.add(caller);
          likes.add(postId, currentLikes);

          let updatedPost : Post = {
            existingPost with
            likesCount = currentLikes.size();
          };
          posts.add(postId, updatedPost);
        };
      };
    };
  };

  public shared ({ caller }) func unlikePost(postId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can unlike posts");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existingPost) {
        switch (likes.get(postId)) {
          case (null) {
            Runtime.trap("Not liked yet");
          };
          case (?existingLikes) {
            if (not existingLikes.any(func(user : Principal) : Bool { user == caller })) {
              Runtime.trap("Not liked yet");
            } else {
              let filteredLikes = existingLikes.filter(
                func(user : Principal) : Bool { user != caller }
              );

              if (filteredLikes.isEmpty()) {
                likes.remove(postId);
              } else {
                likes.add(postId, filteredLikes);
              };

              let updatedPost : Post = {
                existingPost with
                likesCount = filteredLikes.size();
              };
              posts.add(postId, updatedPost);
            };
          };
        };
      };
    };
  };

  // ---- Follow Relationships ----

  public shared ({ caller }) func followUser(userToFollow : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can follow others");
    };

    if (userToFollow == caller) {
      Runtime.trap("Cannot follow yourself");
    };

    switch (userProfiles.get(userToFollow)) {
      case (null) { Runtime.trap("User not found") };
      case (?_) {
        let currentFollowings = switch (follows.get(caller)) {
          case (null) { List.empty<Principal>() };
          case (?f) { f };
        };

        if (currentFollowings.any(func(user : Principal) : Bool { user == userToFollow })) {
          Runtime.trap("Already following this user");
        } else {
          currentFollowings.add(userToFollow);
          follows.add(caller, currentFollowings);
        };
      };
    };
  };

  public shared ({ caller }) func unfollowUser(userToUnfollow : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can unfollow others");
    };

    if (userToUnfollow == caller) {
      Runtime.trap("Cannot unfollow yourself");
    };

    let currentFollowings = switch (follows.get(caller)) {
      case (null) { List.empty<Principal>() };
      case (?f) { f };
    };

    if (not currentFollowings.any(func(user : Principal) : Bool { user == userToUnfollow })) {
      Runtime.trap("Not following this user");
    } else {
      let filteredFollowings = currentFollowings.filter(
        func(user : Principal) : Bool { user != userToUnfollow }
      );

      if (filteredFollowings.isEmpty()) {
        follows.remove(caller);
      } else {
        follows.add(caller, filteredFollowings);
      };
    };
  };

  public query ({ caller }) func getFollowers(user : Principal) : async [Principal] {
    let allFollowers = follows.toArray();
    let followers = List.empty<Principal>();

    for ((follower, followingList) in allFollowers.values()) {
      if (followingList.any(func(followedUser : Principal) : Bool { followedUser == user })) {
        followers.add(follower);
      };
    };

    followers.toArray();
  };

  public query ({ caller }) func getFollowing(user : Principal) : async [Principal] {
    switch (follows.get(user)) {
      case (null) { [] };
      case (?followings) {
        followings.toArray();
      };
    };
  };

  // ---- Comments ----

  public shared ({ caller }) func addComment(postId : Nat, content : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can add comments");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?_) {
        let commentId = nextCommentId;
        let comment : Comment = {
          id = commentId;
          postId;
          author = caller;
          content;
          createdAt = Time.now();
        };

        let currentComments = switch (comments.get(postId)) {
          case (null) { List.empty<Comment>() };
          case (?existing) { existing };
        };

        currentComments.add(comment);
        comments.add(postId, currentComments);
        nextCommentId += 1;
        commentId;
      };
    };
  };

  public query ({ caller }) func getComments(postId : Nat) : async [Comment] {
    switch (comments.get(postId)) {
      case (null) { [] };
      case (?postComments) {
        postComments.toArray();
      };
    };
  };
};
