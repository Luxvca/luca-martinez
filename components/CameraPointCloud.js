"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const WHITE = new THREE.Color("#f2f0e7");

const hotspotPoses = {
  selectedWork: { x: -0.64, y: -0.74 },
  commercials: { x: -0.64, y: 0.74 },
  musicVideos: { x: 0.64, y: 0.74 },
  treatments: { x: 0.64, y: -0.74 },
  contact: { x: 0.88, y: 0 }
};

const POINT_GRID_STEP = 0.024;

function createColorAttribute(count) {
  const colors = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    colors[index * 3] = WHITE.r;
    colors[index * 3 + 1] = WHITE.g;
    colors[index * 3 + 2] = WHITE.b;
  }

  return colors;
}

function setWhite(colors, index) {
  colors[index * 3] = WHITE.r;
  colors[index * 3 + 1] = WHITE.g;
  colors[index * 3 + 2] = WHITE.b;
}

function getHotspotTarget(activeHotspot, pointer) {
  if (!activeHotspot) {
    return {
      x: THREE.MathUtils.degToRad(pointer.current.y * -80),
      y: THREE.MathUtils.degToRad(pointer.current.x * 100)
    };
  }

  return hotspotPoses[activeHotspot] || { x: 0, y: 0 };
}

function createLensRingPoints() {
  const positions = [];
  const ringConfigs = [
    { x: 0.26, radius: 0.56, segments: 88 },
    { x: 0.5, radius: 0.58, segments: 92 },
    { x: 0.78, radius: 0.6, segments: 96 },
    { x: 1.04, radius: 0.62, segments: 100 },
    { x: 1.28, radius: 0.64, segments: 104 },
    { x: 1.52, radius: 0.66, segments: 108 }
  ];

  ringConfigs.forEach(({ x, radius, segments }) => {
    for (let index = 0; index < segments; index += 1) {
      const angle = (index / segments) * Math.PI * 2;
      positions.push(x, Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
  });

  return new Float32Array(positions);
}

function snapToGrid(value, step = POINT_GRID_STEP) {
  return Math.round(value / step) * step;
}

function createFallbackCameraPoints() {
  const positions = [];
  const bodyMatrix = new THREE.Matrix4().makeTranslation(-0.4, 0.15, 0);

  const sampleBox = (size, density, matrix) => {
    const halfX = size.x / 2;
    const halfY = size.y / 2;
    const halfZ = size.z / 2;

    for (let xi = 0; xi < density; xi += 1) {
      const x = THREE.MathUtils.lerp(-halfX, halfX, xi / (density - 1));

      for (let yi = 0; yi < density; yi += 1) {
        const y = THREE.MathUtils.lerp(-halfY, halfY, yi / (density - 1));
        [new THREE.Vector3(x, y, -halfZ), new THREE.Vector3(x, y, halfZ)].forEach((point) => {
          point.applyMatrix4(matrix);
          positions.push(point.x, point.y, point.z);
        });
      }
    }
  };

  sampleBox(new THREE.Vector3(2.45, 1.25, 1.15), 13, bodyMatrix);
  positions.push(...createLensRingPoints());
  return new Float32Array(positions);
}

function buildPointsGeometry(positionArray) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positionArray, 3));
  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(createColorAttribute(positionArray.length / 3), 3)
  );
  return geometry;
}

function buildSampledModelData(rootObject) {
  const positions = [];
  const seen = new Set();
  const root = rootObject.clone(true);
  root.updateWorldMatrix(true, true);
  const samplePoint = new THREE.Vector3();

  root.traverse((child) => {
    if (!child.isMesh || !child.geometry?.attributes?.position) {
      return;
    }

    const mesh = new THREE.Mesh(child.geometry.clone(), child.material);
    const surfaceAreaEstimate = child.geometry.attributes.position.count;
    const sampleCount = Math.min(5000, Math.max(900, Math.floor(surfaceAreaEstimate * 0.35)));
    const sampler = new MeshSurfaceSampler(mesh).build();

    for (let index = 0; index < sampleCount; index += 1) {
      sampler.sample(samplePoint);
      samplePoint.applyMatrix4(child.matrixWorld);

      const x = snapToGrid(samplePoint.x);
      const y = snapToGrid(samplePoint.y);
      const z = snapToGrid(samplePoint.z);
      const key = `${x}|${y}|${z}`;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      positions.push(x, y, z);
    }
  });

  if (positions.length === 0) {
    return {
      geometry: buildPointsGeometry(createFallbackCameraPoints()),
      scale: 0.82,
      normalizedPoints: []
    };
  }

  const centerGeometry = buildPointsGeometry(new Float32Array(positions));
  centerGeometry.computeBoundingBox();
  centerGeometry.computeBoundingSphere();

  if (centerGeometry.boundingBox) {
    const center = new THREE.Vector3();
    centerGeometry.boundingBox.getCenter(center);
    centerGeometry.translate(-center.x, -center.y, -center.z);
  }

  centerGeometry.computeBoundingSphere();

  const radius = centerGeometry.boundingSphere?.radius || 1;
  const normalizedScale = radius > 0 ? 1.9 / radius : 1;
  const pointArray = centerGeometry.attributes.position.array;
  const points = [];

  for (let index = 0; index < centerGeometry.attributes.position.count; index += 1) {
    points.push({
      x: pointArray[index * 3] / radius,
      y: pointArray[index * 3 + 1] / radius,
      z: pointArray[index * 3 + 2] / radius
    });
  }

  return {
    geometry: centerGeometry,
    scale: normalizedScale,
    normalizedPoints: points
  };
}

function LensRingOverlay({ scale = 1 }) {
  const geometry = useMemo(() => buildPointsGeometry(createLensRingPoints()), []);

  return (
    <points geometry={geometry} scale={scale}>
      <pointsMaterial
        color="#f2f0e7"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.82}
      />
    </points>
  );
}

function FallbackPointCloud({ pointer, activeHotspot }) {
  const rigRef = useRef(null);
  const pointsRef = useRef(null);
  const geometry = useMemo(() => buildPointsGeometry(createFallbackCameraPoints()), []);
  const basePositions = useMemo(
    () => new Float32Array(geometry.attributes.position.array),
    [geometry]
  );
  const driftOffsets = useMemo(() => {
    const count = geometry.attributes.position.count;
    const offsets = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      offsets[index] = Math.random() * Math.PI * 2;
    }

    return offsets;
  }, [geometry]);

  useFrame((state) => {
    if (!rigRef.current || !pointsRef.current) {
      return;
    }

    const time = state.clock.getElapsedTime();
    const target = getHotspotTarget(activeHotspot, pointer);
    const positions = geometry.attributes.position.array;
    const colors = geometry.attributes.color.array;

    rigRef.current.position.y = Math.sin(time * 0.45) * 0.03;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, target.x, 0.08);
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, target.y, 0.08);
    pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, 0, 0.05);

    for (let index = 0; index < geometry.attributes.position.count; index += 1) {
      const x = basePositions[index * 3];
      const y = basePositions[index * 3 + 1];
      const z = basePositions[index * 3 + 2];

      positions[index * 3] = x;
      positions[index * 3 + 1] = y + Math.sin(time * 0.45 + driftOffsets[index]) * 0.006;
      positions[index * 3 + 2] = z;

      setWhite(colors, index);
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <group ref={rigRef}>
      <points ref={pointsRef} geometry={geometry} scale={1.62}>
        <pointsMaterial size={0.032} sizeAttenuation transparent opacity={0.95} vertexColors />
      </points>
      <LensRingOverlay scale={1.62} />
    </group>
  );
}

function BaseModelPointCloud({ pointer, activeHotspot, rootObject, scatter }) {
  const rigRef = useRef(null);
  const pointsRef = useRef(null);
  const tempPoint = useMemo(() => new THREE.Vector3(), []);
  const { geometry, scale, normalizedPoints } = useMemo(
    () => buildSampledModelData(rootObject),
    [rootObject]
  );
  const basePositions = useMemo(
    () => new Float32Array(geometry.attributes.position.array),
    [geometry]
  );
  const scatterVectors = useMemo(() => {
    const vectors = new Float32Array(geometry.attributes.position.count * 3);

    for (let index = 0; index < geometry.attributes.position.count; index += 1) {
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      )
        .normalize()
        .multiplyScalar(1.35 + Math.random() * 1.8);

      vectors[index * 3] = direction.x;
      vectors[index * 3 + 1] = direction.y;
      vectors[index * 3 + 2] = direction.z;
    }

    return vectors;
  }, [geometry]);

  useFrame((state) => {
    if (!rigRef.current || !pointsRef.current) {
      return;
    }

    const time = state.clock.getElapsedTime();
    const target = getHotspotTarget(activeHotspot, pointer);
    const positions = geometry.attributes.position.array;
    const scatterState = scatter?.current || { amount: 0, hovered: false };

    scatterState.amount = THREE.MathUtils.lerp(scatterState.amount, 0, 0.08);
    if (scatter?.current) {
      scatter.current.amount = scatterState.amount;
    }

    rigRef.current.position.y = Math.sin(time * 0.45) * 0.03;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, target.x, 0.08);
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, target.y, 0.08);
    pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, 0, 0.05);

    const colors = geometry.attributes.color.array;

    for (let index = 0; index < normalizedPoints.length; index += 1) {
      setWhite(colors, index);

      const baseX = basePositions[index * 3];
      const baseY = basePositions[index * 3 + 1];
      const baseZ = basePositions[index * 3 + 2];

      // Project each point into screen space so the cursor acts like a localized force field.
      tempPoint.set(baseX, baseY, baseZ);
      tempPoint.applyMatrix4(pointsRef.current.matrixWorld);
      tempPoint.project(state.camera);

      const dx = tempPoint.x - pointer.current.x;
      const dy = tempPoint.y - pointer.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influenceRadius = 0.34;
      const falloff = Math.max(0, 1 - distance / influenceRadius);
      const pressure = scatterState.hovered ? Math.pow(falloff, 2) * 3.2 : 0;
      const speedBoost = scatterState.amount * Math.pow(falloff, 2) * 2.4;
      const scatterAmount = pressure + speedBoost;
      const pulse = 0.8 + Math.sin(time * 9 + index * 0.23) * 0.2;

      positions[index * 3] =
        baseX + scatterVectors[index * 3] * scatterAmount * pulse;
      positions[index * 3 + 1] =
        baseY + scatterVectors[index * 3 + 1] * scatterAmount * pulse;
      positions[index * 3 + 2] =
        baseZ + scatterVectors[index * 3 + 2] * scatterAmount * pulse;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <group ref={rigRef}>
      <points ref={pointsRef} geometry={geometry} scale={scale * 1.76} frustumCulled={false}>
        <pointsMaterial size={0.038} sizeAttenuation transparent opacity={1} vertexColors />
      </points>
      <LensRingOverlay scale={scale * 1.76} />
    </group>
  );
}

function ModelPointCloudGLB({ pointer, activeHotspot, scatter }) {
  const gltf = useGLTF("/models/cinema-camera.glb");
  return (
    <BaseModelPointCloud
      pointer={pointer}
      activeHotspot={activeHotspot}
      rootObject={gltf.scene}
      scatter={scatter}
    />
  );
}

function ModelPointCloudPinkGLB({ pointer, activeHotspot, scatter }) {
  const gltf = useGLTF("/models/camera_pink.glb");
  return (
    <BaseModelPointCloud
      pointer={pointer}
      activeHotspot={activeHotspot}
      rootObject={gltf.scene}
      scatter={scatter}
    />
  );
}

function ModelPointCloudOBJ({ pointer, activeHotspot, scatter }) {
  const object = useLoader(OBJLoader, "/models/camera.obj");
  return (
    <BaseModelPointCloud
      pointer={pointer}
      activeHotspot={activeHotspot}
      rootObject={object}
      scatter={scatter}
    />
  );
}

class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function CameraScene({ modelType, activeHotspot }) {
  const pointer = useRef({ x: 0, y: 0 });
  const scatter = useRef({ amount: 0, hovered: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    function handlePointerMove(event) {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * -2;

      pointer.current.x = THREE.MathUtils.clamp(x, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp(y, -1, 1);
    }

    function handlePointerLeave() {
      pointer.current.x = 0;
      pointer.current.y = 0;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      className="h-full w-full"
      onPointerEnter={() => {
        scatter.current.hovered = true;
      }}
      onPointerLeave={() => {
        scatter.current.hovered = false;
      }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const dx = x - scatter.current.lastX;
        const dy = y - scatter.current.lastY;
        const speed = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 12);

        scatter.current.lastX = x;
        scatter.current.lastY = y;
        scatter.current.amount = Math.max(scatter.current.amount, speed * 12);
      }}
    >
      <Canvas camera={{ position: [0, 0, 8.2], fov: 48, near: 0.1, far: 100 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <Suspense fallback={<FallbackPointCloud pointer={pointer} activeHotspot={activeHotspot} />}>
          <SceneErrorBoundary
            fallback={<FallbackPointCloud pointer={pointer} activeHotspot={activeHotspot} />}
          >
            {modelType === "glb" ? (
              <ModelPointCloudGLB pointer={pointer} activeHotspot={activeHotspot} scatter={scatter} />
            ) : modelType === "obj" ? (
              <ModelPointCloudOBJ pointer={pointer} activeHotspot={activeHotspot} scatter={scatter} />
            ) : modelType === "pink-glb" ? (
              <ModelPointCloudPinkGLB
                pointer={pointer}
                activeHotspot={activeHotspot}
                scatter={scatter}
              />
            ) : (
              <FallbackPointCloud pointer={pointer} activeHotspot={activeHotspot} />
            )}
          </SceneErrorBoundary>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

export default function CameraPointCloud({ activeHotspot }) {
  const [modelType, setModelType] = useState(null);

  useEffect(() => {
    let ignore = false;

    Promise.allSettled([
      fetch("/models/cinema-camera.glb", { method: "HEAD" }),
      fetch("/models/camera.obj", { method: "HEAD" }),
      fetch("/models/camera_pink.glb", { method: "HEAD" })
    ]).then(([glbResult, objResult, pinkGlbResult]) => {
      if (ignore) {
        return;
      }

      const glbOk = glbResult.status === "fulfilled" && glbResult.value.ok;
      const objOk = objResult.status === "fulfilled" && objResult.value.ok;
      const pinkGlbOk = pinkGlbResult.status === "fulfilled" && pinkGlbResult.value.ok;

      if (glbOk) {
        setModelType("glb");
      } else if (objOk) {
        setModelType("obj");
      } else if (pinkGlbOk) {
        setModelType("pink-glb");
      } else {
        setModelType(null);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  return <CameraScene modelType={modelType} activeHotspot={activeHotspot} />;
}
