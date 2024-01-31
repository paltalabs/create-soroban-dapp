const { JSDOM } = require('jsdom')
const React = require('react')
const { useContext } = require('react')
const { render } = require('react-dom')
const { renderHook } = require('@testing-library/react-hooks')
require('raf/polyfill')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')

global.window = jsdom.window
global.document = jsdom.window.document
global.navigator = {
  userAgent: 'node.js',
}
global.React = React
global.useContext = useContext
global.render = render
global.renderHook = renderHook
