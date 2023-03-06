package app.mesmerize.custom

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.util.AttributeSet
import android.view.View
import com.android.swaralipi.R

/*
* Created by Alex Gomes.
* Date: 2023-01-24
* Time: 10:02 AM
*
* Purpose is to have simple gradient view and minimize the creation of gradient shape xml file
*   - however this view is not only limited to have gradient
*   - you can provide same start, end color and provide rounded edge. Now you will have capsule like shape
*/

class GradientView : View {

    private var cornerRadius = 0f
    private var flatCorner = -1
    private var gradientAngle = 0
    private var strokeWidth = 0f
    private var strokeColor = Color.TRANSPARENT

    constructor(context: Context) : super(context) {
        init(context, null)
    }

    constructor(context: Context, attrs: AttributeSet?) : super(context, attrs) {
        init(context, attrs)
    }

    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(context, attrs, defStyleAttr) {
        init(context, attrs)
    }

    private fun init(context: Context, attrs: AttributeSet? = null) {

        val attributes = context.obtainStyledAttributes(attrs, R.styleable.GradientView)

        cornerRadius = attributes.getDimension(R.styleable.GradientView_corner_radius, 0f)
        val startColor = attributes.getColor(R.styleable.GradientView_start_color, Color.TRANSPARENT)
        val endColor = attributes.getColor(R.styleable.GradientView_end_color, Color.TRANSPARENT)
        gradientAngle = attributes.getInt(R.styleable.GradientView_gradient_angle, 0)
        flatCorner = attributes.getInt(R.styleable.GradientView_flat_corner, -1)
        strokeWidth = attributes.getDimension(R.styleable.GradientView_stroke_width, 0f)
        strokeColor = attributes.getInt(R.styleable.GradientView_stroke_color, Color.TRANSPARENT)

        attributes.recycle()

        setColors(startColor, endColor)
    }

    fun setColors(startColor: Int = Color.TRANSPARENT, endColor: Int = Color.TRANSPARENT) {
        GradientDrawable(GradientDrawable.Orientation.values()[gradientAngle], intArrayOf(startColor, endColor)).let {

            //TopLeftRadius, TopLeftRadius, TopRightRadius, TopRightRadius, BottomRightRadius, BottomRightRadius, BottomLeftRadius, BottomLeftRadius
            val corner = floatArrayOf(cornerRadius, cornerRadius, cornerRadius, cornerRadius, cornerRadius, cornerRadius, cornerRadius, cornerRadius)

            when (flatCorner) {
                0 -> { //flat top
                    corner[0] = 0f
                    corner[1] = 0f
                    corner[2] = 0f
                    corner[3] = 0f
                }
                1 -> { //flat top_left
                    corner[0] = 0f
                    corner[1] = 0f
                }
                2 -> { //flat top_right
                    corner[2] = 0f
                    corner[3] = 0f
                }
                3 -> { //flat bottom
                    corner[4] = 0f
                    corner[5] = 0f
                    corner[6] = 0f
                    corner[7] = 0f
                }
                4 -> { //flat bottom_left
                    corner[6] = 0f
                    corner[7] = 0f
                }
                5 -> { //flat bottom_right
                    corner[4] = 0f
                    corner[5] = 0f
                }
                6 -> { //flat left
                    corner[0] = 0f
                    corner[1] = 0f
                    corner[6] = 0f
                    corner[7] = 0f
                }
                7 -> { //flat right
                    corner[2] = 0f
                    corner[3] = 0f
                    corner[4] = 0f
                    corner[5] = 0f
                }
            }

            it.mutate()
            it.cornerRadii = corner
            it.setStroke(strokeWidth.toInt(), strokeColor)
            background = it
        }
    }

}