## Android support

Since v3.2.0 Templater also works on Android.

Due to inadequate XML support in Android, custom XML library has to be used.
This can be done by registering Xalan XML library.

### Setting up dependencies

    dependencies {
      implementation 'hr.ngs.templater:templater:3.2.0'
      implementation 'xalan:xalan:2.7.2'
      implementation 'xerces:xercesImpl:2.12.0'
    }

### Changing the XML library in Templater

    System.getProperties().setProperty(
      "templater:DocumentBuilderFactory", 
      org.apache.xerces.jaxp.DocumentBuilderFactoryImpl.class.getName()
    );

### Image support

Since Android does not support Java awt package, default image converters must be disabled. This is done during initialization:

    Configuration.builder().builtInLowLevelPlugins(false).build()

To use images Templater image type: `ImageInfo` should be used.