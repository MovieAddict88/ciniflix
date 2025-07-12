package com.app.yourvideoschannelapps.rests;

import com.app.yourvideoschannelapps.callbacks.CallbackCategories;
import com.app.yourvideoschannelapps.callbacks.CallbackCategoryDetails;
import com.app.yourvideoschannelapps.callbacks.CallbackListVideo;
import com.app.yourvideoschannelapps.callbacks.CallbackSettings;
import com.app.yourvideoschannelapps.callbacks.CallbackVideoDetail;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.Query;

public interface ApiInterface {

    String CACHE = "Cache-Control: max-age=0";
    String AGENT = "Data-Agent: Your Videos Channel";

    @Headers({CACHE, AGENT})
    @GET("api/get_videos")
    Call<CallbackListVideo> getVideos(
            @Query("page") int page,
            @Query("count") int count,
            @Query("sort") String sort,
            @Query("api_key") String api_key
    );

    @Headers({CACHE, AGENT})
    @GET("api/get_post_detail")
    Call<CallbackVideoDetail> getVideoDetail(
            @Query("id") String id
    );

    @Headers({CACHE, AGENT})
    @GET("api/get_category_index")
    Call<CallbackCategories> getAllCategories(
            @Query("api_key") String api_key
    );

    @Headers({CACHE, AGENT})
    @GET("api/get_category_videos")
    Call<CallbackCategoryDetails> getCategoryVideos(
            @Query("id") int id,
            @Query("page") int page,
            @Query("count") int count,
            @Query("sort") String sort,
            @Query("api_key") String api_key
    );

    @Headers({CACHE, AGENT})
    @GET("api/get_search_results")
    Call<CallbackListVideo> getSearchPosts(
            @Query("search") String search,
            @Query("count") int count,
            @Query("api_key") String api_key
    );

    @Headers({CACHE, AGENT})
    @GET("api/get_config")
    Call<CallbackSettings> getConfig(
            @Query("package_name") String package_name,
            @Query("api_key") String api_key
    );

}
