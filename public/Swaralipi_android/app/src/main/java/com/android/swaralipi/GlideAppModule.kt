package com.android.swaralipi

import android.content.Context
import android.util.Log
import com.bumptech.glide.GlideBuilder
import com.bumptech.glide.annotation.GlideModule
import com.bumptech.glide.module.AppGlideModule

/*
* Created by Alex Gomes.
* Date: 2023-01-23
* Time: 11:09 p.m.
*/

@GlideModule
class GlideAppModule: AppGlideModule() {
    override fun applyOptions(context: Context, builder: GlideBuilder) {
        super.applyOptions(context, builder)

        builder.setLogLevel(Log.VERBOSE)

    }
}