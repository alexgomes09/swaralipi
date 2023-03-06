package com.android.swaralipi

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.addTextChangedListener
import androidx.recyclerview.widget.GridLayoutManager
import com.android.swaralipi.API.APIClient
import com.android.swaralipi.databinding.ActivityLyricsListBinding
import com.bumptech.glide.Glide
import com.facebook.drawee.backends.pipeline.Fresco
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.MainScope
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.concurrent.Executors


class LyricsListActivity : AppCompatActivity(), CoroutineScope by MainScope() {

    private lateinit var binding: ActivityLyricsListBinding
    private val lyricsList: ArrayList<Lyrics> = arrayListOf()
    private val mainHandler = Handler(Looper.getMainLooper())
    private val waitBeforeSearch = 800L //ms
    private lateinit var lyricsAdapter: LyricsAdapter


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lyrics_list)

        binding = ActivityLyricsListBinding.inflate(LayoutInflater.from(this))
        setContentView(binding.root)


//        // must run on main thread
//        Glide.get(getApplicationContext()).clearMemory();
//
//        // must run in background thread
//        Executors.newSingleThreadExecutor().execute {
//            Glide.get(getApplicationContext()).clearDiskCache();
//        }

        binding.rvLyrics.layoutManager = GridLayoutManager(this, 2)

        lyricsAdapter = LyricsAdapter(lyricsList)
        binding.rvLyrics.adapter = lyricsAdapter

        setListeners()


        Fresco.initialize(this);

    }

    private fun setListeners() {
        binding.input.addTextChangedListener {
            mainHandler.removeCallbacks(searchRunnable)
            mainHandler.postDelayed(searchRunnable, waitBeforeSearch)
        }
    }

    private val searchRunnable = Runnable {

        val input = binding.input.text.toString()

        if (input.isEmpty()) return@Runnable

        APIClient.search(input, object : Callback<ArrayList<Lyrics>> {
            override fun onResponse(call: Call<ArrayList<Lyrics>>, response: Response<ArrayList<Lyrics>>) {

                if (response.isSuccessful) {

                    response.body()?.let {

                        lyricsList.clear()

                        if (it.isEmpty()) {
                            binding.emptyContainer.visibility = View.VISIBLE
                        } else {
                            binding.emptyContainer.visibility = View.GONE

                            lyricsList.addAll(it)
                        }
                        lyricsAdapter.notifyDataSetChanged()
                    }
                }
            }

            override fun onFailure(call: Call<ArrayList<Lyrics>>, t: Throwable) {
                Log.v("TESTING", "LyricsListActivity.onFailure ${t.message}")
            }
        })
    }

}