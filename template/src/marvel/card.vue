<template>
  <component :is="page_type" :card="card" :cid="this._uid"></component>
</template>

<script>
  export default{
    props:['card'],
    // components,
    computed: {
      page_type: function () {
        let type = '';
        if (this.card && this.card.card_type) {
          if(typeof this.card.card_type=="string"){
            type=this.card.card_type;
          }else{
            type="card"+this.card.card_type;
          }
        }
        return type;
      }
    }
  };

</script>
