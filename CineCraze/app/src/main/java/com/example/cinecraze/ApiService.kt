package com.example.cinecraze

import retrofit2.Response
import retrofit2.http.GET

interface ApiService {
    @GET("cini/pagsure.json")
    suspend fun getData(): Response<CineCrazeData>
}
