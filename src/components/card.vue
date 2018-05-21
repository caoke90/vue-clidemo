<template>
  <component :style="style" :is="page_type" :card="card" :cid="this._uid"></component>
</template>

<script>

  export default{
    props:['card'],
    computed: {
      style:function () {
        let card=this.card;
        if(card.style&&card.style.position=='fixed'&&window.innerWidth>750){
          if(card.style.left&&card.style.left.indexOf("rem")>-1){
            card.style.left=((window.innerWidth-750)/200+parseFloat(card.style.left))+"rem";
          }
          if(card.style.right&&card.style.right.indexOf("rem")>-1){
            card.style.right=((window.innerWidth-750)/200+parseFloat(card.style.right))+"rem";
          }
        }
        return card.style;
      },
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
