# Razorpay checkout - rules from razorpay_flutter's README; without them R8
# strips classes the SDK loads reflectively and checkout crashes in release.
-keepattributes *Annotation*
-dontwarn com.razorpay.**
-keep class com.razorpay.** {*;}
-optimizations !method/inlining/
-keepclasseswithmembers class * {
  public void onPayment*(...);
}
-keepattributes JavascriptInterface
-keepclassmembers class * {
  @android.webkit.JavascriptInterface <methods>;
}

# Agora video calls - native code calls back into these Java classes by name.
-keep class io.agora.** { *; }
-dontwarn io.agora.**
