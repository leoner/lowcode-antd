export default [
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/lowcode',
    name: 'lowcode',
    icon: 'crown',
    component: './LowcodeList/edit',
  },
  {
    path: '/preview',
    name: 'preview',
    icon: 'crown',
    component: './LowcodeList/preview',
  },
  {
    path: '/preview/:schemaId',
    icon: 'crown',
    component: './LowcodeList/preview',
  },
  {
    path: '/list',
    name: 'lowcodeList',
    icon: 'crown',
    component: './LowcodeList',
  },
  {
    path: '/lowcode/edit/:schemaId',
    show: false,
    icon: 'crown',
    component: './LowcodeList/edit',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
