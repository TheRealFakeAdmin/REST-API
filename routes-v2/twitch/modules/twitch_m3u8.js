/*
 * Original Author: Samuel Dudik (https://github.com/dudik)
 * Original Project: https://github.com/dudik/twitch-m3u8
 * License: MIT License

Copyright (c) 2018 Samuel Dudik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const https = require('https');

const clientId = "kimne78kx3ncx6brgo4mv6wki5h1ko";

function getAccessToken(id, isVod) {
	const data = JSON.stringify({
		operationName: "PlaybackAccessToken",
		extensions: {
			persistedQuery: {
				version: 1,
				sha256Hash: "0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712"
			}
		},
		variables: {
			isLive: !isVod,
			login: (isVod ? "" : id),
			isVod: isVod,
			vodID: (isVod ? id : ""),
			playerType: "embed"
		}
	});

	const options = {
		hostname: 'gql.twitch.tv',
		port: 443,
		path: '/gql',
		method: 'POST',
		headers: {
			'Client-id': clientId
		}
	};

	return new Promise((resolve, reject) => {
		const req = https.request(options, (response) => {
			var resData = {};
			resData.statusCode = response.statusCode;
			resData.body = [];
			response.on('data', (chunk) => resData.body.push(chunk));
			response.on('end', () => {
				resData.body = resData.body.join('');

				if (resData.statusCode != 200) {
					reject(new Error(`${JSON.parse(data.body).message}`));
				} else {
					if (isVod) {
						resolve(JSON.parse(resData.body).data.videoPlaybackAccessToken);
					} else {
						resolve(JSON.parse(resData.body).data.streamPlaybackAccessToken);
					}
				}
			});
		});

		req.on('error', (error) => reject(error));
		req.write(data);
		req.end();
	});
}

function getPlaylist(id, accessToken, vod) {
	return new Promise((resolve, reject) => {
		const req = https.get(`https://usher.ttvnw.net/${vod ? 'vod' : 'api/channel/hls'}/${id}.m3u8?client_id=${clientId}&token=${accessToken.value}&sig=${accessToken.signature}&allow_source=true&allow_audio_only=true`, (response) => {
			let data = {};
			data.statusCode = response.statusCode;
			data.body = [];
			response.on('data', (chunk) => data.body.push(chunk));
			response.on('end', () => {
				data.body = data.body.join('');

				switch (data.statusCode) {
					case 200:
						resolve(resolve(data.body));
						break;
					case 404:
						reject(new Error('Transcode does not exist - the stream is probably offline'));
						break;
					default:
						reject(new Error(`Twitch returned status code ${data.statusCode}`));
						break;
				}
			});
		})
			.on('error', (error) => reject(error));

		req.end()
	});
}

function parsePlaylist(playlist) {
	const parsedPlaylist = [];
	const lines = playlist.split('\n');
	for (let i = 4; i < lines.length; i += 3) {
		parsedPlaylist.push({
			quality: lines[i - 2].split('NAME="')[1].split('"')[0],
			resolution: (lines[i - 1].indexOf('RESOLUTION') != -1 ? lines[i - 1].split('RESOLUTION=')[1].split(',')[0] : null),
			url: lines[i]
		});
	}
	return parsedPlaylist;
}

function getStream(channel, raw) {
	return new Promise((resolve, reject) => {
		getAccessToken(channel, false)
			.then((accessToken) => getPlaylist(channel, accessToken, false))
			.then((playlist) => resolve((raw ? playlist : parsePlaylist(playlist))))
			.catch(error => reject(error));
	});
}

function getVod(vid, raw) {
	return new Promise((resolve, reject) => {
		getAccessToken(vid, true)
			.then((accessToken) => getPlaylist(vid, accessToken, true))
			.then((playlist) => resolve((raw ? playlist : parsePlaylist(playlist))))
			.catch(error => reject(error));
	});
}

module.exports = {
	getStream: getStream,
	getVod: getVod
};
