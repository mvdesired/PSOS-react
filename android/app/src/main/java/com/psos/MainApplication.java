package com.psos;

import android.app.Application;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.imagepipeline.decoder.SimpleProgressiveJpegConfig;
import com.facebook.react.ReactApplication;
import cl.json.RNSharePackage;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.merryjs.PhotoViewer.MerryPhotoViewPackage;
import com.rnfs.RNFSPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.vonovak.AddCalendarEventPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSharePackage(),
            new RSSignatureCapturePackage(),
            new MerryPhotoViewPackage(),
            new RNFSPackage(),
            new ReactNativeDocumentPicker(),
            new ReactNativePushNotificationPackage(),
            new VectorIconsPackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new RNFusedLocationPackage(),
            new AddCalendarEventPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    ImagePipelineConfig config = ImagePipelineConfig.newBuilder(this)
    .setProgressiveJpegConfig(new SimpleProgressiveJpegConfig())
    .setResizeAndRotateEnabledForNetwork(true)
    .setDownsampleEnabled(true)
    .build();
    Fresco.initialize(this, config);
  }
}
