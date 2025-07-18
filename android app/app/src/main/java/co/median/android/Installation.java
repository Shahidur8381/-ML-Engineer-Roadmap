package co.median.android;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import android.telephony.SubscriptionInfo;
import android.telephony.SubscriptionManager;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.UUID;

import co.median.median_core.AppConfig;
import co.median.median_core.GNLog;

/**
 * Created by weiyin on 8/8/14.
 */
public class Installation {
    private static final String TAG = Installation.class.getName();

    private static String sID = null;
    private static final String INSTALLATION = "INSTALLATION";

    public synchronized static String id(Context context) {
        if (sID == null) {
            File installation = new File(context.getFilesDir(), INSTALLATION);
            try {
                if (!installation.exists())
                    writeInstallationFile(installation);
                sID = readInstallationFile(installation);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return sID;
    }

    public static Map<String,Object> getInfo(Context context) {
        HashMap<String,Object> info = new HashMap<>();

        info.put("platform", "android");

        String publicKey = AppConfig.getInstance(context).publicKey;
        if (publicKey == null) publicKey = "";
        info.put("publicKey", publicKey);

        String packageName = context.getPackageName();
        info.put("appId", packageName);


        PackageManager manager = context.getPackageManager();
        try {
            PackageInfo packageInfo = manager.getPackageInfo(packageName, 0);
            info.put("appVersion", packageInfo.versionName);
            info.put("appVersionCode", packageInfo.versionCode);
        } catch (PackageManager.NameNotFoundException e) {
            GNLog.getInstance().logError(TAG, e.getMessage(), e);
        }

        String distribution;
        boolean isDebuggable =  ( 0 != ( context.getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE ) );
        if (isDebuggable) {
            distribution = "debug";
        } else {
            String installer = manager.getInstallerPackageName(packageName);
            if (installer == null) {
                distribution = "adhoc";
            } else if (installer.equals("com.android.vending") || installer.equals("com.google.market")) {
                distribution = "playstore";
            } else if (installer.equals("com.amazon.venezia")) {
                distribution = "amazon";
            } else {
                distribution = installer;
            }
        }
        info.put("distribution", distribution);

        info.put("language", Locale.getDefault().getLanguage());
        info.put("os", "Android");
        info.put("osVersion", Build.VERSION.RELEASE);
        info.put("model", Build.MANUFACTURER + " " + Build.MODEL);
        info.put("hardware", Build.FINGERPRINT);
        info.put("timeZone", TimeZone.getDefault().getID());
        info.put("deviceName", getDeviceName());

        SubscriptionManager subscriptionManager = SubscriptionManager.from(context);

        if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED) {
            List<String> carriers = new ArrayList<>();
            for (SubscriptionInfo subscriptionInfo : subscriptionManager.getActiveSubscriptionInfoList()) {
                carriers.add(subscriptionInfo.getCarrierName().toString());
            }
            info.put("carrierNames", carriers);
            try {
                info.put("carrierName", carriers.get(0));
            } catch ( IndexOutOfBoundsException e ) {
                Log.w(TAG, "getInfo: No carriers registered with subscription manager");
            }
        } else {
            Log.w(TAG, "getInfo: Cannot get carrierNames, READ_PHONE_STATE not granted");
        }

        info.put("installationId", Installation.id(context));

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            info.put("androidSha1", getSHA1(context));
        }

        return info;
    }

    private static String readInstallationFile(File installation) throws IOException {
        RandomAccessFile f = new RandomAccessFile(installation, "r");
        byte[] bytes = new byte[(int) f.length()];
        f.readFully(bytes);
        f.close();
        return new String(bytes);
    }

    private static void writeInstallationFile(File installation) throws IOException {
        FileOutputStream out = new FileOutputStream(installation);
        String id = UUID.randomUUID().toString();
        out.write(id.getBytes());
        out.close();
    }

    private static String getDeviceName() {
        String manufacturer = Build.MANUFACTURER;
        String model = Build.MODEL;
        String name;
        if (model.startsWith(manufacturer)) {
            name = model;
        } else {
            name = manufacturer + " " + model;
        }
        return name;
    }

    @RequiresApi(api = Build.VERSION_CODES.P)
    private static String getSHA1(Context context) {
        try {
            PackageInfo packageInfo = context.getPackageManager()
                    .getPackageInfo(context.getPackageName(), PackageManager.GET_SIGNING_CERTIFICATES);
            Signature[] signatures;
            if (packageInfo.signingInfo == null) {
                return "";
            }
            signatures = packageInfo.signingInfo.getApkContentsSigners();
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            md.update(signatures[0].toByteArray());
            byte[] digest = md.digest();
            StringBuilder toRet = new StringBuilder();
            for (byte b : digest) {
                toRet.append(String.format("%02X:", b));
            }
            if (toRet.length() > 0) {
                toRet.deleteCharAt(toRet.length() - 1); // Remove last colon
            }
            return toRet.toString();
        } catch (Exception e) {
            Log.e(TAG, "getSHA1: ", e);
        }
        return "";
    }
}