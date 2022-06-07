<template>
  <div class="container">
    <div class="page" data-page="playlist" v-if="!loading">
      <div class="playlist">
        <div class="content">
          <div class="playlist-header">
            <input :class="['playlist-title', editModeActive ? 'active' : '']" v-model="new_title"
                   @blur="renamePlaylist()"
                   @keydown="e => e.keyCode === 13 ? (e.preventDefault(), renamePlaylist()): null">
            <div class="playlist-author">{{ playlist?.creator?.username || '' }}</div>
            <div class="playlist-details">
              <div class="items-amount">{{ playlist?.songs?.length || 0}} song<span v-if="playlist?.songs?.length > 1">s</span>
              </div>
              <div class="items-duration">{{ duration }}</div>
            </div>


            <a :class="['delete-button', editModeActive && canEdit ? 'active' : '']" @click.prevent="toggleEditMode">
              <TrashIcon/>
            </a>

            <a :class="['add-button', editModeActive&& canEdit  ? 'active' : '']"
               @click.prevent="addModalActive = true">
              +
            </a>
            <a :class="['edit-button is-close', editModeActive&& canEdit  ? 'active' : '']"
               @click.prevent="toggleEditMode">
              ╳
            </a>
            <a :class="['edit-button', !editModeActive && canEdit  ? 'active' : '']" @click.prevent="toggleEditMode">
              <EditIcon/>
            </a>
          </div>

          <SongItem v-for="song in (playlist.songs || [])" :song="song" :key="song.id" :editable="editModeActive"
                    @delete="removeSong(song)"></SongItem>
        </div>
      </div>
      <div :class="{'modal-container': true, active: addModalActive}">
        <div class="background-dimm" @click="addModalActive = false"></div>
        <div class="modal">
          <form action="">
            <div class="title">Add songs</div>
            <div class="form-group">
              <input type="text" id="new-playlist-name" placeholder=" " v-model="search_query">
              <label for="new-playlist-name">Song Name</label>
            </div>
            <div class="search-items-list">
              <div class="search-item" v-for="search_item in search_list_filtered" :key="search_item._id" @click="addSong(search_item)">
                <div class="picture">
                  <img :src="search_item.image" loading="lazy" alt="">
                </div>

                <div class="name">{{ search_item.title }}</div>
                <div class="artist">{{ search_item.artist }}</div>
              </div>

            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import SongItem from '../Helpers/SongItem.vue'
import TrashIcon from '../Icons/TrashIcon.vue'
import EditIcon from '../Icons/EditIcon.vue'
import FakeData from '../../helpers/FakeDataGenerator';

export default {
  name: "Playlist.vue",
  components: {
    SongItem,
    EditIcon,
    TrashIcon
  },
  data() {
    return {
      playlist: {},
      new_title: '',

      search_list: [],
      search_query: '',

      editModeActive: false,
      addModalActive: false,
      loading: false
    }
  },
  async mounted() {
    // this.playlist = FakeData.gen_genre();
    await this.reload();
  },
  methods: {
    async reload() {
      if (this.loading) return;
      this.loading = true;
      this.playlist = await this.$api.playlist.get(this.$route.params.id);
      this.new_title = this.playlist.title;
      this.search_list = (await this.$api.song.list()).data;
      this.loading = false;
    },
    toggleEditMode() {
      this.editModeActive = !this.editModeActive;
    },
    async addSong(song) {
      // this.playlist.songs.push(song);
      // console.log(song)
      let response = await this.$api.playlist.addSong(this.playlist._id, song._id);
      this.playlist.songs = response.songs;
      this.addModalActive = false;
    },
    removeSong(song) {
      this.$api.playlist.removeSong(this.playlist._id, song._id);
      this.playlist.songs.splice(this.playlist.songs.indexOf(song), 1);
    },
    async renamePlaylist(flag = true) {
      if (!flag) return;

      if (!this.new_title || this.playlist.title === this.new_title) {
        return this.new_title = this.playlist.title;
      }


      await this.$api.playlist.update(this.playlist._id, 'title', this.new_title);
      this.playlist.title = this.new_title;
    }
  },
  computed: {
    duration() {
      if (!(this.playlist?.songs || []).length) return "0:00";
      let total_seconds = this.playlist.songs.reduce((r, e) => r + e.duration, 0);

      let full = new Date(total_seconds * 1000).toISOString().split('T')[1].split('.')[0];
      return full.substr(0, 2) === '00' ? full.substr(3) : full;
    },
    canEdit() {
      return this.playlist.can_edit;
    },
    search_list_filtered() {
      return this.search_list.filter(e => e.title.toLowerCase().includes(this.search_query.toLowerCase()));
    }
  }
}
</script>

<style scoped lang="scss">
.playlist {
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

  .playlist-header {
    display: flex;
    position: relative;
    width: 100%;
    flex-direction: column;
    align-items: center;
    color: #fff;
    background-color: #2e2e38;
    padding: 10px;

    .add-button {
      display: block;
      position: absolute;
      top: 30px;
      right: 10px;
      background-color: var(--primary);
      width: 40px;
      height: 40px;
      line-height: 40px;
      font-size: 25px;
      text-align: center;
      border-radius: 10em;
      cursor: pointer;
      transition: all .2s ease;
      pointer-events: none;
      opacity: 0;

      &.active {
        pointer-events: initial;
        opacity: 1;
        right: 60px;
      }

      &:hover {
        opacity: .7;
      }
    }

    .delete-button{
      display: none !important;
    }

    .edit-button,
    .delete-button {
      display: block;
      position: absolute;
      top: 30px;
      right: 10px;
      background-color: indianred;
      width: 40px;
      height: 40px;
      line-height: 40px;
      font-size: 25px;
      text-align: center;
      border-radius: 10em;
      cursor: pointer;
      transition: opacity .2s ease;
      pointer-events: none;
      opacity: 0;

      &.active {
        pointer-events: initial;
        opacity: 1;
      }

      &.is-close {
        font-size: 17px;
      }

      svg {
        transform: translateY(2px);
      }

      &:hover {
        opacity: .7;
      }
    }

    .delete-button {
      right: unset;
      left: 10px;
    }


    .playlist-title {
      background-color: transparent;
      font-size: 20px;
      color: #fff;
      outline: none;
      border-bottom: 2px solid transparent;
      transition: border-bottom .3s ease-in-out;
      min-width: 200px;
      text-align: center;
      padding: 0 10px;
      margin-bottom: 5px;

      &:not(.active) {
        pointer-events: none;
      }

      &.active {
        border-bottom: 2px solid #646464;
      }

      &:focus {
        border-bottom: 2px solid var(--primary);
      }
    }

    .playlist-author {
      color: #b9b9b9;
    }

    .playlist-details {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-self: center;
      justify-content: center;
      font-size: 14px;
      margin-top: 10px;

      width: 100%;
      line-height: 25px;
      color: var(--primary);

      & > *:not(:last-child):after {
        display: inline-block;
        content: "•";
        margin: 0 6px;
        font-size: 15px;
        font-weight: bold;
      }
    }

    //text-align: center;
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;

    &.editable {
      .song {
        overflow: hidden;
        transition: all .3s ease;

        &:after {
          content: 'Delete';
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          width: 100px;
          background-color: indianred;
          color: #fff;
          right: -100px;
          top: 0;
          height: 100%;
          font-size: 20px;
          transition: all .3s ease;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
        }

        &:hover {
          padding-right: 110px;

          &:after {
            right: 0;
          }
        }
      }
    }
  }
}

.save-button {
  display: block;
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 100px;
  height: 40px;
  text-align: center;
  background-color: #34343f;
  border: 2px solid var(--primary);
  color: var(--primary);
  font-size: 20px;
  box-shadow: 0 0 10px 2px #1b1b1b;
  cursor: pointer;
  transition: all .3s ease;

  &:hover {
    background-color: var(--primary);
    color: #fff;
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
    --height: 400px;
    --search-list-height: calc(var(--height) - 150px);
    position: absolute;
    top: calc((100vh - var(--height)) / 2);
    left: calc((100vw - var(--width)) / 2);
    width: var(--width);
    height: var(--height);
    background-color: #34343f;
    box-shadow: 0 0 10px 0 #3a3a3a;
    border-radius: 10px;
    padding: 20px;

    .form-group {
      margin-bottom: 10px;
    }

    .search-items-list {
      max-height: var(--search-list-height);
      overflow-y: auto;

      .search-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 50px;
        padding: 0 10px;
        cursor: pointer;

        &:not(:last-child) {
          border-bottom: 1px solid #1b1b1b;
        }

        &:hover{
          background-color: #242634;
        }


        .picture {
          height: 40px;
          width: 40px;
          border-radius: 50%;
          background-color: #1b1b1b;
          overflow: hidden;
          margin: 5px 0;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .name {
          font-size: 16px;
          color: #fff;
          font-weight: bold;
        }

        .artist {
          font-size: 14px;
          color: #b9b9b9;
        }
      }
    }

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