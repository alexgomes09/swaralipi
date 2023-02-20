package com.android.swaralipi

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/*
* Created by Alex Gomes.
* Date: 2023-01-23
* Time: 8:19 p.m.
*/

@Parcelize
class Lyrics(
    val fileId:String = "",
    val name:String = "",
    val singer:String = "",
    val author:String = "",
    val type:String = "",
    val url:String = ""
): Parcelable {

}