import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type DiaryEntry = {
    id : Nat;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    entryDate : Time.Time; // User-selected date for display/filtering
    title : Text;
    content : Text;
  };

  module DiaryEntry {
    public func compareByEntryDate(entry1 : DiaryEntry, entry2 : DiaryEntry) : Order.Order {
      switch (Int.compare(entry1.entryDate, entry2.entryDate)) {
        case (#equal) { Int.compare(entry1.updatedAt, entry2.updatedAt) };
        case (order) { order };
      };
    };
  };

  type DiaryEntriesByUser = Map.Map<Principal, List.List<DiaryEntry>>;
  let diaryEntriesByUser = Map.empty<Principal, List.List<DiaryEntry>>();
  var nextId = 1;

  public shared ({ caller }) func createDiaryEntry(title : Text, content : Text, entryDate : Time.Time) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create diary entries");
    };

    let newEntry : DiaryEntry = {
      id = nextId;
      createdAt = Time.now();
      updatedAt = Time.now();
      entryDate;
      title;
      content;
    };

    let userEntries = switch (diaryEntriesByUser.get(caller)) {
      case (null) {
        List.empty<DiaryEntry>();
      };
      case (?existingEntries) {
        existingEntries;
      };
    };

    userEntries.add(newEntry);
    diaryEntriesByUser.add(caller, userEntries);

    nextId += 1;
    newEntry.id;
  };

  public query ({ caller }) func getAllEntriesByDate() : async [DiaryEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can read diary entries");
    };

    switch (diaryEntriesByUser.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.toArray().sort(DiaryEntry.compareByEntryDate);
      };
    };
  };
};
