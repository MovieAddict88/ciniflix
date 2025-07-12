package com.example.cinecraze

import android.app.Application
import android.content.Context

class CineCrazeApp : Application() {

    override fun onCreate() {
        super.onCreate()
        appContext = applicationContext
    }

    companion object {
        lateinit var appContext: Context
    }
}
