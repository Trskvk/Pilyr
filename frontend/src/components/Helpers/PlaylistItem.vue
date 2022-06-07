<template>
    <div class="playlist" :class="editable">
      <div class="picture">
        <img :src="playlist.image" loading="lazy" alt="">
      </div>
      <div class="left">
        <div class="name">
          {{ playlist.title }}
          <LockIcon v-if="playlist?.type === 'private'"/>
        </div>
        <div class="creator">{{ playlist?.creator?.username || '' }}</div>
      </div>
      <div class="right">
        <div class="timing">{{ duration }}</div>
      </div>
    </div>
</template>

<script>
import LockIcon from '../icons/LockIcon.vue';

export default {
  name: "PlaylistItem",
  components:{
    LockIcon
  },
  props: {
    playlist: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    duration () {
      if(!(this.playlist?.songs || []).length) return "0:00";
      let total_seconds = this.playlist.songs.reduce((r, e) => r + e.duration, 0);

      let full = new Date(total_seconds * 1000).toISOString().split('T')[1].split('.')[0];
      return full.substr(0, 2) === '00' ? full.substr(3) : full;
    }
  }
}
</script>

<style scoped lang="scss">
.playlist {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 70px;
  padding: 10px;
  border-top: 1px solid #1b1b1b;
  cursor: pointer;

  .picture{
    width: 70px;
    height: 100%;

    img{
      height: 100%;
      border-radius: 3px;
    }
  }

  .left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    width: 100%;
    text-align: left;

    .name {
      font-weight: bold;
      font-size: 17px;
      color: #fff;
    }

    .creator {
      font-size: 14px;
      color: #b9b9b9;
    }
  }

  .right {
    line-height: 50px;
    color: #b9b9b9;
  }

  &:hover {
    background-color: #434352;

    .left .name {
      color: var(--primary);
    }
  }

  //border-radius: 10px;
  //box-shadow: 0 0 10px rgba(0, 0, 0, .2);
}

</style>