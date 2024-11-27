const API_URL = 'https://pokeapi.co/api/v2/pokemon';
const appDiv = document.getElementById('app');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');

let currentOffset = 0;
const limit = 10;

// Función para obtener la lista de Pokémon
const fetchPokemonList = async (offset = 0) => {
    try {
        const response = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        displayPokemonList(data.results);
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        appDiv.innerHTML = '<p>Error loading Pokémon list. Please try again later.</p>';
    }
};

// Función para mostrar la lista de Pokémon
const displayPokemonList = (pokemonList) => {
    appDiv.innerHTML = ''; // Limpiar contenido previo
    pokemonList.forEach(async (pokemon) => {
        const pokemonDetails = await fetchPokemonDetails(pokemon.url);
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');
        pokemonCard.innerHTML = `
            <img src="${pokemonDetails.sprites.front_default}" alt="${pokemon.name}">
            <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
        `;
        appDiv.appendChild(pokemonCard);
    });
};

// Función para obtener detalles de un Pokémon por URL
const fetchPokemonDetails = async (url) => {
    const response = await fetch(url);
    return await response.json();
};

// Función de búsqueda por nombre
const searchPokemon = async () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;
    try {
        const response = await fetch(`${API_URL}/${query}`);
        if (!response.ok) throw new Error('Pokémon not found');
        const pokemon = await response.json();
        displayPokemonDetails(pokemon);
    } catch (error) {
        appDiv.innerHTML = '<p>Pokémon no encontrado.</p>';
    }
};

// Mostrar detalles de un solo Pokémon
const displayPokemonDetails = (pokemon) => {
    appDiv.innerHTML = `
        <div class="pokemon-details">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <p><strong>ID:</strong> ${pokemon.id}</p>
            <p><strong>Tipo:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
            <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
        </div>
    `;
};

// Manejar eventos de paginación
prevBtn.addEventListener('click', () => {
    if (currentOffset > 0) {
        currentOffset -= limit;
        fetchPokemonList(currentOffset);
    }
});

nextBtn.addEventListener('click', () => {
    currentOffset += limit;
    fetchPokemonList(currentOffset);
});

resetBtn.addEventListener('click', () => {
    currentOffset = 0;
    searchInput.value = '';
    fetchPokemonList();
});

// Buscar Pokémon por nombre
searchBtn.addEventListener('click', searchPokemon);

// Cargar lista inicial de Pokémon
fetchPokemonList();
