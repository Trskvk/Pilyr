<template>
  <div class="container">
    <div class="page" data-page="user">
      <div class="playlists">
        <div class="content">
          <div class="title">Your playlists <small>({{ this.playlists?.length || 0 }})</small></div>
          <div class="search-box">
            <form @submit.prevent="">
              <input type="text" placeholder="Search" v-model="query">
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" width="24px"
                     height="24px">
                  <path
                      d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z"/>
                </svg>
              </button>
              <div class="anim"></div>
            </form>
          </div>

          <PlaylistItem v-for="playlist in filteredPlaylists" :playlist="playlist" :key="playlist.id"
                        @click="openPlaylist(playlist)"></PlaylistItem>

        </div>

        <div class="toolbox">
          <div class="title">Hello, <b>{{ this.$store.state.user.username }}</b>!</div>
          <ul class="list">
            <li @click="addModalActive = true">Create Playlist</li>
            <!--                    <li class="inactive"></li>-->
            <li class="text-red" @click="logout">Logout</li>
          </ul>
        </div>
      </div>
      <div :class="['modal-container', addModalActive ? 'active' : '']">
        <div class="background-dimm" @click="addModalActive = false"></div>
        <div class="modal">
          <form @submit.prevent="addPlaylist">
            <div class="title">Create playlist</div>
            <div class="form-group">
              <input type="text" id="new-playlist-name" placeholder=" " v-model="modal_playlist_name" required>
              <label for="new-playlist-name">Playlist Name</label>
            </div>

            <div class="form-group no-margin">
              <select id="new-playlist-type" v-model="modal_playlist_type" required>
                <option selected disabled>---</option>
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
              <label for="new-playlist-name">Playlist Type</label>
            </div>
            <div :class="['error-text', modal_error.length ? 'active' : '']">{{ modal_error || '...' }}</div>

            <div class="form-group">
              <button class="form-button" type="submit">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlaylistItem from '../helpers/PlaylistItem.vue'
export default {
  name: "Profile",
  components: {
    PlaylistItem
  },
  data() {
    return {
      playlists: [],
      query: '',

      modal_playlist_type: null,
      modal_playlist_name: '',
      modal_error: '',

      editModeActive: false,
      addModalActive: false,
      loading: true
    }
  },
  created() {
    if (!this.$store.state.user.logged_in) {
      this.$router.push('/login')
    }
  },
  async mounted() {
    let list = await this.$api.playlist.list({
      type: 'own'
    });
    this.playlists = list.data;
  },
  methods: {
    openPlaylist(playlist) {
      this.$router.push({name: 'playlist', params: {id: playlist._id}})
    },
    async logout(){
      this.$store.commit('user', {
        logged_in: false,
        username: null,
        _id: null,
        role: 'nobody',
        token: null
      });
      this.$api.ajax.token = null;
      await this.$router.push('/login');
    },
    async addPlaylist() {
      let res = await this.$api.playlist.create({
        title: this.modal_playlist_name,
        type: this.modal_playlist_type,
        image: 'https://picsum.photos/200/200/?random'
      });

      if(res.error){
        this.modal_error = res.error;
      }else if(res._id){
        await this.$router.push({name: 'playlist', params: {id: res._id}})
      }
    },
  },
  computed: {
    filteredPlaylists() {
      if (!this.query.length) return this.playlists;
      return this.playlists.filter(playlist => {
        return playlist.title.toLowerCase().indexOf(this.query.toLowerCase()) !== -1
      })
    }
  }
}
</script>

<style scoped lang="scss">
.no-margin{
  margin: 0 !important;
}
.error-text {
  display: block;
  color: #b23434;
  text-align: center;
  margin: 10px;

  transition: all .3s ease;
  max-height: 0;
  overflow: hidden;

  height: 40px;
  line-height: 40px;

  &.active {
    max-height: 40px;
  }
}

.playlists {
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
  }

  .search-box {
    width: 100%;

    form {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      input {
        width: calc(100% - 51px);
        background-color: transparent;
        padding: 15px;
        outline: none;
        color: #fff;
        font-size: 18px;

        & ~ .anim {
          display: block;
          width: 100%;
          height: 2px;
          background-color: #34343f;

          &:after {
            content: '';
            display: block;
            height: 2px;
            width: 100%;
            max-width: 0;
            transition: max-width .3s ease-in-out;
            background-color: var(--primary);
          }
        }

        &:focus ~ .anim:after {
          content: '';
          max-width: 100%;
        }
      }

      button {
        background-color: transparent;
        padding: 0 10px;
        cursor: pointer;
        transition: background-color .2s ease-in-out;
        width: 51px;
        height: 51px;

        svg {
          fill: var(--primary);
          transition: fill .2s ease-in-out;
        }

        &:hover {
          background-color: var(--primary);

          svg {
            fill: #fff;
          }
        }


      }
    }
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
  }

  .toolbox {
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

        &.text-red {
          color: indianred;
        }

        &:not(.inactive):hover {
          color: var(--primary);
          background-color: #434352;

          &.text-red {
            color: #b9b9b9;
            background-color: indianred;
          }
        }
      }
    }
  }
}

.modal-container {
  display: block;

  transition: opacity .3s ease;
  pointer-events: none;
  opacity: 0;

  &.active {
    opacity: 1;
    pointer-events: initial;
  }

  position: fixed;
  top: 0;
  left: 0;
  z-index: 5000;

  width: 100vw;
  height: 100vh;

  .background-dimm {
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal {
    --width: 400px;
    --height: 300px;
    position: absolute;
    top: calc((100vh - var(--height)) / 2);
    left: calc((100vw - var(--width)) / 2);
    width: var(--width);
    height: var(--height);
    background-color: #34343f;
    box-shadow: 0 0 10px 0 #3a3a3a;
    border-radius: 10px;
    padding: 20px;

    .title {
      font-size: 20px;
      color: #fff;
      margin-bottom: 25px;
      text-align: center;
    }

    .form-button {
      width: 100px;
      margin: 0 auto;
    }
  }
}
</style>