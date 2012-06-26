package hr.ngs.templater.example;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


public class CoffeeData {

  private static final String CREATE_TABLE = "sql/create-tables.sql";
  private static final String INSERT_DATA  = "sql/populate-tables.sql";
  private static String table;


  public Coffee getResultSet() throws Exception{
    Connection conn = getConnection();
    Statement stmt = conn.createStatement(
        ResultSet.TYPE_SCROLL_SENSITIVE,
        ResultSet.CONCUR_READ_ONLY);

    ExecuteSqlFromFile(stmt, CREATE_TABLE);
    //ExecuteSqlFromFile(stmt, INSERT_DATA);
    populateTables(stmt);



    ResultSet suppliers = stmt.executeQuery("SELECT * FROM SUPPLIERS");
    ResultSet coffees   = stmt.executeQuery("SELECT * FROM COFFEES");
    ResultSet cof_inventory = stmt.executeQuery("SELECT * FROM COF_INVENTORY");
    ResultSet merch_inventory = stmt.executeQuery("SELECT * FROM MERCH_INVENTORY");
    ResultSet coffee_houses   = stmt.executeQuery("SELECT * FROM COFFEE_HOUSES");



//    suppliers.close();
//    coffees.close();
//    cof_inventory.close();
//    merch_inventory.close();
//    coffee_houses.close();
    stmt.close();
    conn.close();
    return new Coffee(suppliers, coffees, cof_inventory, merch_inventory, coffee_houses);

  }

  private static Connection getConnection() throws Exception {
    Class.forName("org.hsqldb.jdbcDriver");
    String url = "jdbc:hsqldb:mem:data/coffee";

    return DriverManager.getConnection(url, "sa", "");
  }


  private static void ExecuteSqlFromFile(Statement stmt, String filePath) throws IOException, SQLException{
    Reader fis = new FileReader(new File(filePath));
    BufferedReader input = new BufferedReader(fis);
    String line = null;
    StringBuilder sqlStmt = new StringBuilder();
    while (( line = input.readLine()) != null){
      //System.out.println(line);
      sqlStmt.append(line);
      if (line.contains(";")) {
        //System.out.println("Executing statement: " + sqlStmt.toString());
        stmt.executeUpdate(sqlStmt.toString());
        sqlStmt = new StringBuilder();
      }
    }

  }

  private static void populateTables(Statement stmt) throws SQLException{
    StringBuilder insertStmt = new StringBuilder();
    for (int i = 1; i < 5000; i++){
      insertStmt.append("insert into COFFEES values('Colombian'," + i + ",7.99, 120, 440);");
    }

    for (int j = 1; j < 5001; j++){
      insertStmt.append("insert into SUPPLIERS values(" + j + ",  'Superior Coffee', '1 Party Place', 'Mendocino', 'CA', '95460');");

    }

    for (int k = 1; k < 101; k++){
      insertStmt.append("insert into COF_INVENTORY values(" + k + ", 'Colombian', 101, 0, '2006-04-01 00:00:00');");
    }

    for (int z =201; z < 301; z++){
      insertStmt.append("insert into MERCH_INVENTORY values(" + z + ", 'Cup_Large', 456, 28, '2006-04-01 00:00:00');");
    }

    for (int c = 301; c < 1301; c++){
      insertStmt.append("insert into COFFEE_HOUSES values(" + c + ", 'Mendocino', 3450, 2005, 5455);");
    }

    stmt.executeUpdate(insertStmt.toString());
  }


}