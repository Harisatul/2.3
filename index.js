const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


const playlists = [];

// Add a song to a playlist
app.post('/playlist/:id/songs', (req, res) => {
    const playlistId = req.params.id;
    const song = {
        id: Date.now().toString(),
        songName: req.body.name,
        artist: req.body.artist
    }
    const playlist = playlists.find((pl) => pl.id === playlistId);

    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }
    song.playCount = 0;
    playlist.songs.push(song);
    res.status(201).json({ message: 'Song added successfully' });
});

// Delete a song from a playlist
app.delete('/playlist/:id/songs/:songId', (req, res) => {
    const playlistId = req.params.id;
    const songId = req.params.songId;
    const playlist = playlists.find((pl) => pl.id === playlistId);

    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    const songIndex = playlist.songs.findIndex((song) => song.id === songId);
    if (songIndex === -1) {
        return res.status(404).json({ error: 'Song not found' });
    }

    playlist.songs.splice(songIndex, 1);
    res.json({ message: 'Song deleted successfully' });
});

// Get all songs from a playlist
app.get('/playlist/:id/songs', (req, res) => {
    const playlistId = req.params.id;
    const playlist = playlists.find((pl) => pl.id === playlistId);

    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    res.json(playlist.songs);
});

// Play a song in a playlist (Increment play count)
app.post('/playlist/:id/songs/:songId/play', (req, res) => {
    const playlistId = req.params.id;
    const songId = req.params.songId;
    const playlist = playlists.find((pl) => pl.id === playlistId);

    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    const song = playlist.songs.find((song) => song.id === songId);
    if (!song) {
        return res.status(404).json({ error: 'Song not found' });
    }

    song.playCount++;
    res.json({ message: 'Song played successfully' });
});

// Get songs sorted by most played on the playlist
app.get('/playlist/:id/songs/most-played', (req, res) => {
    const playlistId = req.params.id;
    const playlist = playlists.find((pl) => pl.id === playlistId);

    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    const songsSortedByPlayCount = playlist.songs.slice().sort((a, b) => b.playCount - a.playCount);
    res.json(songsSortedByPlayCount);
});

// Create a new playlist
app.post('/playlist/:name', (req, res) => {
    const playlist = {
        id: Date.now().toString(),
        name: req.params.name,
        songs: [],
    };

    playlists.push(playlist);
    res.status(201).json({ message: 'Playlist created successfully', playlist });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});