package com.lavaworld;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
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
            new RNUUIDGeneratorPackage(),
            new ReactSliderPackage(),
            new AsyncStoragePackage(),
            new NetInfoPackage(),
            new ReactNativeAudioPackage(),
            new RNSoundPackage(),
            new RNDeviceInfo(),
            new RNFetchBlobPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage(),
            new PickerPackage(),
            new RCTCapturePackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage()
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
  }
}
