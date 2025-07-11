// Sample Data Structure for the Streaming Webpage
// This data would typically come from a backend API in a real application.

const allData = {
    carousel: [
        {
            id: "movie-001",
            type: "movies", // Explicitly defining type for carousel items
            title: "Epic Adventure in the Mountains",
            description: "A thrilling journey of explorers seeking a lost artifact in treacherous peaks.",
            thumbnail: "https://picsum.photos/seed/carousel1/800/450", // Placeholder
            duration: "2h 15m",
            sources: [
                { server_name: "HD 1080p", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", type: "video/mp4" },
                { server_name: "SD 720p", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", type: "video/mp4" }
            ],
            subtitles: [
                { lang: "en", label: "English", url: "assets/subtitles/sample_en.vtt", default: true },
                { lang: "es", label: "Español", url: "assets/subtitles/sample_es.vtt" }
            ]
        },
        {
            id: "tvseries-001",
            type: "tvseries",
            title: "Chronicles of the Future City",
            description: "In a dystopian future, a group of rebels fights for freedom.",
            thumbnail: "https://picsum.photos/seed/carousel2/800/450", // Placeholder
            // For series, specific episode sources are in the main tvseries array
        },
        {
            id: "livetv-001",
            type: "livetv",
            title: "Live News Broadcast",
            description: "24/7 coverage of global events.",
            thumbnail: "https://picsum.photos/seed/carousel3/800/450", // Placeholder
            sources: [ // Live TV might use M3U8
                { server_name: "Main Feed", url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8", type: "application/x-mpegURL" } // Sample HLS
            ]
        }
    ],
    movies: [
        {
            id: "movie-001", // Same as carousel for consistency
            title: "Epic Adventure in the Mountains",
            description: "A thrilling journey of explorers seeking a lost artifact in treacherous peaks. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            thumbnail: "https://picsum.photos/seed/movie1/400/225",
            duration: "2h 15m",
            categories: ["action", "adventure"],
            subcategories: ["action", "adventure"], // Can be more granular
            genre: "Action", // Simplified for filtering
            view_count: "1.2M views",
            upload_date: "3 days ago",
            channel_info: { name: "Adventure Studios", avatar: "https://picsum.photos/seed/avatar1/40/40" },
            sources: [
                { server_name: "4K Ultra HD", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", type: "video/mp4" },
                { server_name: "HD 1080p", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", type: "video/mp4" },
                { server_name: "SD 720p", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", type: "video/mp4" }
            ],
            subtitles: [
                { lang: "en", label: "English", url: "assets/subtitles/sample_en.vtt", default: true },
                { lang: "es", label: "Español", url: "assets/subtitles/sample_es.vtt" }
            ],
            // Example of embed link
            embeds: [
                // { platform: "youtube", id: "dQw4w9WgXcQ" } // Rick Astley - Never Gonna Give You Up
            ]
        },
        {
            id: "movie-002",
            title: "Comedy Nights",
            description: "A hilarious stand-up special guaranteed to make you laugh. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
            thumbnail: "https://picsum.photos/seed/movie2/400/225",
            duration: "1h 30m",
            categories: ["comedy"],
            subcategories: ["comedy", "standup"],
            genre: "Comedy",
            view_count: "800K views",
            upload_date: "1 week ago",
            channel_info: { name: "Laugh Factory", avatar: "https://picsum.photos/seed/avatar2/40/40" },
            sources: [
                { server_name: "HD", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", type: "video/mp4" },
            ],
            embeds: [
                 { platform: "youtube", id: "L_LUpnjgPso" } // Sample short YouTube video
            ]
        },
        {
            id: "movie-003",
            title: "The Last Stand",
            description: "A gripping drama about a soldier's final battle. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
            thumbnail: "https://picsum.photos/seed/movie3/400/225",
            duration: "2h 05m",
            categories: ["drama", "war"],
            subcategories: ["drama"],
            genre: "Drama",
            view_count: "2.5M views",
            upload_date: "2 months ago",
            channel_info: { name: "War Stories Inc.", avatar: "https://picsum.photos/seed/avatar3/40/40" },
            sources: [
                { server_name: "Best Quality", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", type: "video/mp4" },
                { server_name: "Low Bandwidth", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackNavigation.mp4", type: "video/mp4" }
            ],
            subtitles: [
                { lang: "en", label: "English", url: "assets/subtitles/sample_en.vtt" }
            ]
        }
    ],
    tvseries: [
        {
            id: "tvseries-001", // Same as carousel
            title: "Chronicles of the Future City",
            description: "In a dystopian future, a group of rebels fights for freedom against an oppressive regime. Each episode unveils new challenges and deeper conspiracies.",
            thumbnail: "https://picsum.photos/seed/tvseries1/400/225",
            categories: ["scifi", "drama"],
            subcategories: ["scifi", "dystopian"],
            genre: "Sci-Fi",
            view_count: "5M total views",
            upload_date: "Last updated 1 day ago",
            channel_info: { name: "Future Productions", avatar: "https://picsum.photos/seed/avatar4/40/40" },
            type: "tvseries", // Important for player logic
            seasons: [
                {
                    season_number: 1,
                    episodes: [
                        {
                            episode_number: 1,
                            title: "The Awakening",
                            description: "A young hacker discovers a hidden truth about the city's AI.",
                            thumbnail: "https://picsum.photos/seed/s1e1/400/225",
                            duration: "45m",
                            sources: [
                                { server_name: "1080p", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", type: "video/mp4" }
                            ],
                            subtitles: [
                                { lang: "en", label: "English", url: "assets/subtitles/sample_en.vtt", default: true },
                                { lang: "de", label: "Deutsch", url: "assets/subtitles/sample_de.vtt" }
                            ]
                        },
                        {
                            episode_number: 2,
                            title: "First Contact",
                            description: "The rebels make their first move against the corporation.",
                            thumbnail: "https://picsum.photos/seed/s1e2/400/225",
                            duration: "47m",
                            sources: [
                                { server_name: "1080p", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4", type: "video/mp4" }
                            ],
                            subtitles: [
                                { lang: "en", label: "English", url: "assets/subtitles/sample_en.vtt", default: true }
                            ]
                        }
                    ]
                },
                {
                    season_number: 2,
                    episodes: [
                        {
                            episode_number: 1,
                            title: "New Alliances",
                            description: "The rebellion grows, seeking help from unexpected places.",
                            thumbnail: "https://picsum.photos/seed/s2e1/400/225",
                            duration: "50m",
                            sources: [
                                { server_name: "HD", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", type: "video/mp4" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "tvseries-002",
            title: "Office Pranks Reloaded",
            description: "A mockumentary following the hilarious antics of office workers.",
            thumbnail: "https://picsum.photos/seed/tvseries2/400/225",
            categories: ["comedy"],
            subcategories: ["comedy", "mockumentary"],
            genre: "Comedy",
            type: "tvseries",
            seasons: [
                {
                    season_number: 1,
                    episodes: [
                        {
                            episode_number: 1, title: "The Stapler Incident", duration: "22m", sources: [{ server_name: "SD", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", type: "video/mp4"}]
                        },
                        {
                            episode_number: 2, title: "Whose Lunch Is It Anyway?", duration: "23m", sources: [{ server_name: "SD", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", type: "video/mp4"}]
                        }
                    ]
                }
            ]
        }
    ],
    livetv: [
        {
            id: "livetv-001", // Same as carousel
            title: "Global News Network",
            description: "Live breaking news and analysis from around the world.",
            thumbnail: "https://picsum.photos/seed/livetv1/400/225",
            categories: ["news"],
            subcategories: ["news", "current_events"],
            genre: "News",
            type: "livetv",
            sources: [ // M3U8 for HLS streams are common for live TV
                { server_name: "HD Stream", url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8", type: "application/x-mpegURL" },
                { server_name: "SD Stream (Low Bandwidth)", url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8", type: "application/x-mpegURL" } // Using same for sample
            ]
        },
        {
            id: "livetv-002",
            title: "Sports Arena Live",
            description: "Catch all the action from major league sports.",
            thumbnail: "https://picsum.photos/seed/livetv2/400/225",
            categories: ["sports"],
            subcategories: ["sports", "football", "basketball"],
            genre: "Sports",
            type: "livetv",
            sources: [
                { server_name: "Main Channel", url: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8", type: "application/x-mpegURL" } // Another sample HLS
            ]
        }
    ]
};

// It's good practice to also create dummy subtitle files if your example links to them
// For example, create assets/subtitles/sample_en.vtt
/*
WEBVTT

00:00:01.000 --> 00:00:05.000
This is a sample English subtitle.

00:00:06.000 --> 00:00:10.000
Appearing at different timecodes.

*/
// and assets/subtitles/sample_es.vtt
/*
WEBVTT

00:00:01.000 --> 00:00:05.000
Este es un subtítulo de ejemplo en español.

00:00:06.000 --> 00:00:10.000
Apareciendo en diferentes códigos de tiempo.

*/
// And assets/subtitles/sample_de.vtt
/*
WEBVTT

00:00:01.000 --> 00:00:05.000
Dies ist ein Beispieluntertitel in deutscher Sprache.

00:00:06.000 --> 00:00:10.000
Erscheint zu unterschiedlichen Zeitcodes.

*/

// Note: The actual video URLs are samples from Google's gtv-videos-bucket or Apple's HLS examples.
// They might not be permanently available or suitable for all types of testing.
// For YouTube embeds, ensure you use valid Video IDs.
// For other platforms like Google Drive, Mega.nz, VidSrc, the embedding mechanism can be complex
// and might require specific iframe attributes or API interactions not covered by simple URL embedding.
// The `embeds` array is a placeholder for how you might structure this data.
// Actual playback of these would need more specific logic in scripts.js.

console.log("Sample data loaded into allData.");
