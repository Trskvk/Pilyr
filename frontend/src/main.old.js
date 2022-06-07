// const Requester = require('./Requester')
//
// const api_url = 'http://localhost:3000';
//
// let requester = new Requester(api_url);
//
//
// // user
// await requester.user.login('nazarko', '123456');
// await requester.user.logout();
//
// await requester.user.list();
// await requester.user.get('id1');
//
// await requester.user.add({
//     username: 'nazarko',
//     password: '123456'
// });
//
// await requester.user.update('id1', {
//     name: 'ivan'
// });
// await requester.user.delete('id1');
//
// // playlist
// await requester.playlist.list({
//     name: 'My cool playlist'
// });
//
// await requester.playlist.get('id1');
//
// await requester.playlist.add({
//
// });
//
// await requester.playlist.update('id1', {
//     name: 'ivan'
// });
// await requester.playlist.delete('id1');




// Playlist
// | Name             | OwnerId | Type(public/private) | Songs           |
// |:-----------------|:--------|:---------------------|:----------------|
// | My cool playlist | id1     | public               | id1, id2, id3   |


// PlaylistMapping
// | PlId | SongId |
