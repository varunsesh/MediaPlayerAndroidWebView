// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.2.2" apply false
    id("com.android.library") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.10" apply false
}


buildscript {
    dependencies {
        classpath("com.android.tools.build:gradle:8.2.2")
    }
}
