package com.android.swaralipi

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.android.swaralipi.databinding.ActivityLyricsDetailsBinding
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.load.resource.bitmap.RoundedCorners
import com.facebook.imagepipeline.request.ImageRequestBuilder

/*
* Created by Alex Gomes.
* Date: 2023-01-24
* Time: 6:52 p.m.
*/

class LyricsDetailsActivity:AppCompatActivity() {

    private lateinit var binding: ActivityLyricsDetailsBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityLyricsDetailsBinding.inflate(LayoutInflater.from(this))

        setContentView(binding.root)


        val extras = intent.extras

        if(extras == null){
            finish()
            return
        }

        val lyrics = extras.get(Intent.EXTRA_INTENT) as Lyrics

//        Glide.with(this)
//            .asBitmap()
//            .load(lyrics.url)
//            .diskCacheStrategy(DiskCacheStrategy.AUTOMATIC)
//            .transform(RoundedCorners(16.dpToPx))
//            .into(binding.ivLyrics)

        val imageRequest = ImageRequestBuilder.newBuilderWithSource(Uri.parse(lyrics.url))
            .build()
        binding.ivLyrics.setImageRequest(imageRequest)

        if(lyrics.name.isNotEmpty()){
            binding.tv1.visibility = View.VISIBLE
            binding.lyricsName.visibility = View.VISIBLE
            binding.lyricsName.text = lyrics.name
        }

        if(lyrics.singer.isNotEmpty()){
            binding.tv2.visibility = View.VISIBLE
            binding.singerName.visibility = View.VISIBLE
            binding.singerName.text = lyrics.singer
        }


        if(lyrics.author.isNotEmpty()){
            binding.tv3.visibility = View.VISIBLE
            binding.authorName.visibility = View.VISIBLE
            binding.authorName.text = lyrics.author
        }

        if(lyrics.type.isNotEmpty()){
            binding.tv4.visibility = View.VISIBLE
            binding.lyricsType.visibility = View.VISIBLE
            binding.lyricsType.text = lyrics.type
        }
    }
}