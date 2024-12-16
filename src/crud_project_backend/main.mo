import Array "mo:base/Array";
import Text "mo:base/Text";
actor {
    // Define the Item type
  type Item = {
    name: Text;
    price: Text; // Using Text for price (can change to Nat if numeric)
    quantity: Text; // Using Text for quantity (can change to Nat if numeric)
  };
  // Stable variable to store items
  stable var items: [Item] = [];
  stable var migrationDone: Bool = false;
public func migrateItems(): async Text {
  if (not migrationDone) {
    items := Array.map<Item, Item>(items, func(item: Item): Item {
      {
        name = item.name;
        price = item.price;
        quantity = item.quantity;
      }
    });
    migrationDone := true;
    return "Migration complete!";
  } else {
    return "Migration already completed.";
  };
};
   // List all items
  public query func listItems(): async [Item] {
    return items;
  };
  public func addItem(newName: Text, newPrice: Text,newQty: Text): async Text{
    let newItem: Item = {
      name = newName;
      price = newPrice;
      quantity = newQty;
    };
    items := Array.append(items, [newItem]);
    return "Item added!";
  };

  public func updateItem(index: Nat, newName: Text, newPrice: Text, newQty: Text): async Text {
  if (index < Array.size(items)) {
   items := Array.tabulate< Item>(
      Array.size(items),
      func(i: Nat): Item {
        if (i == index) {
          {
            name = newName;
            price = newPrice;
            quantity = newQty;
          }
        } else {
          items[i];
        }
      }
    );
    return "Item updated!";
  } else {
    return "Invalid index!";
  };
};
public func deleteItem(index: Nat): async Text {
  if (index < Array.size(items)) {
    items := Array.tabulate<Item>(
      Array.size(items) - 1, // New size is one less than the current size
      func(i: Nat): Item {
        if (i < index) {
          items[i]; // Copy items before the index
        } else {
          items[i + 1]; // Skip the item at the index
        }
      }
    );
    return "Item deleted!";
  } else {
    return "Invalid index!";
  };
};
};
