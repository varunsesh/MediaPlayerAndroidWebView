package com.example.mediaplayer

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val webView = WebView(this)
        setContentView(webView)

        webView.settings.javaScriptEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.allowFileAccessFromFileURLs = true
        webView.settings.allowUniversalAccessFromFileURLs = true
        webView.webViewClient = WebViewClient()

        val html = assets.open("index.html").bufferedReader().use { it.readText() }

        webView.loadDataWithBaseURL(
            "file:///android_asset/",
            html,
            "text/html",
            "utf-8",
            null
        )
    }
}
