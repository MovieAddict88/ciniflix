// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log("Streaming Page Script Loaded");

    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
    } else {
        // Check system preference if no theme is set
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        }
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        let theme = 'light-mode'; // Default to light
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
        }
        localStorage.setItem('theme', theme);
    });
     // Listen for changes in system preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) { // Only apply if user hasn't manually set a theme
            if (event.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });


    // --- PAGE ELEMENTS ---
    const mainContent = document.querySelector('main');
    const videoPlayerPage = document.getElementById('video-player-page');
    const videoGrid = document.getElementById('video-grid');
    const carouselSection = document.getElementById('carousel-section');

    // Desktop navigation
    const desktopNavLinks = document.querySelectorAll('.desktop-nav .dropdown-content a');

    // Mobile navigation
    const mobileNavButtons = document.querySelectorAll('#mobile-bottom-nav button');
    const mobileSubcategoryDrawer = document.getElementById('mobile-subcategory-drawer');

    // Video Player
    const videoPlayer = videojs('my-video');
    const videoTitlePlayer = document.getElementById('video-title-player');
    const videoDescriptionPlayer = document.getElementById('video-description-player');
    const qualitySelect = document.getElementById('quality-select');
    const subtitleSelect = document.getElementById('subtitle-select');
    const episodeNavigation = document.getElementById('episode-navigation');
    const prevEpisodeBtn = document.getElementById('prev-episode-btn');
    const nextEpisodeBtn = document.getElementById('next-episode-btn');
    const episodeInfo = document.getElementById('episode-info');

    let currentPlayingData = null; // To store data of the video being played
    let currentSeasonIndex = 0;
    let currentEpisodeIndex = 0;

    // --- DATA ---
    // Assuming `allData` is loaded from data.js and available globally or passed appropriately
    // For now, let's check if it exists.
    if (typeof allData === 'undefined') {
        console.error("Error: 'allData' is not defined. Make sure data.js is loaded and defines 'allData'.");
        // You could load a default empty structure or show an error message to the user.
        window.allData = {
            carousel: [],
            movies: [],
            tvseries: [],
            livetv: []
        };
    }


    // --- INITIAL LOAD ---
    function init() {
        populateCarousel(allData.carousel);
        // Initially, display all movies, or a default category
        populateVideoGrid(getAllItems()); // Display all items initially
        setupCategoryEventListeners();
        setupLazyLoader();
    }

    function getAllItems() {
        return [...allData.movies, ...allData.tvseries, ...allData.livetv];
    }

    // --- LAZY LOADING ---
    let lazyLoadObserver;

    function setupLazyLoader() {
        lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: "0px 0px 200px 0px" }); // Load images 200px before they enter viewport
    }

    function observeLazyImage(imgElement) {
        if (lazyLoadObserver && imgElement) {
            lazyLoadObserver.observe(imgElement);
        }
    }

    // --- CAROUSEL ---
    function populateCarousel(carouselItems) {
        if (!carouselSection) return;
        carouselSection.innerHTML = ''; // Clear existing items
        // Simple carousel for now, can be enhanced with libraries or custom JS
        const carouselInner = document.createElement('div');
        carouselInner.className = 'carousel-inner'; // Add a class for styling if needed

        carouselItems.forEach(item => {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item'; // Add a class for styling
            // Use data-src for lazy loading
            carouselItem.innerHTML = `
                <img data-src="${item.thumbnail}" alt="${item.title}" class="lazy" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="> <!-- Tiny transparent gif -->
                <div class="carousel-caption">
                    <h3>${item.title}</h3>
                    <p>${item.description.substring(0,100)}...</p>
                    <button class="play-carousel-btn" data-id="${item.id}" data-type="${item.type || getItemType(item.id)}">Play</button>
                </div>
            `;
            carouselInner.appendChild(carouselItem);
            const img = carouselItem.querySelector('img.lazy');
            if (img) observeLazyImage(img);
        });
        carouselSection.appendChild(carouselInner);

        document.querySelectorAll('.play-carousel-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                const itemType = e.target.dataset.type;
                const item = findItemByIdAndType(itemId, itemType);
                if (item) {
                    openVideoPlayer(item);
                }
            });
        });
    }

    // --- VIDEO GRID ---
    function populateVideoGrid(items) {
        if (!videoGrid) return;
        videoGrid.innerHTML = ''; // Clear existing items
        if (items.length === 0) {
            videoGrid.innerHTML = '<p>No items found for this category.</p>';
            return;
        }
        items.forEach(item => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            // Use data-src for lazy loading and a placeholder src
            videoItem.innerHTML = `
                <img data-src="${item.thumbnail}" alt="${item.title}" class="thumbnail lazy" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">
                <div class="info">
                    <h3>${item.title}</h3>
                    <p>${item.duration || ''} - ${item.type || getItemType(item.id)}</p>
                </div>
            `;
            videoItem.addEventListener('click', () => openVideoPlayer(item));
            videoGrid.appendChild(videoItem);
            const img = videoItem.querySelector('img.lazy');
            if (img) observeLazyImage(img);
        });
    }

    // --- CATEGORY FILTERING ---
    function setupCategoryEventListeners() {
        // Desktop
        desktopNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                const subcategory = e.target.dataset.subcategory;
                filterContent(category, subcategory);
            });
        });

        // Mobile
        mobileNavButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mainCategory = e.target.dataset.mainCategory;
                openMobileSubcategories(mainCategory);
            });
        });
    }

    function openMobileSubcategories(mainCategory) {
        mobileSubcategoryDrawer.innerHTML = ''; // Clear previous
        let subcategories = [];

        // Define subcategories - this could also come from data.json if more dynamic
        const categoryLinks = {
            movies: [
                { name: 'All Movies', subcategory: 'all' },
                { name: 'Action', subcategory: 'action' },
                { name: 'Comedy', subcategory: 'comedy' },
                { name: 'Drama', subcategory: 'drama' }
            ],
            tvseries: [
                { name: 'All TV Series', subcategory: 'all' },
                { name: 'Drama', subcategory: 'drama' },
                { name: 'Comedy', subcategory: 'comedy' },
                { name: 'Sci-Fi', subcategory: 'scifi' }
            ],
            livetv: [
                { name: 'All Live TV', subcategory: 'all' },
                { name: 'News', subcategory: 'news' },
                { name: 'Sports', subcategory: 'sports' }
            ]
        };

        if (categoryLinks[mainCategory]) {
            categoryLinks[mainCategory].forEach(sub => {
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = sub.name;
                link.dataset.category = mainCategory;
                link.dataset.subcategory = sub.subcategory;
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    filterContent(mainCategory, sub.subcategory);
                    mobileSubcategoryDrawer.classList.remove('open'); // Hide drawer after selection
                });
                mobileSubcategoryDrawer.appendChild(link);
            });
            mobileSubcategoryDrawer.classList.add('open');
        }
    }

    // Optional: Close drawer if clicking outside of it
    document.addEventListener('click', function(event) {
        const isClickInsideDrawer = mobileSubcategoryDrawer.contains(event.target);
        const isClickOnMobileNavButton = Array.from(mobileNavButtons).some(btn => btn.contains(event.target));

        if (!isClickInsideDrawer && !isClickOnMobileNavButton && mobileSubcategoryDrawer.classList.contains('open')) {
            mobileSubcategoryDrawer.classList.remove('open');
        }
    });


    function filterContent(category, subcategory) {
        console.log(`Filtering for: ${category}, Subcategory: ${subcategory}`);
        let itemsToDisplay = [];
        const sourceData = allData[category];

        if (sourceData) {
            if (subcategory === 'all') {
                itemsToDisplay = sourceData;
            } else {
                itemsToDisplay = sourceData.filter(item =>
                    item.subcategories && item.subcategories.includes(subcategory) ||
                    item.genre && item.genre.toLowerCase() === subcategory.toLowerCase() // Fallback for simple genre
                );
            }
        }
        populateVideoGrid(itemsToDisplay);
    }

    // --- SEARCH FUNCTIONALITY ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) {
            populateVideoGrid(getAllItems()); // Show all if search is empty
            return;
        }
        const allItems = getAllItems();
        const filteredItems = allItems.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm))
        );
        populateVideoGrid(filteredItems);
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });


    // --- VIEW TOGGLE (GRID/LIST) ---
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');

    gridViewBtn.addEventListener('click', () => {
        videoGrid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
        videoGrid.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });


    // --- VIDEO PLAYER LOGIC ---
    function openVideoPlayer(itemData) {
        currentPlayingData = itemData;
        mainContent.style.display = 'none'; // Hide main content grid
        videoPlayerPage.style.display = 'block'; // Show player page
        document.body.scrollTop = 0; // Scroll to top
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

        videoTitlePlayer.textContent = itemData.title;
        videoDescriptionPlayer.textContent = itemData.description || "No description available.";

        // Reset player and selectors
        videoPlayer.reset();
        qualitySelect.innerHTML = '';
        subtitleSelect.innerHTML = '<option value="">None</option>'; // Default "None" option

        // Handle TV series episodes
        if (itemData.type === 'tvseries' && itemData.seasons && itemData.seasons.length > 0) {
            episodeNavigation.style.display = 'flex';
            currentSeasonIndex = 0; // Default to first season
            currentEpisodeIndex = 0; // Default to first episode
            loadEpisode();
        } else { // For Movies or LiveTV, or Series without detailed episodes
            episodeNavigation.style.display = 'none';
            if (itemData.embeds && itemData.embeds.length > 0) {
                switchToIframePlayer(itemData.embeds[0]);
                loadSubtitles([]); // Subtitles usually not controllable for iframes via Video.js
            } else {
                switchToVideoJsPlayer(itemData.sources || []);
                loadSubtitles(itemData.subtitles || []);
            }
        }
    }

    function loadEpisode() {
        const season = currentPlayingData.seasons[currentSeasonIndex];
        const episode = season.episodes[currentEpisodeIndex];

        if (!episode) {
            console.error("Episode data not found!");
            return;
        }

        videoTitlePlayer.textContent = `${currentPlayingData.title} - S${season.season_number} E${episode.episode_number}: ${episode.title}`;
        episodeInfo.textContent = `S${season.season_number} E${episode.episode_number}`;

        // Decide player type based on episode data
        if (episode.embeds && episode.embeds.length > 0) {
            switchToIframePlayer(episode.embeds[0]); // Use first embed
            loadSubtitles([]); // Subtitles usually not controllable for iframes via Video.js
        } else {
            switchToVideoJsPlayer(episode.sources || []);
            loadSubtitles(episode.subtitles || []);
        }

        // Update button states
        prevEpisodeBtn.disabled = (currentSeasonIndex === 0 && currentEpisodeIndex === 0);
        const isLastEpisodeInSeason = currentEpisodeIndex >= season.episodes.length - 1;
        const isLastSeason = currentSeasonIndex >= currentPlayingData.seasons.length - 1;
        nextEpisodeBtn.disabled = isLastEpisodeInSeason && isLastSeason;
    }

    const playerContainer = document.getElementById('sticky-player-container');

    function switchToIframePlayer(embedData) {
        if (videoPlayer) {
            videoPlayer.dispose(); // Clean up existing Video.js player
            videoPlayer = null;
        }
        playerContainer.innerHTML = ''; // Clear container

        let iframeHtml = '';
        if (embedData.platform === "youtube") {
            console.log(`Playing YouTube embed: ${embedData.id}`);
            iframeHtml = `<iframe id="youtube-player" width="100%" height="100%" src="https://www.youtube.com/embed/${embedData.id}?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else if (embedData.platform === "googledrive" || embedData.platform === "vidsrc" || embedData.platform === "mega.nz") {
            console.log(`Playing generic embed: ${embedData.url}`);
            // Note: Sandboxing might be needed for untrusted iframes: sandbox="allow-scripts allow-same-origin allow-presentation"
            // However, allow-scripts and allow-same-origin might be needed by the embed itself.
            // For sites like vidsrc, they often handle their own player UI.
            iframeHtml = `<iframe id="generic-iframe-player" width="100%" height="100%" src="${embedData.url}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            console.warn("Unsupported embed platform:", embedData.platform);
            playerContainer.innerHTML = '<p>Unsupported embed type.</p>';
            return;
        }

        playerContainer.innerHTML = iframeHtml;
        qualitySelect.style.display = 'none';
        subtitleSelect.style.display = 'none';
        episodeNavigation.style.display = currentPlayingData.type === 'tvseries' ? 'flex' : 'none'; // Keep episode nav if it's a series
    }

    function switchToVideoJsPlayer(sources) {
        if (document.getElementById('youtube-player') || document.getElementById('generic-iframe-player')) {
            // If an iframe was there, clear it
            playerContainer.innerHTML = '';
        }

        if (!document.getElementById('my-video')) {
            // If video tag doesn't exist, create it
            const videoTagHtml = `
            <video id="my-video" class="video-js vjs-big-play-centered" controls preload="auto" data-setup='{ "fluid": true }'>
                <p class="vjs-no-js">
                    To view this video please enable JavaScript, and consider upgrading to a
                    web browser that <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>.
                </p>
            </video>`;
            playerContainer.innerHTML = videoTagHtml;
        }

        if (!videoPlayer || videoPlayer.isDisposed()) {
             videoPlayer = videojs('my-video', { fluid: true });
        }

        qualitySelect.innerHTML = ''; // Clear previous options
        if (!sources || sources.length === 0) {
            console.warn("No video sources found for this item.");
            if(videoPlayer) videoPlayer.src({}); // Clear player source
            qualitySelect.style.display = 'none';
            subtitleSelect.style.display = 'none'; // Also hide subtitle if no source
            return;
        }

        qualitySelect.style.display = 'block';
        subtitleSelect.style.display = 'block'; // Show subtitle selector if sources exist

        sources.forEach((source, index) => {
            const option = document.createElement('option');
            option.value = index; // Use index to retrieve source from array
            option.textContent = source.server_name || source.quality || `Source ${index + 1}`;
            qualitySelect.appendChild(option);
        });

        qualitySelect.onchange = () => {
            const selectedSource = sources[qualitySelect.value];
            videoPlayer.src({ src: selectedSource.url, type: selectedSource.type || 'video/mp4' });
            videoPlayer.play();
        };

        // Load the first source by default
        if (sources.length > 0) {
            qualitySelect.value = "0";
            videoPlayer.src({ src: sources[0].url, type: sources[0].type || 'video/mp4' });
        }
    }

    function loadSubtitles(subtitles) {
        subtitleSelect.innerHTML = '<option value="">None</option>'; // Reset
        // Remove existing text tracks
        const existingTracks = videoPlayer.remoteTextTracks();
        let i = existingTracks.length;
        while (i--) {
            videoPlayer.removeRemoteTextTrack(existingTracks[i]);
        }

        if (!subtitles || subtitles.length === 0) {
            subtitleSelect.disabled = true;
            return;
        }

        subtitleSelect.disabled = false;
        subtitles.forEach((sub, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = sub.label;
            subtitleSelect.appendChild(option);

            // Add track to video.js player
            videoPlayer.addRemoteTextTrack({
                kind: 'subtitles',
                src: sub.url,
                srclang: sub.lang,
                label: sub.label,
                default: sub.default === true
            }, false); // `false` means don't trigger manual `addtrack` event handling by Video.js if any
        });

        subtitleSelect.onchange = () => {
            const tracks = videoPlayer.remoteTextTracks();
            for (let i = 0; i < tracks.length; i++) {
                tracks[i].mode = 'hidden'; // Hide all first
            }
            if (subtitleSelect.value !== "") {
                const selectedTrackIndex = parseInt(subtitleSelect.value);
                // The track added via addRemoteTextTrack might not be in the same order
                // It's better to find by label or srclang if possible
                const selectedLabel = subtitles[selectedTrackIndex].label;
                for (let i = 0; i < tracks.length; i++) {
                    if (tracks[i].label === selectedLabel) {
                        tracks[i].mode = 'showing';
                        break;
                    }
                }
            }
        };

        // If there's a default subtitle, try to select it
        const defaultSub = subtitles.find(s => s.default);
        if (defaultSub) {
            const defaultSubIndex = subtitles.indexOf(defaultSub);
            subtitleSelect.value = defaultSubIndex;
            // Video.js should handle showing the default track based on the 'default' property when added.
        }
    }

    // Episode Navigation Listeners
    prevEpisodeBtn.addEventListener('click', () => {
        if (currentEpisodeIndex > 0) {
            currentEpisodeIndex--;
        } else if (currentSeasonIndex > 0) {
            currentSeasonIndex--;
            currentEpisodeIndex = currentPlayingData.seasons[currentSeasonIndex].episodes.length - 1; // Last episode of prev season
        }
        loadEpisode();
    });

    nextEpisodeBtn.addEventListener('click', () => {
        const currentSeason = currentPlayingData.seasons[currentSeasonIndex];
        if (currentEpisodeIndex < currentSeason.episodes.length - 1) {
            currentEpisodeIndex++;
        } else if (currentSeasonIndex < currentPlayingData.seasons.length - 1) {
            currentSeasonIndex++;
            currentEpisodeIndex = 0; // First episode of next season
        }
        loadEpisode();
    });

    // Helper function to find an item by ID (and optionally type) from allData
    function findItemByIdAndType(id, type) {
        let item = null;
        if (type) {
            if (allData[type]) { // e.g., allData.movies
                item = allData[type].find(i => i.id.toString() === id.toString());
            }
        } else { // Search all types if type not specified
            for (const key in allData) {
                if (Array.isArray(allData[key])) {
                    item = allData[key].find(i => i.id.toString() === id.toString());
                    if (item) break;
                }
            }
        }
        return item;
    }

    function getItemType(id) {
        if (allData.movies.find(i => i.id === id)) return 'movies';
        if (allData.tvseries.find(i => i.id === id)) return 'tvseries';
        if (allData.livetv.find(i => i.id === id)) return 'livetv';
        return 'unknown'; // Should not happen with good data
    }

    // --- CLOSE PLAYER (Example - you'd need a close button in the player UI) ---
    // For now, clicking the logo could take user back
    document.querySelector('.logo').addEventListener('click', () => {
        if (videoPlayerPage.style.display === 'block') {
            videoPlayer.pause();
            // Restore video.js player if it was replaced by an iframe
            const playerContainer = document.getElementById('sticky-player-container');
            if (!document.getElementById('my-video')) { // Check if the video tag is missing
                playerContainer.innerHTML = `
                <video id="my-video" class="video-js vjs-big-play-centered" controls preload="auto" data-setup='{ "fluid": true }'>
                    <p class="vjs-no-js">To view this video please enable JavaScript...</p></video>`;
                videoPlayer = videojs('my-video'); // Re-initialize
            }

            videoPlayerPage.style.display = 'none';
            mainContent.style.display = 'block';
            // Refresh grid, or go to last viewed category
            populateVideoGrid(getAllItems());
        }
    });


    // --- START THE APP ---
    init();
});
