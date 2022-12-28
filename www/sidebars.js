/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],
  
  sidebar: [
    'introduction',
    'quickstart',
    'handler',
    'errors',
    'data_validation',
    'file',
    'middlewares',
    'server_calls',
    'routes',
    'launch_server',
    'socket',
    'client_code',
    'automatic_documentation',
    'example'
    // {
    //   type: 'category',
    //   label: 'Examples',
    //   items: ['examples/basic'],
    //   link: {
    //     type: 'generated-index',
    //     title: 'Examples',
    //     slug: '/examples',
    //   },
    // },
  ],
   
};

module.exports = sidebars;