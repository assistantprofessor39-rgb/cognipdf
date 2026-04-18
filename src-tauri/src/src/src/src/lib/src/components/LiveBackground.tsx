import { useEffect, useRef } from 'react'
import * as THREE from 'three'
export default function LiveBackground() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    ref.current.appendChild(renderer.domElement)
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    for (let i = 0; i < 5000; i++) vertices.push(...[0,0,0].map(() => THREE.MathUtils.randFloatSpread(2000)))
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x4f46e5, size: 1 }))
    scene.add(particles); camera.position.z = 500;
    let frame = 0; (function animate() { frame = requestAnimationFrame(animate); particles.rotation.y += 0.0002; renderer.render(scene, camera) })()
    return () => cancelAnimationFrame(frame)
  }, [])
  return <div ref={ref} className="fixed inset-0 -z-10 opacity-30" />
}
