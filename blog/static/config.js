module.export = {
  "header":{
      "card_type":"header",
  },
  "footer":{
    "card_type":"footer"
  },
  routes: [
    {
      path: '/',
      name: 'index',
      card_group:[],
    },
    {
      path: '/marvel',
      name: 'marvel',
      card_group:[],
    },
    {
      path: '/marvel/:pname/:cname',
      name: 'marvelItem',
      leftMenu:{
        "card_type":"menu1",
        'el-menu':[
          {
            title:'',
            url:'',
            card_group:[],
            submenu:[
              {
                title:'',
                url:'',
                card_group:[]
              }
            ],
          },
          {
            title:'',
            url:'',
            card_group:[],
            submenu:[
              {
                title:'',
                url:'',
                card_group:[]
              }
            ],
          }
        ]
      },
      card_group:[],
    },
    {
      path: '/page2',
      name: 'page2',
      card_group:[],
    }
  ],
  data:{
    'index':{
      card_group:[]
    },
    'page1':{
      leftMenu:{
        "card_type":"menu1",
        'el-menu':[
          {
            title:'',
            url:'',
            card_group:[],
            submenu:[
              {
                title:'',
                url:'',
                card_group:[]
              }
            ],
          },
          {
            title:'',
            url:'',
            card_group:[],
            submenu:[
              {
                title:'',
                url:'',
                card_group:[]
              }
            ],
          }
        ]
      },
      card_group:[]
    },
    'page2':{
      card_group:[]
    }
  }
}
