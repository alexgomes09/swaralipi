package com.android.swaralipi

import android.animation.ObjectAnimator
import android.animation.PropertyValuesHolder
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import androidx.appcompat.app.AppCompatActivity
import com.android.swaralipi.databinding.ActivitySplashBinding


/*
* Created by Alex Gomes.
* Date: 2023-01-16
* Time: 6:39 p.m.
*/
class SplashScreenActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySplashBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        binding = ActivitySplashBinding.inflate(LayoutInflater.from(this))
        setContentView(binding.root)

        val scaleDown: ObjectAnimator = ObjectAnimator.ofPropertyValuesHolder(
            binding.icon,
            PropertyValuesHolder.ofFloat("scaleX", 1.1f),
            PropertyValuesHolder.ofFloat("scaleY", 1.1f)
        )
        scaleDown.duration = 1000

        scaleDown.repeatCount = ObjectAnimator.INFINITE
        scaleDown.repeatMode = ObjectAnimator.REVERSE

        scaleDown.start()


//        if(BuildConfig.DEBUG){
//            finish()
//            startActivity(Intent(this, LyricsListActivity::class.java))
//            return
//        }

        Handler(Looper.getMainLooper()).postDelayed({
            finish()
            startActivity(Intent(this, LyricsListActivity::class.java))
        }, 2000)


    }
}
