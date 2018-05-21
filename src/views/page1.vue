<template>
  <el-row class="tac">

    <el-col :span="4">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose">

        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <router-link :to="{name:'info1'}">info1</router-link>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <router-link :to="{name:'info2'}">info2</router-link>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <router-view/>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      card_group: [
        {
          card_type:10,
          card_group:[
            {
              card_type:2
            },
            {
              card_type:3
            }
          ]
        },
        {
          card_type:3
        }
      ]
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
