import * as flashpoint from 'flashpoint-launcher';
import { existsSync, readFileSync } from 'fs';
import path = require('path');

var game_history:string[] = [];

export function activate(context: flashpoint.ExtensionContext) {
    
    flashpoint.games.onDidLaunchGame((game) =>
    {
        if (game.library === "theatre") {
            flashpoint.games.findPlaylist('history-animation-playlist', true)
            .then((playlist) => {
                if (playlist === undefined) {
                    CreateHistoryPlaylist(game, true);
                } else {
                    UpdatePlaylist(playlist, game);
                }
            })
        } else {
            flashpoint.games.findPlaylist('history-game-playlist', true)
            .then((playlist) => {
                if (playlist === undefined) {
                    CreateHistoryPlaylist(game, false);
                } else {
                    UpdatePlaylist(playlist, game);
                }
            })
        }
    });
}

function CreateHistoryPlaylist(game: flashpoint.Game, animation: boolean) {

    let GamesList: flashpoint.PlaylistGame[] = [];

    let HistoryPlaylist: flashpoint.Playlist = {
        author: "You!",
        description: animation ? "The last animations you've played" : "The last games you've played",
        extreme: flashpoint.getExtConfigValue('com.history.track-extreme'),
        title: "History",
        library: animation ? "theatre" : "arcade",
        id: animation ? "history-animation-playlist" : "history-game-playlist",
        icon: GetIconAsBase64(),
        games: GamesList
    };

    flashpoint.games.updatePlaylist(HistoryPlaylist)
    .then((playlist) => {
        UpdatePlaylist(playlist, game);
    });
}

function UpdatePlaylist(playlist: flashpoint.Playlist, game: flashpoint.Game) {
    if (game.extreme && !flashpoint.getExtConfigValue('com.history.track-extreme')) {
        return;
    }

    let currentFlashGames = playlist.games;

    if (currentFlashGames[currentFlashGames.length - 1].gameId === game.id) {
        return;
    }

    let UpdatedPlaylistGames: flashpoint.PlaylistGame = {
        game: game,
        order: currentFlashGames.length,
        notes: "",
        playlist: playlist
    };

    currentFlashGames.push(UpdatedPlaylistGames);
    playlist.games = currentFlashGames;
    flashpoint.games.updatePlaylist(playlist);
}

/* Utils */

function GetIconAsBase64() {
    let BaseIcon = "data:image/png;base64,";

    if (existsSync(path.join(__dirname, "../icons/default.png"))) {
        return BaseIcon += readFileSync(path.join(__dirname, "../icons/default.png"), "base64");
    }

    return "";
}