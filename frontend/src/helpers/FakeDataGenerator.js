let id = 0;
let gid = 0;

const gen_song = () => {
    id++
    return {
        id: id,
        title: `Song ${id}`,
        artist: `Artist ${id}`,
        image: `https://picsum.photos/id/${200+id}/200/200`,
        duration: Math.random() * 1000 + 100
    }
}

const gen_genre = () => {
    gid++
    return {
        id: gid,
        title: `Song ${id}`,
        image: `https://picsum.photos/id/${200+gid}/200/200`,
        creator: {
            username: `Creator${id}`
        },
        songs:  [...Array(Math.trunc(Math.random() * 10 + 10)).keys()].map(gen_song)
    }
}

const resetCounters = () => {
    id = 0;
    gid = 0;
}

const gen_plist = gen_genre;

export default {
    gen_plist,
    gen_genre,
    gen_song,
    resetCounters
}