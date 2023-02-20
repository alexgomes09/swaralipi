package com.android.swaralipi.API;
/*
 * Created by Alex Gomes.
 * Date: 2023-01-23
 * Time: 12:35 a.m.
 */

import com.android.swaralipi.Lyrics;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

interface APIService {

 @FormUrlEncoded
 @POST("/searchLyrics")
 Call<ArrayList<Lyrics>> search(@Field("q") String query);
}
