import React from 'react';
import {
  ILowCodePluginContext,
  plugins,
  project,
  config,
} from '@alilc/lowcode-engine';

import { request } from 'umi';

import AliLowCodeEngineExt from '@alilc/lowcode-engine-ext';
import { Button } from '@alifd/next';
import UndoRedoPlugin from '@alilc/lowcode-plugin-undo-redo';
import ComponentsPane from '@alilc/lowcode-plugin-components-pane';
import PageManagerPane from '@/components/Lowcode/plugins/pages-plugin';
import CodeGenPlugin from '@alilc/lowcode-plugin-code-generator';
import DataSourcePanePlugin from '@alilc/lowcode-plugin-datasource-pane';
import SchemaPlugin from '@alilc/lowcode-plugin-schema';
import CodeEditor from "@alilc/lowcode-plugin-code-editor";
import Inject, { injectAssets } from '@alilc/lowcode-plugin-inject';

import {
  OrderedListOutlined,
} from '@ant-design/icons';

// 注册到引擎
import TitleSetter from '@alilc/lowcode-setter-title';
import BehaviorSetter from './setters/behavior-setter';
import CustomSetter from './setters/custom-setter';
import Logo from './sample-plugins/logo';

import {
  loadIncrementalAssets,
  saveSchema,
  resetSchema,
  preview,
} from './universal/utils';

import defaultSchema from './schema.json';
export default async function registerPlugins(schema: any) {

  await plugins.register(Inject);
  // plugin API 见 https://yuque.antfin.com/ali-lowcode/docs/cdukce
  SchemaPlugin.pluginName = 'SchemaPlugin';
  await plugins.register(SchemaPlugin);

  const editorInit = (ctx: ILowCodePluginContext) => {
    return {
      name: 'editor-init',
      async init() {
        // 修改面包屑组件的分隔符属性setter
        // const assets = await (
        //   await fetch(
        //     `https://alifd.alicdn.com/npm/@alilc/lowcode-materials/build/lowcode/assets-prod.json`
        //   )
        // ).json();
        // 设置物料描述
        const { material, project } = ctx;
        const assets = await request('/public/assets.json');
        // 获取 schemaId, 如果没有的话， 就使用默认
        material.setAssets(await injectAssets(assets));

        // 加载 schema
        project.openDocument(schema);
      },
    };
  }
  editorInit.pluginName = 'editorInit';
  await plugins.register(editorInit);

  const builtinPluginRegistry = (ctx: ILowCodePluginContext) => {
    return {
      name: 'builtin-plugin-registry',
      async init() {
        const { skeleton } = ctx;
        // 注册 logo 面板
        skeleton.add({
          area: 'topArea',
          type: 'Widget',
          name: 'logo',
          content: Logo,
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
          props: {
            align: 'left',
          },
        });

         // 注册页面列表
         const pagesManagerPane = skeleton.add({
          area: 'leftArea',
          type: 'PanelDock',
          name: 'pageManager',
          content: PageManagerPane,
          contentProps: {},
          props: {
            align: 'top',
            icon: <OrderedListOutlined />,
            description: '页面管理',
          },
        });
        pagesManagerPane?.disable?.();
        project.onSimulatorRendererReady(() => {
          pagesManagerPane?.enable?.();
        });

        // 注册组件面板
        const componentsPane = skeleton.add({
          area: 'leftArea',
          type: 'PanelDock',
          name: 'componentsPane',
          content: ComponentsPane,
          contentProps: {},
          props: {
            align: 'top',
            icon: 'zujianku',
            description: '组件库',
          },
        });
        componentsPane?.disable?.();
        project.onSimulatorRendererReady(() => {
          componentsPane?.enable?.();
        });
      },
    };
  }

  builtinPluginRegistry.pluginName = 'builtinPluginRegistry';
  await plugins.register(builtinPluginRegistry);

  // 设置内置 setter 和事件绑定、插件绑定面板
  const setterRegistry = (ctx: ILowCodePluginContext) => {
    const { setterMap, pluginMap } = AliLowCodeEngineExt;
    return {
      name: 'ext-setters-registry',
      async init() {
        const { setters, skeleton } = ctx;
        // 注册setterMap
        setters.registerSetter(setterMap);
        // 注册插件
        // 注册事件绑定面板
        skeleton.add({
          area: 'centerArea',
          type: 'Widget',
          content: pluginMap.EventBindDialog,
          name: 'eventBindDialog',
          props: {},
        });

        // 注册变量绑定面板
        skeleton.add({
          area: 'centerArea',
          type: 'Widget',
          content: pluginMap.VariableBindDialog,
          name: 'variableBindDialog',
          props: {},
        });
      },
    };
  }
  setterRegistry.pluginName = 'setterRegistry';
  await plugins.register(setterRegistry);

  // 注册回退/前进
  await plugins.register(UndoRedoPlugin);

  const loadAssetsSample = (ctx: ILowCodePluginContext) => {
    return {
      name: 'loadAssetsSample',
      async init() {
        const { skeleton } = ctx;

        skeleton.add({
          name: 'loadAssetsSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
            width: 80,
          },
          content: (
            <Button onClick={loadIncrementalAssets}>
              异步加载资源
            </Button>
          ),
        });
      },
    };
  };
  loadAssetsSample.pluginName = 'loadAssetsSample';
  await plugins.register(loadAssetsSample);

  // 注册保存面板
  const saveSample = (ctx: ILowCodePluginContext) => {
    return {
      name: 'saveSample',
      async init() {
        const { skeleton, hotkey } = ctx;

        skeleton.add({
          name: 'saveSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button onClick={() => {
              saveSchema();
            }}>
              保存到服务器
            </Button>
          ),
        });
        skeleton.add({
          name: 'resetSchema',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button onClick={resetSchema}>
              重置页面
            </Button>
          ),
        });
        hotkey.bind('command+s', (e) => {
          e.preventDefault();
          saveSchema(schemaId);
        });
      },
    };
  }
  saveSample.pluginName = 'saveSample';
  await plugins.register(saveSample);

  DataSourcePanePlugin.pluginName = 'DataSourcePane';
  await plugins.register(DataSourcePanePlugin);

  CodeEditor.pluginName = 'CodeEditor';
  await plugins.register(CodeEditor);

  // 注册出码插件
  CodeGenPlugin.pluginName = 'CodeGenPlugin';
  await plugins.register(CodeGenPlugin);

  const previewSample = (ctx: ILowCodePluginContext) => {
    return {
      name: 'previewSample',
      async init() {
        const { skeleton } = ctx;
        skeleton.add({
          name: 'previewSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button type="primary" onClick={() => {
              return preview();
            }}>
              预览
            </Button>
          ),
        });
      },
    };
  };
  previewSample.pluginName = 'previewSample';
  await plugins.register(previewSample);

  const customSetter = (ctx: ILowCodePluginContext) => {
    return {
      name: '___registerCustomSetter___',
      async init() {
        const { setters } = ctx;

        setters.registerSetter('TitleSetter', TitleSetter);
        setters.registerSetter('BehaviorSetter', BehaviorSetter);
        setters.registerSetter('CustomSetter', CustomSetter);
      },
    };
  }
  customSetter.pluginName = 'customSetter';
  await plugins.register(customSetter);
};

