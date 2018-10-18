"use strict";!function(){function i(n){return new Promise(function(e,t){n.onsuccess=function(){e(n.result)},n.onerror=function(){t(n.error)}})}function u(n,r,o){var u,e=new Promise(function(e,t){i(u=n[r].apply(n,o)).then(e,t)});return e.request=u,e}function e(e,n,t){t.forEach(function(t){Object.defineProperty(e.prototype,t,{get:function(){return this[n][t]},set:function(e){this[n][t]=e}})})}function t(t,n,r,e){e.forEach(function(e){e in r.prototype&&(t.prototype[e]=function(){return u(this[n],e,arguments)})})}function n(t,n,r,e){e.forEach(function(e){e in r.prototype&&(t.prototype[e]=function(){return this[n][e].apply(this[n],arguments)})})}function r(e,r,t,n){n.forEach(function(n){n in t.prototype&&(e.prototype[n]=function(){return e=this[r],(t=u(e,n,arguments)).then(function(e){if(e)return new a(e,t.request)});var e,t})})}function o(e){this._index=e}function a(e,t){this._cursor=e,this._request=t}function c(e){this._store=e}function s(n){this._tx=n,this.complete=new Promise(function(e,t){n.oncomplete=function(){e()},n.onerror=function(){t(n.error)},n.onabort=function(){t(n.error)}})}function l(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new s(n)}function f(e){this._db=e}e(o,"_index",["name","keyPath","multiEntry","unique"]),t(o,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),r(o,"_index",IDBIndex,["openCursor","openKeyCursor"]),e(a,"_cursor",["direction","key","primaryKey","value"]),t(a,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(n){n in IDBCursor.prototype&&(a.prototype[n]=function(){var t=this,e=arguments;return Promise.resolve().then(function(){return t._cursor[n].apply(t._cursor,e),i(t._request).then(function(e){if(e)return new a(e,t._request)})})})}),c.prototype.createIndex=function(){return new o(this._store.createIndex.apply(this._store,arguments))},c.prototype.index=function(){return new o(this._store.index.apply(this._store,arguments))},e(c,"_store",["name","keyPath","indexNames","autoIncrement"]),t(c,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),r(c,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),n(c,"_store",IDBObjectStore,["deleteIndex"]),s.prototype.objectStore=function(){return new c(this._tx.objectStore.apply(this._tx,arguments))},e(s,"_tx",["objectStoreNames","mode"]),n(s,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new c(this._db.createObjectStore.apply(this._db,arguments))},e(l,"_db",["name","version","objectStoreNames"]),n(l,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new s(this._db.transaction.apply(this._db,arguments))},e(f,"_db",["name","version","objectStoreNames"]),n(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(u){[c,o].forEach(function(e){u in e.prototype&&(e.prototype[u.replace("open","iterate")]=function(){var e,t=(e=arguments,Array.prototype.slice.call(e)),n=t[t.length-1],r=this._store||this._index,o=r[u].apply(r,t.slice(0,-1));o.onsuccess=function(){n(o.result)}})})}),[o,c].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,n){var r=this,o=[];return new Promise(function(t){r.iterateCursor(e,function(e){e?(o.push(e.value),void 0===n||o.length!=n?e.continue():t(o)):t(o)})})})});var h={open:function(e,t,n){var r=u(indexedDB,"open",[e,t]),o=r.request;return o&&(o.onupgradeneeded=function(e){n&&n(new l(o.result,e.oldVersion,o.transaction))}),r.then(function(e){return new f(e)})},delete:function(e){return u(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?(module.exports=h,module.exports.default=module.exports):self.idb=h}();var _createClass=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}();function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var dbPromise=void 0;"serviceWorker"in navigator&&(navigator.serviceWorker.register("./sw.js",{scope:"./"}).then(function(e){console.log("Service worker now active")}).catch(function(e){console.log("Could not register Service Worker",e)}),dbPromise=idb.open("restaurant",1,function(e){e.createObjectStore("restaurants",{keyPath:"id"}).createIndex("by-id","id")}));var DBHelper=function(){function i(){_classCallCheck(this,i)}return _createClass(i,null,[{key:"fetchRestaurantsFromDB",value:function(){return dbPromise?dbPromise.then(function(e){return e?e.transaction("restaurants","readwrite").objectStore("restaurants").index("by-id").getAll().then(function(e){return e||null}):null}):null}},{key:"fetchRestaurantsFromServer",value:function(t){fetch(i.DATABASE_URL).then(function(e){return e.json()}).then(function(n){dbPromise.then(function(e){if(e){var t=e.transaction("restaurants","readwrite").objectStore("restaurants");n.forEach(function(e){t.put(e)})}}),t(null,n)}).catch(function(e){t(e,null)})}},{key:"fetchRestaurants",value:function(t){i.fetchRestaurantsFromDB().then(function(e){0<e.length?t(null,e):i.fetchRestaurantsFromServer(t)}).catch(function(e){console.log(e),i.fetchRestaurantsFromServer(t)})}},{key:"fetchRestaurantById",value:function(r,o){i.fetchRestaurants(function(e,t){if(e)o(e,null);else{var n=t.find(function(e){return e.id==r});n?o(null,n):o("Restaurant does not exist",null)}})}},{key:"fetchRestaurantByCuisine",value:function(r,o){i.fetchRestaurants(function(e,t){if(e)o(e,null);else{var n=t.filter(function(e){return e.cuisine_type==r});o(null,n)}})}},{key:"fetchRestaurantByNeighborhood",value:function(r,o){i.fetchRestaurants(function(e,t){if(e)o(e,null);else{var n=t.filter(function(e){return e.neighborhood==r});o(null,n)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(r,o,u){i.fetchRestaurants(function(e,t){if(e)u(e,null);else{var n=t;"all"!=r&&(n=n.filter(function(e){return e.cuisine_type==r})),"all"!=o&&(n=n.filter(function(e){return e.neighborhood==o})),u(null,n)}})}},{key:"fetchNeighborhoods",value:function(o){i.fetchRestaurants(function(e,n){if(e)o(e,null);else{var r=n.map(function(e,t){return n[t].neighborhood}),t=r.filter(function(e,t){return r.indexOf(e)==t});o(null,t)}})}},{key:"fetchCuisines",value:function(o){i.fetchRestaurants(function(e,n){if(e)o(e,null);else{var r=n.map(function(e,t){return n[t].cuisine_type}),t=r.filter(function(e,t){return r.indexOf(e)==t});o(null,t)}})}},{key:"urlForRestaurant",value:function(e){return"./restaurant.html?id="+e.id}},{key:"imageUrlForRestaurant",value:function(e){return e.hasOwnProperty("photograph")||(e.photograph="10"),"/img/"+e.photograph+".jpg"}},{key:"mapMarkerForRestaurant",value:function(e,t){var n=new L.marker([e.latlng.lat,e.latlng.lng],{title:e.name,alt:e.name,url:i.urlForRestaurant(e)});return n.addTo(newMap),n}},{key:"DATABASE_URL",get:function(){return "//localhost/data/restaurants.json"}}]),i}();
