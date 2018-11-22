export default {
  "mheader":[{
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
        title:'test',
        name:'test',
      },
      {
        title:'源码下载',
        name:'load',
      }
    ]
  }],
  "leftmenu":[
    {
      "card_type":"leftmenu",
      'submenu':[
        {
          title:'bus',
          path:'/marvel/bus',
        },
        {
          title:'card1',
          path:'/marvel/card1',
        },

        {
          title:'file',
          path:'/marvel/file',
        }
      ]
    },
    {
      "card_type":"leftmenu",
      'submenu':[
        {
          title:'img',
          path:'/test/img',
        },
        {
          title:'image',
          path:'/test/image',
        },

        {
          title:'pswp',
          path:'/test/pswp',
        }
      ]
    },
  ],
  "routes": [
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
      path: '/test',
      name: 'test',
      mheader:true,
      leftmenu:1,
      card_group:[   {
        card_type:'md',
        md_type:'test'
      }],
    },
    {
      path: '/marvel/bus',
      name: 'bus',
      mheader:true,
      leftmenu:0,
      card_group:[   {
        card_type:'md',
        md_type:'bus'
      }],
    },
    {
      path: '/marvel/card1',
      name: 'card1',
      mheader:true,
      leftmenu:0,
      card_group:[   {
        card_type:'md',
        md_type:'card1'
      }],
    },
    {
      path: '/marvel/file',
      name: 'file',
      mheader:true,
      leftmenu:0,
      card_group:[   {
        card_type:'md',
        md_type:'file'
      }],
    },
    {
      path: '/test/img',
      name: 'img',
      mheader:true,
      leftmenu:1,
      card_group:[   {
        card_type:'md',
        md_type:'img'
      }],
    },
    {
      path: '/test/image',
      name: 'image',
      mheader:true,
      leftmenu:1,
      card_group:[   {
        card_type:'md',
        md_type:'image'
      }],
    },
    {
      path: '/test/pswp',
      name: 'pswp',
      mheader:true,
      leftmenu:1,
      card_group:[   {
        card_type:'md',
        md_type:'pswp'
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
      path: '*',
      name: '404',
      mheader:true,
      card_group:[{
        card_type:'md',
        md_type:'404'
      }],
    },
  ],
}
