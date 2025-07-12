package com.example.cinecraze

data class Category(
    val MainCategory: String,
    val SubCategories: List<String>,
    val Entries: List<Entry>
)

data class Entry(
    val Title: String,
    val SubCategory: String,
    val Country: String,
    val Description: String,
    val Poster: String,
    val Thumbnail: String,
    val Rating: Number,
    val Servers: List<Server>,
    val Seasons: List<Season>?
)

data class Server(
    val name: String,
    val url: String,
    val subtitle1: String?,
    val subtitle2: String?
)

data class Season(
    val Season: Int,
    val SeasonPoster: String,
    val Episodes: List<Episode>
)

data class Episode(
    val Episode: Int,
    val Title: String,
    val Duration: String,
    val Description: String,
    val Thumbnail: String,
    val Servers: List<Server>
)

data class CineCrazeData(
    val Categories: List<Category>
)
