<template>
  <div class="container">
    <div class="page" data-page="playlists">
      <div class="playlists">
        <div class="content">
          <div class="title">Playlists</div>
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

          <PlaylistItem v-for="playlist in filteredPlaylists" :playlist="playlist" :key="playlist._id" @click="$router.push({name:'playlist', params: {id: playlist._id}})"></PlaylistItem>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlaylistItem from '../Helpers/PlaylistItem.vue'

export default {
  name: "Playlists",
  components: {
    PlaylistItem,
  },
  data() {
    return {
      playlists: [],
      query: '',

      loading: false
    }
  },
  async mounted() {
    // this.playlists = [...Array(Math.trunc(Math.random() * 10 + 10)).keys()].map(FakeData.gen_plist);
    this.loading = true;
    let user_role = this.$store.state.user.role;
    let list = await this.$api.playlist.list({
      type: user_role === 'admin' ? 'all' : 'public'
    });
    this.playlists = list.data;
    this.loading = false;
  },
  methods: {
    openPlaylist(id) {
      this.$router.push({name: 'playlist', params: {id: id}})
    }
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
}
</style>