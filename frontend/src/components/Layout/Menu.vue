<template>
  <nav>
    <div class="title" @click="$router.push({name:'songs'})">Pilyr</div>
    <ul class="menu">
      <li v-for="(menu_item, index) in active_list"
          :key="index"
          :class="{active: [menu_item.url, ...(menu_item.alias || [])].includes(currentPage)}"
          @click="changePage(menu_item)">
        <router-link :to="{name: menu_item.url}">
          {{ menu_item.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
    name: 'Menu',
    data(){
      return {
        list: [
          {
            name: 'Songs',
            url: 'songs'
          },
          {
            name: 'Playlists',
            alias: ['playlist'],
            url: 'playlists'
          },
          {
            name: 'User',
            url: 'profile',
            after_auth: true
          },
          {
            name: 'Login',
            url: 'login',
            after_auth: false
          }
        ]
      }
    },
    methods: {
      changePage(menu_item){
        this.$router.push({name: menu_item.url})
      }
    },
    computed: {
      currentPage(){
        return this.$route.name
      },
      active_list(){
        return this.list.filter(e => {
          if(!e.hasOwnProperty('after_auth')) return true;
          return e.after_auth === this.$store.state.user.logged_in
        })
      }
    }
  }
</script>

<style scoped lang="scss">
nav {
  display: flex;
  padding: 0 10px;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  width: 100%;
  height: 60px;

  line-height: 60px;

  background-color: #1b1b1b;
  color: #fff;
  justify-content: space-between;

  user-select: none;

  .title {
    font-size: 20px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 300ms ease-in-out;

    &:hover{
      color: var(--primary);
    }

  }

  .menu {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;

    list-style-type: none;

    li {
      padding: 0 10px;
      cursor: pointer;

      a{
        display: block;
        transition: color .2s ease-in-out;
        color: #fff;
        text-decoration: none;
      }

      &:hover a, &.active a{
        color: var(--primary);
      }
    }
  }
}

</style>