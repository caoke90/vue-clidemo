export default {
  "mheader":{
    "card_type":"mheader",
    'submenu':[
      {
        title:'blog-巅峰蜗牛',
        name:'index',
      },
      {
        title:'marvel组件',
        name:'marvel',
      },
      {
        title:'源码下载',
        name:'load',
      }
    ]
  },
  "mfooter":{
    "card_type":"mfooter"
  },
  leftmenu:{
    "card_type":"leftmenu",
    'submenu':[
      {
        title:'bus',
        path:'/marvel/bus',
      },
      {
        title:'card1',
        name:'card1',
      },

      {
        title:'file',
        name:'file',
      }
    ]
  },
  routes: [
    {
      path: '/',
      name: 'index',
      mheader:true,
      card_group:[   {
        card_type:'md',
        md_type:'hello'
      }],
    },
    {
      path: '/marvel',
      name: 'marvel',
      mheader:true,
      leftmenu:true,

      card_group:[   {
        card_type:'md',
        md_type:'hello'
      }],
    },
    {
      path: '/:pname/:cname',
      name: 'mulmd',
      mheader:true,
      leftmenu:true,
      card_group:[{
        card_type:'mulmd'
      }],
    },
    {
      path: '/marvel/card1',
      name: 'card1',
      mheader:true,
      leftmenu:true,
      card_group:[   {
        card_type:'md',
        md_type:'card1'
      }],
    },
    {
      path: '/marvel/file',
      name: 'file',
      mheader:true,
      leftmenu:true,
      card_group:[   {
        card_type:'md',
        md_type:'file'
      }],
    },
    {
      path: '/load',
      name: 'load',
      mheader:true,
      card_group:[   {
        card_type:'md',
        md_type:'load'
      }],
    },
    {
      path: '/:marvel',
      name: '404',
      mheader:true,
      leftmenu:true,
      card_group:[   {
        card_type:'md',
        md_type:'404'
      }],
    },
  ],
}
