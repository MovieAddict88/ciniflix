package com.example.cinecraze

import android.app.Activity
import android.content.Intent
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.cinecraze.databinding.ItemEntryBinding

class EntryAdapter(private val entries: List<Entry>) : RecyclerView.Adapter<EntryAdapter.EntryViewHolder>() {

    init {
        AdsManager.loadInterstitialAd(CineCrazeApp.appContext)
        AdsManager.loadRewardedAd(CineCrazeApp.appContext)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EntryViewHolder {
        val binding = ItemEntryBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return EntryViewHolder(binding)
    }

    override fun onBindViewHolder(holder: EntryViewHolder, position: Int) {
        holder.bind(entries[position])
    }

    override fun getItemCount() = entries.size

    inner class EntryViewHolder(private val binding: ItemEntryBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(entry: Entry) {
            Glide.with(binding.root.context)
                .load(entry.Poster)
                .into(binding.entryPoster)

            binding.root.setOnClickListener {
                val context = binding.root.context
                AdsManager.showInterstitialAd(context as Activity) {
                    val intent = Intent(context, PlayerActivity::class.java).apply {
                        // Assuming the first server is the one to play.
                        // You might want to add logic to select a specific server.
                        putExtra("video_url", entry.Servers.firstOrNull()?.url)
                    }
                    context.startActivity(intent)
                }
            }
        }
    }
}
