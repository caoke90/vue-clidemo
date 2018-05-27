<template>
  <div class="card  card2">
    <div>
      <component :is="card.md_type" :card="card" :cid="this._uid"></component>
    </div>
    <div>

    </div>

  </div>
</template>
<script>
  const file=(resolve)=>require(['../demo/file.vue'],resolve)
  const pswp=(resolve)=>require(['../demo/pswp.vue'],resolve)
  const storage=(resolve)=>require(['../demo/storage.vue'],resolve)

  const components={
    file,pswp,storage
  };

  export default {
    data() {
      return {

      };
    },
    name: "card2",
    props: ['card'],
    components,
  };
</script>
<style  >

</style>
