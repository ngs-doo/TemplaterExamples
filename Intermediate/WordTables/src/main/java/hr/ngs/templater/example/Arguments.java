package hr.ngs.templater.example;

import java.awt.*;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.util.*;
import java.util.List;

public class Arguments {
    public ResultSet Table1;
    public ResultSet Table2;
    public Object[][] DynamicResize;
    public Object[][] DynamicResizeAndMerge;
    public List<HashMap<String, Object>> Nulls;
    public ResultSet Table4;
    public ResultSet Table5;
    public Combined Combined;
    public List<Fixed> Fixed;

    public static Combined combined(String[] headers, Beer... beers) {
        Combined c = new Combined();
        c.Headers = new String[][]{ headers };
        c.Beers = beers;
        return c;
    }
    public static Beer beer(String name, Color color, String description, String... columns) {
        Beer b = new Beer();
        b.Name = name;
        b.Color = color;
        b.Description = description;
        b.Columns = new String[][] { columns };
        return b;
    }
    public static class Combined {
        public Beer[] Beers;
        public String[][] Headers;
    }
    public static class Beer {
        public String Name;
        public Color Color;
        public String Description;
        public String[][] Columns;
    }
    public static class Fixed {
        public final String Name;
        public final int Quantity;
        public final BigDecimal Price;

        public Fixed(String name, int quantity, BigDecimal price) {
            Name = name;
            Quantity = quantity;
            Price = price;
        }
    }
}
