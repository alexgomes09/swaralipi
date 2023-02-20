package com.android.swaralipi.API

import android.os.Debug
import android.provider.SyncStateContract
import com.android.swaralipi.API.APIClient.API_BASE_URL
import com.android.swaralipi.BuildConfig
import com.android.swaralipi.Lyrics
import com.google.gson.Gson
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Callback
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.X509TrustManager

/*
* Created by Alex Gomes.
* Date: 2023-01-23
* Time: 12:34 a.m.
*/

object APIClient {

    private val apiService: APIService
    private const val API_BASE_URL =  "https://swaralipi.onrender.com"//"http://localhost:8080/"

    init {

        val x509TrustManager: X509TrustManager = object : X509TrustManager {
            override fun checkClientTrusted(chain: Array<X509Certificate?>?, authType: String?) {}
            override fun checkServerTrusted(chain: Array<X509Certificate?>?, authType: String?) {}
            override fun getAcceptedIssuers(): Array<X509Certificate?> {
                return arrayOf()
            }
        }

        val sslContext: SSLContext = SSLContext.getInstance("SSL")
        sslContext.init(null, arrayOf(x509TrustManager), SecureRandom())

        val client = OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .sslSocketFactory(sslContext.socketFactory,x509TrustManager)
            .hostnameVerifier { hostname, session -> true }


        if (BuildConfig.DEBUG) {
            val bodyInterceptor = HttpLoggingInterceptor()
            bodyInterceptor.level = HttpLoggingInterceptor.Level.BODY
            client.addInterceptor(bodyInterceptor)
        }

        val retrofit = Retrofit.Builder()
            .baseUrl(API_BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(client.build())
            .build()

        apiService = retrofit.create(APIService::class.java)
    }

    fun search(q:String, callback: Callback<ArrayList<Lyrics>>){
        apiService.search(q).enqueue(callback)
    }
}