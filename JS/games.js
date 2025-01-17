export async function getIcon(game, icon) {
      const { data, error } = await supabaseClient
        .storage
        .from('gameIcons')
        .createSignedUrl(`${game.replace('.swf', '')}.png`, 60)
      icon.src = data.signedUrl;
    }

export function getFavorites() {
      const favorites = localStorage.getItem('favGames');
      return favorites ? JSON.parse(favorites) : [];
    }

export function saveFavorites(favorites) {
    localStorage.setItem('favGames', JSON.stringify(favorites));
}

export function toggleFavorite(game, gameDiv) {
    let favorites = getFavorites();
    let state;
    if (favorites.includes(game)) {
    favorites = favorites.filter(fav => fav !== game);
    state = false;
    } else {
    favorites.push(game);
    state = true;
    }
    saveFavorites(favorites);
    moveGameDiv(gameDiv, state);
    return state;
}

export function moveGameDiv(gameDiv, isFav) {
      const targetDiv = document.querySelector(isFav ? '.favGames' : '.gamesDiv');
      targetDiv.appendChild(gameDiv);
    }

export function create_game(game_name,game_url, suffix) {
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';
    const favButton = document.createElement('button');
    const favIcon = document.createElement('img')
    const icon = document.createElement('img');
    const text = document.createElement('h2');
    text.textContent = game_name.replace('.swf', '');
    icon.draggable = false;
    favIcon.draggable = false;
    getIcon(game_name, icon);
    favIcon.src = favs.includes(game_name) ? '../UI/star.svg' : '../UI/empty-star.svg';
    favButton.onclick = function (event) {
    event.stopPropagation();
    const isFav = toggleFavorite(game_name, gameDiv);
    favIcon.src = isFav ? '../UI/star.svg' : '../UI/empty-star.svg';
    };
    favButton.appendChild(favIcon);
    gameDiv.appendChild(favButton);
    gameDiv.appendChild(icon);
    gameDiv.appendChild(text);
    gameDiv.onclick = function () {
        window.location.href = '-play.html?id=' + game_url + suffix;
    };
    return gameDiv;
}

export async function create_game_div(flash, url, game) {
    let suffix = '';
    if (flash) {
    suffix = '&flash=true';
    } else if (url) {
    suffix = '&url=true';
    }
    const gameDiv = create_game(game.name, game.url, suffix);
    document.querySelector(favs.includes(game.name) ? '.favGames' : '.gamesDiv').appendChild(gameDiv);
}
