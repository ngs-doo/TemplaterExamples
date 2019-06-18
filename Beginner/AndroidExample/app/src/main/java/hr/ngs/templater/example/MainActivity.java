package hr.ngs.templater.example;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.FileProvider;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    templaterHelloWorld();
                } catch (IOException e) {
                    Toast.makeText(getApplicationContext(), e.getMessage(), Toast.LENGTH_LONG).show();
                }
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private void templaterHelloWorld() throws IOException {

        // check to see if we have permission to write to file
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {

            // check to see if Android will ask the user for permission
            if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                Toast.makeText(this, "Please add permission to write to file", Toast.LENGTH_LONG).show();
            } else {
                // Have Android ask the user for permission
                ActivityCompat.requestPermissions(
                        this,
                        new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},
                        1);
            }
        } else {
            File folder = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            File output = new File(folder, "output.docx");
            FileOutputStream fos = new FileOutputStream(output);
            Templater.createDocument(
                    getResources().openRawResource(R.raw.template),
                    "docx",
                    fos,
                    new TagClass("tag"),
                    new TagList().add("A-1", "B-1").add("A-2", "B-2")
            );
            fos.close();

            Uri docxFile = FileProvider.getUriForFile(MainActivity.this, BuildConfig.APPLICATION_ID + ".provider", output);
            Intent showFile = new Intent(Intent.ACTION_VIEW);
            showFile.setDataAndType(docxFile, "application/msword");
            showFile.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            try {
                startActivity(showFile);
            } catch (Exception ex) {
                Toast.makeText(getApplicationContext(), ex.getMessage(), Toast.LENGTH_LONG).show();
                Intent showFolder = new Intent(Intent.ACTION_VIEW);
                Uri docxPath = FileProvider.getUriForFile(MainActivity.this, BuildConfig.APPLICATION_ID + ".provider", folder);
                showFolder.setDataAndType(docxPath, "*/*");
                showFile.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                startActivity(showFolder);
            }
        }
    }

    public static class TagClass {
        public final String tag;
        public TagClass(String tag) {
            this.tag = tag;
        }
    }
    public static class TagList {
        public final List<Map> list = new ArrayList<>();
        public TagList add(String a, String b) {
            Map map = new HashMap();
            map.put("a", a);
            map.put("b", b);
            list.add(map);
            return this;
        }
    }
}
