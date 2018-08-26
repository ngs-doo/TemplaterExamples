package hr.ngs.templater.example;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Random;

public class CoffeeData {
    public Coffee getResultSet() throws Exception {
        Connection conn = getConnection();
        Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);

        executeSqlFromStream(stmt, CoffeeData.class.getResourceAsStream("/create-tables.sql"));
        populateTables(stmt);

        ResultSet suppliers = stmt.executeQuery("SELECT * FROM SUPPLIERS");
        ResultSet coffees = stmt.executeQuery("SELECT * FROM COFFEES");
        ResultSet cof_inventory = stmt.executeQuery("SELECT * FROM COF_INVENTORY");
        ResultSet merch_inventory = stmt.executeQuery("SELECT * FROM MERCH_INVENTORY");
        ResultSet coffee_houses = stmt.executeQuery("SELECT * FROM COFFEE_HOUSES");

        stmt.close();
        conn.close();
        return new Coffee(suppliers, coffees, cof_inventory, merch_inventory, coffee_houses);
    }

    private static Connection getConnection() throws Exception {
        Class.forName("org.hsqldb.jdbcDriver");
        final String url = "jdbc:hsqldb:mem:data/coffee";

        return DriverManager.getConnection(url, "sa", "");
    }

    private static void executeSqlFromStream(final Statement stmt, InputStream stream) throws IOException, SQLException {
        final BufferedReader input = new BufferedReader(new InputStreamReader(stream));
        try {
            String line;
            StringBuilder sqlStmt = new StringBuilder();
            while ((line = input.readLine()) != null) {
                sqlStmt.append(line);
                if (line.contains(";")) {
                    stmt.executeUpdate(sqlStmt.toString());
                    sqlStmt = new StringBuilder();
                }
            }
        } finally {
            input.close();
        }
    }

    private static void populateTables(final Statement stmt) throws SQLException {
        final StringBuilder insertStmt = new StringBuilder();
        final Random r = new Random();

        for (int i = 1; i < 5000; i++) {
            final int id = r.nextInt(500);
            final float price = r.nextFloat() * r.nextInt(50);
            final int sales = r.nextInt(100);
            final int total = r.nextInt(500);
            insertStmt.append("insert into COFFEES values('Colombian'," + id + "," + price + "," + sales + "," + total + ");");
        }

        for (int j = 1; j < 5001; j++) {
            final String state = getRandomString(2);
            final int zip = r.nextInt(20000);
            insertStmt.append("insert into SUPPLIERS values(" + j + ",  'Superior Coffee', '1 Party Place', 'Mendocino', '" + state + "', '" + zip + "');");

        }

        for (int k = 1; k < 101; k++) {
            final int id = r.nextInt(4000);
            final int quantity = r.nextInt(200);
            insertStmt.append("insert into COF_INVENTORY values(" + k + ", 'Colombian'," + id + ", " + quantity + ", '2006-04-01 00:00:00');");
        }

        for (int z = 201; z < 301; z++) {
            final int id = r.nextInt(6000);
            final int quantity = r.nextInt(400);
            insertStmt.append("insert into MERCH_INVENTORY values(" + z + ", 'Cup_Large'," + id + "," + quantity + ", '2006-04-01 00:00:00');");
        }

        for (int c = 301; c < 1301; c++) {
            final int coffee = r.nextInt(2000);
            final int merch = r.nextInt(3000);
            final int total = r.nextInt(4000);
            insertStmt.append("insert into COFFEE_HOUSES values(" + c + ", 'Mendocino'," + coffee + "," + merch + "," + total + ");");
        }

        stmt.executeUpdate(insertStmt.toString());
    }

    private static String getRandomString(final int length) {
        int i = 0;
        final String range = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        final Random r = new Random();
        final StringBuilder sb = new StringBuilder();
        while (i < length) {
            sb.append(range.charAt(r.nextInt(range.length())));
            i++;
        }
        return sb.toString();
    }
}
