<template>
  <div class="container">
    <div class="page" data-page="songs">
      <div class="songs">
        <div class="content">
          <div class="title">Songs</div>

          <SongItem v-for="song in songs" :song="song" :key="song._id"></SongItem>
        </div>

        <div class="genres">
          <div class="title">Some playlists</div>
          <ul class="list">
            <li v-for="(playlist, index) in playlists"
                :key="index"
                @click="openPlaylist(playlist._id)">{{ playlist.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SongItem from '../Helpers/SongItem.vue'
export default {
  name: "Songs",
  components: {
    SongItem
  },
  data() {
    return {
      playlists: [],
      songs: [],

      loading: false
    }
  },
  async mounted(){
    // FakeData.resetCounters();
    // this.genres =  [...Array(Math.trunc(Math.random() * 10 + 10)).keys()].map(FakeData.gen_genre);
    // this.songs =  [...Array(Math.trunc(Math.random() * 10 + 10)).keys()].map(FakeData.gen_song);
    this.loading = true;
    let songs_list = await this.$api.song.list();
    this.songs = songs_list.data;

    let playlists_list = await this.$api.playlist.list();
    this.playlists = playlists_list.data;

    this.loading = false;
  },
  methods: {
    openPlaylist(id) {
      this.$router.push({name: 'playlist', params: {id: id}})
    },
  }
}
</script>

<style scoped lang="scss">
.songs {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;

  & > * {
    box-shadow: 0 0 6px 0 #1b1b1b;
    border-radius: 5px;
  }

  .title {
    display: block;
    width: 100%;
    font-size: 20px;
    color: #fff;
    padding: 15px;
    background-color: #2e2e38;

    //text-align: center;
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
  }

  .genres {
    width: 30%;
    position: sticky;
    top: 80px;
    overflow: hidden;

    .list {
      list-style-type: none;

      li {
        border-top: 1px solid #1b1b1b;
        padding: 10px;
        font-size: 18px;
        color: #b9b9b9;
        cursor: pointer;
        transition: all .05s ease-in-out;

        &:hover {
          color: var(--primary);
          background-color: #434352;
        }
      }
    }
  }
}
</style>