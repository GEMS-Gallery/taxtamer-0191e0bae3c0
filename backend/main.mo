import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor {
  // Define the TaxPayer type
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store TaxPayer records
  stable var taxPayersEntries : [(Nat, TaxPayer)] = [];

  // Create a HashMap to store TaxPayer records
  var taxPayers = HashMap.HashMap<Nat, TaxPayer>(0, Nat.equal, Nat.hash);

  // Initialize the HashMap with stable data
  taxPayers := HashMap.fromIter<Nat, TaxPayer>(taxPayersEntries.vals(), 0, Nat.equal, Nat.hash);

  // Create a new TaxPayer record
  public func createTaxPayer(tid: Nat, firstName: Text, lastName: Text, address: Text) : async Bool {
    let newTaxPayer : TaxPayer = {
      tid = tid;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };

    let existingTaxPayer = taxPayers.get(tid);
    switch (existingTaxPayer) {
      case (null) {
        taxPayers.put(tid, newTaxPayer);
        true
      };
      case (?_) {
        false // TaxPayer with this TID already exists
      };
    }
  };

  // Get all TaxPayer records
  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Get a TaxPayer by TID
  public query func getTaxPayerByTID(tid: Nat) : async ?TaxPayer {
    taxPayers.get(tid)
  };

  // System functions for upgrades
  system func preupgrade() {
    taxPayersEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayersEntries := [];
  };
}
