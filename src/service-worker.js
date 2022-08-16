/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
)
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute'
precacheAndRoute(self.__WB_MANIFEST)
// define a prefix for your cache names. It is recommended to use your project name
workbox.core.setCacheNameDetails({ prefix: 'mini-twi' })

// Start of Precaching##########################
// __precacheManifest is the list of resources you want to precache. This list will be generated and imported automatically by workbox during build time
self.__precacheManifest = [].concat(self.__precacheManifest || [])
// End of Precaching############################

// Start of CachFirst Strategy##################
// all the api request which matchs the following pattern will use CacheFirst strategy for caching
// workbox.routing.registerRoute(
//   /https:\/\/get\.geojs\.io\/v1\/ip\/country\.json/,
//   new workbox.strategies.CacheFirst()
// )
// // End of CachFirst Strategy####################

// SW life cycle
self.addEventListener('install', (event) => {
  console.log('Installing ....................')
})
self.addEventListener('activate', (event) => {
  console.log('activateing ....................')
})
self.addEventListener('fetch', (event) => {
  console.log('fetching ....................')
})
