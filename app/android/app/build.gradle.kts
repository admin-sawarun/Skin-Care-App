import java.util.Properties

plugins {
    id("com.android.application")
    id("com.google.gms.google-services")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

// Play Store release signing. key.properties + the .jks it points at are
// gitignored (see android/.gitignore) - anyone building release locally
// without them falls back to the debug key below, same as before this was
// added, so `flutter run --release` still works out of the box for a fresh
// checkout that hasn't been handed the real keystore.
val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
val hasReleaseKeystore = keystorePropertiesFile.exists()
if (hasReleaseKeystore) {
    keystoreProperties.load(keystorePropertiesFile.inputStream())
}

android {
    namespace = "com.skincare.app"
    // permission_handler_android 14.x hardcodes compileSdk 37; keep the app in
    // step with it (flutter.compileSdkVersion lags behind at 36).
    compileSdk = 37
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
        // flutter_local_notifications' AAR requires this even though the app
        // itself doesn't use java.time - see its README's "desugaring" section.
        isCoreLibraryDesugaringEnabled = true
    }

    defaultConfig {
        // One app for both User and Doctor logins - see lib/main.dart and
        // lib/app_router.dart. The phone+OTP login screen alone decides which
        // role's screens to show, based on the server's response.
        applicationId = "com.skincare.app"
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        // flutter_local_notifications requires desugared java.time APIs for
        // backwards compatibility, which in turn requires multidex below minSdk 21.
        multiDexEnabled = true
    }

    signingConfigs {
        if (hasReleaseKeystore) {
            create("release") {
                storeFile = file(keystoreProperties.getProperty("storeFile"))
                storePassword = keystoreProperties.getProperty("storePassword")
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        release {
            signingConfig = if (hasReleaseKeystore) signingConfigs.getByName("release") else signingConfigs.getByName("debug")
        }
    }
}

dependencies {
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
