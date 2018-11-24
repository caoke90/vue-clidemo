bconfig={
  "mheader": [
    {
      "card_type": "mheader",
      "submenu": [
        {
          "title": "blog-巅峰蜗牛",
          "name": "index"
        },
        {
          "title": "marvel组件",
          "name": "marvel"
        },
        {
          "title": "17作业题库样式",
          "name": "17zuoyecss",
          "submenu": [{
            "title": "中学英语",
            "name": "zy",
          }]
        },
        {
          "title": "源码下载",
          "name": "load"
        }
      ]
    }
  ],
  "leftmenu": [
    {
      "card_type": "leftmenu",
      "submenu": [
        {
          "title": "bus",
          "icon": "el-icon-document",
          "path": "/marvel/bus"
        },
        {
          "title": "card1",
          "icon": "el-icon-document",
          "path": "/marvel/card1"
        },
        {
          "title": "file",
          "icon": "el-icon-document",
          "path": "/marvel/file"
        }
      ]
    },
    {
      "card_type": "leftmenu",
      "submenu": [
        {
          "title": "新二级题型列表",
          "icon": "el-icon-document",
          "name": "zy"
        }, {
          "title": "所有新二级题型",
          "icon": "el-icon-document",
          "name": "zyall"
        },
        {
          "title": "作业题型",
          "icon": "el-icon-document",
          "name": "zy",
          "submenu": [
            {
              "title": "单词跟读",
              "icon": "el-icon-location",
              "name": "203017003"
            },
            {
              "title": "中译英",
              "icon": "el-icon-location",
              "name": "203017001"
            },
            {
              "title": "英译中",
              "icon": "el-icon-location",
              "name": "203017002"
            }
          ]
        },
        {
          "title": "听力题型",
          "icon": "el-icon-document",
          "name": "听力题型"
        },
        {
          "title": "考试口语题型",
          "icon": "el-icon-document",
          "name": "考试口语题型"
        },
        {
          "title": "笔试题型",
          "icon": "el-icon-document",
          "name": "笔试题型"
        }
      ]
    }
  ],
  "routes": [
    {
      "path": "/",
      "name": "index",
      "mheader": true,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "hello"
        }
      ]
    },
    {
      "path": "/marvel",
      "name": "marvel",
      "mheader": true,
      "leftmenu": true,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "hello"
        }
      ]
    },
    {
      "path": "/17zuoyecss",
      "name": "17zuoyecss",
      "mheader": true,
      "leftmenu": 1,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "test"
        }
      ]
    },

    {
      "path": "/zy",
      "name": "zy",
      "mheader": true,
      "leftmenu": 1,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "zy"
        }
      ]
    },
    {
      "path": "/zy/all",
      "name": "zyall",
      "mheader": true,
      "leftmenu": 1,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "zy/base"
        },
        {
          "card_type": "md",
          "md_type": "zy/all"
        }
      ]
    },
    {
      "path": "/zy/203017003",
      "name": "203017003",
      "mheader": true,
      "leftmenu": 1,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "zy/base"
        },
        {
          "card_type": "md",
          "md_type": "zy/203017003"
        }
      ]
    },
    {
      "path": "/zy/203017001",
      "name": "203017001",
      "mheader": true,
      "leftmenu": 1,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "zy/203017001"
        }
      ]
    },
    {
      "path": "/zy/203017002",
      "name": "203017002",
      "mheader": true,
      "leftmenu": 1,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "zy/203017002"
        }
      ]
    },
    {
      "path": "/marvel/bus",
      "name": "bus",
      "mheader": true,
      "leftmenu": 0,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "bus"
        }
      ]
    },
    {
      "path": "/marvel/card1",
      "name": "card1",
      "mheader": true,
      "leftmenu": 0,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "card1"
        }
      ]
    },
    {
      "path": "/marvel/file",
      "name": "file",
      "mheader": true,
      "leftmenu": 0,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "file"
        }
      ]
    },
    {
      "path": "/test/img",
      "name": "img",
      "mheader": true,
      "leftmenu": 1,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "img"
        }
      ]
    },
    {
      "path": "/test/image",
      "name": "image",
      "mheader": true,
      "leftmenu": 1,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "image"
        }
      ]
    },
    {
      "path": "/test/pswp",
      "name": "pswp",
      "mheader": true,
      "leftmenu": 1,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "pswp"
        }
      ]
    },
    {
      "path": "/load",
      "name": "load",
      "mheader": true,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "load"
        }
      ]
    },
    {
      "path": "*",
      "name": "404",
      "mheader": true,
      "card_group": [
        {
          "card_type": "md",
          "md_type": "404"
        }
      ]
    }
  ]
}
