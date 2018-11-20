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
  const file=(resolve)=>require(['@/marvel/demo/file.vue'],resolve)
  const pswp=(resolve)=>require(['@/marvel/demo/pswp.vue'],resolve)
  const storage=(resolve)=>require(['@/marvel/demo/storage.vue'],resolve)

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
