import * as flashpoint from 'flashpoint-launcher';
import { existsSync, readFileSync } from 'fs';
import path = require('path');

var game_history:string[] = [];

export function activate(context: flashpoint.ExtensionContext) {
    
    flashpoint.games.findPlaylistByName('History')
    .then((playlist) => {
        flashpoint.log.debug('Looking for History');
        if (playlist === undefined) {
            CreateHistoryPlaylist();
        }
    });

    flashpoint.games.onDidLaunchGame(() =>
    {
        flashpoint.games.findPlaylistByName('History', true)
        .then((playlist) => {
            if (playlist === undefined) {
                CreateHistoryPlaylist();
            }
        })
    });
}

function CreateHistoryPlaylist() {

    let GamesList: flashpoint.PlaylistGame[] = [];

    let HistoryPlaylist: flashpoint.Playlist = {
        author: "You!",
        description: "The last games you've played",
        extreme: flashpoint.getExtConfigValue('com.history.track-extreme'),
        title: "History",
        library: "",
        id: "history-playlist",
        icon: GetIconAsBase64(),
        games: GamesList
    };

    try {
        flashpoint.games.updatePlaylist(HistoryPlaylist);
        flashpoint.log.debug('Created History playlist');
    } catch (Exception) {
        flashpoint.log.debug(Exception.stack);
    }
}

function GetIconAsBase64() {
    let BaseIcon = "";

    if (existsSync(path.join(__dirname, "../icons/default.png"))) {
        BaseIcon = readFileSync(path.join(__dirname, "../icons/default.png"), "base64");
    }

    return BaseIcon;
}