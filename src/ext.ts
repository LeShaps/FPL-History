import * as flashpoint from 'flashpoint-launcher';
import { existsSync, readFileSync } from 'fs';
import path = require('path');

var game_history:string[] = [];

export function activate(context: flashpoint.ExtensionContext) {
    
    flashpoint.games.onDidLaunchGame((game) =>
    {
        flashpoint.games.findPlaylistByName('History', true)
        .then((playlist) => {
            if (playlist === undefined) {
                CreateHistoryPlaylist(game);
            } else {
                UpdateHistoryPlaylist(playlist, game);
            }
        })
    });
}

function CreateHistoryPlaylist(game: flashpoint.Game) {

    let GamesList: flashpoint.PlaylistGame[] = [];

    let HistoryPlaylist: flashpoint.Playlist = {
        author: "You!",
        description: "The last games you've played",
        extreme: flashpoint.getExtConfigValue('com.history.track-extreme'),
        title: "History",
        library: "",
        id: "history-game-playlist",
        icon: GetIconAsBase64(),
        games: GamesList
    };

    flashpoint.games.updatePlaylist(HistoryPlaylist)
    .then((playlist) => {
        UpdateHistoryPlaylist(playlist, game);
    });
}

function GetIconAsBase64() {
    let BaseIcon = "data:image/png;base64,";

    if (existsSync(path.join(__dirname, "../icons/default.png"))) {
        BaseIcon += readFileSync(path.join(__dirname, "../icons/default.png"), "base64");
    }

    return BaseIcon;
}

function UpdateHistoryPlaylist(playlist: flashpoint.Playlist, game: flashpoint.Game) {

    if (game.extreme && !flashpoint.getExtConfigValue('com.history.track-extreme')) {
        return;
    }

    let CurrentFlashGames = playlist.games;

    CurrentFlashGames.forEach(elem => elem.order += 1);
    let UpdatedPlaylistGame: flashpoint.PlaylistGame = {
        game: game,
        order: CurrentFlashGames.length,
        notes: "",
        playlist: playlist
    };

    CurrentFlashGames.push(UpdatedPlaylistGame);
    playlist.games = CurrentFlashGames;
    flashpoint.games.updatePlaylist(playlist);
}