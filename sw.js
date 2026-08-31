const CACHE='oposmurcia360-v15';
const CORE=['./index.html?v=15','./manifest.webmanifest?v=15','./logo-oposmurcia360.png?v=15','./icon-192.png?v=15','./icon-512.png?v=15'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(c=>c.put('./index.html?v=15',copy));
          return response;
        })
        .catch(()=>caches.match('./index.html?v=15'))
    );
    return;
  }

  event.respondWith(
    fetch(event.request,{cache:'no-store'})
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(c=>c.put(event.request,copy));
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});
