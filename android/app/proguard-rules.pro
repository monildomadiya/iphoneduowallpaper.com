# kotlinx.serialization keeps its generated serializers on the annotated classes.
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.**
-keepclassmembers class com.iphoneduowallpaper.admin.data.** {
    *** Companion;
}
-keepclasseswithmembers class com.iphoneduowallpaper.admin.data.** {
    kotlinx.serialization.KSerializer serializer(...);
}
