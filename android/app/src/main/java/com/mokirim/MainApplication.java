package com.mokirim;

import android.app.Application;
import android.util.Base64;
import android.util.Log;
import android.content.pm.PackageInfo;
import android.content.pm.Signature;
import android.content.pm.PackageManager;
import android.widget.Toast;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

//import org.pgsqlite.SQLitePluginPackage;


import java.security.MessageDigest;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      //packages.add(new SQLitePluginPackage());
      return packages;
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
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
    String kod = null;
    try {
      PackageInfo info = getPackageManager().getPackageInfo(
              "com.mokirim",
              PackageManager.GET_SIGNATURES);
      for (Signature signature : info.signatures) {
        MessageDigest md = MessageDigest.getInstance("SHA");
        md.update(signature.toByteArray());
        kod = Base64.encodeToString(md.digest(), Base64.DEFAULT);
        //Log.d("KeyHash:", kod);
        //Toast.makeText(getApplicationContext(),kod,Toast.LENGTH_SHORT).show();
      }
    } catch (Exception exc) {
    }
    SoLoader.init(this, /* native exopackage */ false);
  }
}
