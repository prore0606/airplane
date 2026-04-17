/* eslint-disable @typescript-eslint/no-explicit-any */

export interface HighlightedPlace { lat: number; lng: number; name: string }

export const AIRPORT_CENTER = { lat: 37.4602, lng: 126.4462 }

export const TERMINALS = [
  { id: 'T1', label: '제1터미널', lat: 37.4491, lng: 126.4505, color: '#1DB954' },
  { id: 'T2', label: '제2터미널', lat: 37.4697, lng: 126.4426, color: '#3498DB' },
]

export function buildMap(container: HTMLDivElement, zoom = 14): any {
  const w = container.offsetWidth  || container.clientWidth
  const h = container.offsetHeight || container.clientHeight

  const opts: Record<string, any> = {
    center: new window.naver.maps.LatLng(AIRPORT_CENTER.lat, AIRPORT_CENTER.lng),
    zoom,
    mapTypeId: window.naver.maps.MapTypeId.NORMAL,
  }
  // 컨테이너 크기를 명시 — 공식 문서: "초기화 시점의 DOM 크기로 생성"
  if (w > 0 && h > 0) opts.size = new window.naver.maps.Size(w, h)

  return new window.naver.maps.Map(container, opts)
}

export function placeTerminalMarkers(map: any): any[] {
  return TERMINALS.map((t) => {
    const content = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;transform:translate(-50%,-100%);pointer-events:none;">
        <div style="background:${t.color};color:white;font-weight:900;font-size:13px;padding:6px 14px;border-radius:20px;box-shadow:0 3px 10px rgba(0,0,0,.25);white-space:nowrap;">${t.id} ${t.label}</div>
        <div style="width:10px;height:10px;background:${t.color};clip-path:polygon(0 0,100% 0,50% 100%);"></div>
      </div>`
    return new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(t.lat, t.lng),
      map, icon: { content, anchor: new window.naver.maps.Point(0, 0) }, clickable: false,
    })
  })
}

export function placeUserMarker(map: any, loc: { lat: number; lng: number }): any {
  const content = `<div style="width:18px;height:18px;border-radius:50%;background:#3B82F6;border:3px solid #fff;box-shadow:0 0 0 5px rgba(59,130,246,.2);transform:translate(-50%,-50%);"></div>`
  const marker = new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(loc.lat, loc.lng),
    map, icon: { content, anchor: new window.naver.maps.Point(0, 0) }, clickable: false,
  })
  map.panTo(new window.naver.maps.LatLng(loc.lat, loc.lng))
  return marker
}

export function placeHighlightMarker(map: any, place: HighlightedPlace): any {
  const content = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;transform:translate(-50%,-100%);pointer-events:none;">
      <div style="background:#FF5733;color:white;font-weight:900;font-size:12px;padding:5px 12px;border-radius:20px;box-shadow:0 3px 10px rgba(0,0,0,.3);white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;">${place.name}</div>
      <div style="width:10px;height:10px;background:#FF5733;clip-path:polygon(0 0,100% 0,50% 100%);"></div>
    </div>`
  const marker = new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(place.lat, place.lng),
    map, icon: { content, anchor: new window.naver.maps.Point(0, 0) }, clickable: false, zIndex: 10,
  })
  map.panTo(new window.naver.maps.LatLng(place.lat, place.lng))
  map.setZoom(17, true)
  return marker
}

export function placeClickPin(map: any, lat: number, lng: number): any {
  const content = `
    <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);pointer-events:none;">
      <div style="width:22px;height:22px;border-radius:50%;background:#E63946;border:3px solid #fff;box-shadow:0 3px 12px rgba(230,57,70,.5);"></div>
      <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:10px solid #E63946;margin-top:-2px;"></div>
    </div>`
  return new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(lat, lng),
    map, icon: { content, anchor: new window.naver.maps.Point(0, 0) }, clickable: false, zIndex: 999,
  })
}
