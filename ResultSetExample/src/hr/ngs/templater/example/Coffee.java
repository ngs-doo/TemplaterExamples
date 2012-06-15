package hr.ngs.templater.example;

import java.sql.ResultSet;

public class Coffee {
  public final ResultSet suppliers;
  public final ResultSet coffees;
  public final ResultSet cof_inventory;
  public final ResultSet merch_inventory;
  public final ResultSet coffee_houses;

  public Coffee(ResultSet suppliers, ResultSet coffees, ResultSet cof_inventory,
      ResultSet merch_inventory, ResultSet coffee_houses){
    this.suppliers       = suppliers;
    this.coffees         = coffees;
    this.cof_inventory   = cof_inventory;
    this.merch_inventory = merch_inventory;
    this.coffee_houses   = coffee_houses;

  }

}
