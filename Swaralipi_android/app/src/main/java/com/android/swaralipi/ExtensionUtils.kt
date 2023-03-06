package com.android.swaralipi

import android.content.Context
import android.content.res.Resources
import android.view.HapticFeedbackConstants
import android.view.View
import android.view.inputmethod.InputMethodManager
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

/*
* Created by Alex Gomes.
* Date: 2023-01-23
* Time: 11:33 p.m.
*/

/**
 * Convert given dp value to pixel
 */
val Int.dpToPx: Int get() = (this * Resources.getSystem().displayMetrics.density).toInt()

/**
 * Convert given dp value to pixel
 */
val Float.dpToPx: Float get() = (this * Resources.getSystem().displayMetrics.density)

/**
 * Convert given px value to dp
 */
val Int.pxToDp: Int get() = (this / Resources.getSystem().displayMetrics.density).toInt()

/**
 * Convert given sp value to px
 */
val Int.sp: Int get() = if (this == 0) 0 else Math.floor(Resources.getSystem().displayMetrics.scaledDensity * this.toDouble()).toInt()


fun hideKeyboard(view: View?) {
    if (view != null) {
        val inputManager = view.context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        inputManager.hideSoftInputFromWindow(view.windowToken, 0)
    }
}

fun isKeyBoardVisible(view: View): Boolean {
    ViewCompat.getRootWindowInsets(view)?.let {
        return it.isVisible(WindowInsetsCompat.Type.ime())
    }
    return false
}

fun View.performHapticFeedback() {
    this.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY, HapticFeedbackConstants.FLAG_IGNORE_GLOBAL_SETTING)
}
