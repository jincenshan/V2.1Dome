const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/dashboard',
    type: 'get',
    response: config => {
      // const items = data.items
      return {
        code: 20000,
        data: {
          "menuList": [
            {
              "create_time": "2018-03-16 11:33:00",
              "menu_type": "M",
              "children": [
                {
                  "create_time": "2018-03-16 11:33:00",
                  "menu_type": "C",
                  "children": [],
                  "parent_id": 1,
                  "menu_name": "????????????",
                  "icon": "#",
                  "perms": "system:user:index",
                  "order_num": 1,
                  "menu_id": 4,
                  "url": "/system/user"
                },
                {
                  "create_time": "2018-12-28 10:36:20",
                  "menu_type": "M",
                  "children": [
                    {
                      "create_time": "2018-12-28 10:50:28",
                      "menu_type": "C",
                      "parent_id": 73,
                      "menu_name": "???????????????",
                      "icon": null,
                      "perms": "system:person:index",
                      "order_num": 1,
                      "menu_id": 74,
                      "url": "/system/book/person"
                    }
                  ],
                  "parent_id": 1,
                  "menu_name": "???????????????",
                  "icon": "fa fa-address-book-o",
                  "perms": null,
                  "order_num": 1,
                  "menu_id": 73,
                  "url": "#"
                }
              ],
              "parent_id": 0,
              "menu_name": "????????????",
              "icon": "fa fa-adjust",
              "perms": null,
              "order_num": 2,
              "menu_id": 1,
              "url": "#"
            },
            {
              "create_time": "2018-03-16 11:33:00",
              "menu_type": "M",
              "children": [
                {
                  "create_time": "2018-03-16 11:33:00",
                  "menu_type": "C",
                  "parent_id": 2,
                  "menu_name": "????????????",
                  "icon": "#",
                  "perms": "monitor:data:view",
                  "order_num": 3,
                  "menu_id": 15,
                  "url": "/system/druid/monitor"
                }
              ],
              "parent_id": 0,
              "menu_name": "????????????",
              "icon": "fa fa-video-camera",
              "perms": null,
              "order_num": 5,
              "menu_id": 2,
              "url": "#"
            }
          ]
        }
      }
    }
  }
]
