package hr.ngs.templater.example;

import java.sql.ResultSet;
import java.util.*;

public class Arguments {
    public ResultSet Table1;
    public ResultSet Table2;
    public Object[][] DynamicResize;
    public Object[][] DynamicResizeAndMerge;
    public List<HashMap<String, Object>> Nulls;
    public ResultSet Table4;
    public Combined Combined;

    public static Combined combined(String[] headers, Beer... beers) {
        Combined c = new Combined();
        c.Headers = new String[][]{ headers };
        c.Beers = beers;
        return c;
    }
    public static Beer beer(String name, String description, String... columns) {
        Beer b = new Beer();
        b.Name = name;
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
        public String Description;
        public String[][] Columns;
    }
}
