package com.android.swaralipi

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.android.swaralipi.databinding.ItemLyricsBinding
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.load.resource.bitmap.RoundedCorners
import com.facebook.imagepipeline.common.ResizeOptions
import com.facebook.imagepipeline.request.ImageRequestBuilder


/*
* Created by Alex Gomes.
* Date: 2023-01-23
* Time: 8:16 p.m.
*/

class LyricsAdapter(val lyricsList: ArrayList<Lyrics>) : RecyclerView.Adapter<LyricsAdapter.LyricsViewHolder>() {

    var context: Context? = null

    init {
        setHasStableIds(true)

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LyricsViewHolder {
        context = parent.context
        val child = ItemLyricsBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return LyricsViewHolder(child)
    }

    override fun onBindViewHolder(holder: LyricsViewHolder, position: Int) {

        context?.let { context ->

//            Glide.with(context)
//                .asBitmap()
////                .load("https://drive.google.com/uc?export=view&id="+lyricsList.get(position).fileId)
//                .load("https://drive.google.com/uc?export=download&id=1JUEPIlwA6R2OWTR4j2G6ciZWUjJjlNC7")
//                .transform(RoundedCorners(16.dpToPx))
//                .into(holder.itemBinding.ivLyrics)

            val imageRequest = ImageRequestBuilder.newBuilderWithSource(Uri.parse(lyricsList.get(position).url))
                .build()
            holder.itemBinding.ivLyrics.setImageRequest(imageRequest)
        }
    }

    override fun getItemCount(): Int {
        return lyricsList.size
    }

    override fun getItemId(position: Int): Long {
        return lyricsList.get(position).hashCode().toLong()
    }

    override fun onAttachedToRecyclerView(recyclerView: RecyclerView) {
        super.onAttachedToRecyclerView(recyclerView)

        recyclerView.addItemDecoration(GridItemDecoration(2, 8.dpToPx, false))

        recyclerView.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrollStateChanged(recyclerView: RecyclerView, newState: Int) {
                if (newState == RecyclerView.SCROLL_STATE_DRAGGING && isKeyBoardVisible(recyclerView)) {
                    hideKeyboard(recyclerView)
                }
            }
        })
    }

    inner class LyricsViewHolder(val itemBinding: ItemLyricsBinding) : RecyclerView.ViewHolder(itemBinding.root) {

        init {
            itemBinding.root.setOnClickListener {
                it.performHapticFeedback()

                Intent(context, LyricsDetailsActivity::class.java).also {
                    it.putExtra(Intent.EXTRA_INTENT, lyricsList.get(adapterPosition))
                    context?.startActivity(it)
                }

            }
        }
    }

}
