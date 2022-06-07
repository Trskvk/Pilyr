<template>
  <div :class="{song: true, editable}" >
    <div class="picture">
      <img :src="song.image" loading="lazy" alt="Picture">
    </div>
    <div class="left">
      <div class="name">{{ song.title }}</div>
      <div class="artist">{{ song.artist }}</div>
    </div>
    <div class="right">
      <div class="timing">{{ duration }}</div>
    </div>
    <div class="remove-button" v-if="editable" @click="$emit('delete')">
      Delete
    </div>
  </div>
</template>

<script>
export default {
  name: "SongItem",
  props: {
    song: {
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
      let total_seconds = this.song?.duration || 0;

      let full = new Date(total_seconds * 1000).toISOString().split('T')[1].split('.')[0];
      return full.substr(0, 2) === '00' ? full.substr(3) : full;
    }
  }
}
</script>

<style scoped lang="scss">
.song {
  display: flex;
  position: relative;
  flex-direction: row;
  flex-wrap: nowrap;
  //justify-content: space-between;
  gap: 10px;
  width: 100%;
  height: 70px;
  padding: 10px;
  border-top: 1px solid #1b1b1b;
  cursor: pointer;

  &.editable {
    overflow: hidden;
    transition: all .3s ease;

    .remove-button {
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

      &.editable .remove-button {
        right: 0;
      }
    }
  }

  .picture {
    height: 50px;

    img {
      height: 50px;
      border-radius: 3px;
    }
  }

  .left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-self: flex-start;
    align-self: flex-start;
    height: 100%;
    width: 100%;
    text-align: left;

    .name {
      font-weight: bold;
      font-size: 17px;
      color: #fff;
    }

    .artist {
      font-size: 14px;
      color: #b9b9b9;
    }
  }

  .right {
    line-height: 50px;
    color: #b9b9b9;
    justify-self: flex-end;
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