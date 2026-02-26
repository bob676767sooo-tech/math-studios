// State
let gamesData = [];
let searchQuery = '';
let selectedCategory = 'All';
let activeGame = null;

const CATEGORIES = ['All', 'Action', 'Puzzle', 'Sports', 'Idle'];

// DOM Elements
const homeView = document.getElementById('home-view');
const playerView = document.getElementById('player-view');
const gameGrid = document.getElementById('game-grid');
const categoryFilters = document.getElementById('category-filters');
const searchInput = document.getElementById('search-input');
const mobileSearchInput = document.getElementById('mobile-search-input');
const gameCount = document.getElementById('game-count');
const gridTitle = document.getElementById('grid-title');
const backBtn = document.getElementById('back-btn');
const closeGameBtn = document.getElementById('close-game-btn');
const gameIframe = document.getElementById('game-iframe');
const activeGameTitle = document.getElementById('active-game-title');
const externalLink = document.getElementById('external-link');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const logo = document.getElementById('logo');

// Initialize
async function init() {
  try {
    const response = await fetch('src/games.json');
    gamesData = await response.json();
    renderCategories();
    renderGames();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load games:', error);
  }
}

function renderCategories() {
  categoryFilters.innerHTML = CATEGORIES.map(cat => `
    <button
      data-category="${cat}"
      class="category-btn px-6 py-2 rounded-full text-sm font-medium transition-all ${
        selectedCategory === cat
          ? 'bg-emerald-500 text-black'
          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
      }"
    >
      ${cat}
    </button>
  `).join('');

  // Add listeners to new buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectedCategory = e.target.dataset.category;
      renderCategories();
      renderGames();
    });
  });
}

function renderGames() {
  const filteredGames = gamesData.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  gameCount.textContent = `${filteredGames.length} games found`;
  gridTitle.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
    ${selectedCategory === 'All' ? 'Trending Games' : `${selectedCategory} Games`}
  `;

  if (filteredGames.length > 0) {
    gameGrid.innerHTML = filteredGames.map((game, index) => `
      <div
        data-id="${game.id}"
        class="game-card group relative glass-card rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-2"
      >
        <div class="aspect-[4/3] overflow-hidden">
          <img
            src="${game.thumbnail}"
            alt="${game.title}"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerpolicy="no-referrer"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        </div>
        
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <div class="flex items-start justify-between mb-1">
            <h4 class="text-lg font-bold group-hover:text-emerald-400 transition-colors">${game.title}</h4>
            <span class="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              ${game.category}
            </span>
          </div>
          <p class="text-sm text-zinc-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
            ${game.description}
          </p>
        </div>
      </div>
    `).join('');

    // Add listeners to cards
    document.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => {
        const gameId = card.dataset.id;
        const game = gamesData.find(g => g.id === gameId);
        openGame(game);
      });
    });
  } else {
    gameGrid.innerHTML = `
      <div class="col-span-full text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
        <div class="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-500"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        </div>
        <h4 class="text-xl font-bold mb-2">No games found</h4>
        <p class="text-zinc-500">Try adjusting your search or category filters.</p>
      </div>
    `;
  }
}

function openGame(game) {
  activeGame = game;
  homeView.classList.add('hidden');
  playerView.classList.remove('hidden');
  gameIframe.src = game.iframeUrl;
  activeGameTitle.textContent = game.title;
  externalLink.href = game.iframeUrl;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeGame() {
  activeGame = null;
  homeView.classList.remove('hidden');
  playerView.classList.add('hidden');
  gameIframe.src = '';
}

function setupEventListeners() {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGames();
  });

  mobileSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGames();
  });

  backBtn.addEventListener('click', closeGame);
  closeGameBtn.addEventListener('click', closeGame);

  logo.addEventListener('click', () => {
    closeGame();
    searchQuery = '';
    selectedCategory = 'All';
    searchInput.value = '';
    mobileSearchInput.value = '';
    renderCategories();
    renderGames();
  });

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });
}

init();
