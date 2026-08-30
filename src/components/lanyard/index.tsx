/* eslint-disable react/no-unknown-property */
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./index.module.css";

type BodyRef = React.MutableRefObject<any>;

function Band({ mobile }: { mobile: boolean }) {
  const fixed = useRef<any>(null);
  const joint1 = useRef<any>(null);
  const joint2 = useRef<any>(null);
  const joint3 = useRef<any>(null);
  const card = useRef<any>(null);
  const line = useRef<MeshLineGeometry>(null);
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);
  const front = useTexture("/lanyard/badge-front.svg");
  const back = useTexture("/lanyard/badge-back.svg");
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(Array.from({ length: 4 }, () => new THREE.Vector3())),
    [],
  );
  const lineMaterial = useMemo(
    () => {
      const material = new MeshLineMaterial({
        color: "#183d32",
        lineWidth: mobile ? 0.9 : 1.15,
        resolution: { x: 1000, y: mobile ? 1800 : 1000 } as any,
      });
      material.depthTest = false;
      return material;
    },
    [mobile],
  );
  const vector = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const angular = useMemo(() => new THREE.Vector3(), []);
  const rotation = useMemo(() => new THREE.Vector3(), []);
  const bodyProps = { canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 };

  useRopeJoint(fixed as BodyRef, joint1 as BodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(joint1 as BodyRef, joint2 as BodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(joint2 as BodyRef, joint3 as BodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(joint3 as BodyRef, card as BodyRef, [[0, 0, 0], [0, 1.55, 0]]);

  useEffect(() => {
    if (!hovered || mobile) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => void (document.body.style.cursor = "auto");
  }, [dragged, hovered, mobile]);

  useFrame((state) => {
    if (dragged && !mobile) {
      vector.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera as any);
      direction.copy(vector).sub(state.camera.position).normalize();
      vector.add(direction.multiplyScalar(state.camera.position.length()));
      [card, joint1, joint2, joint3, fixed].forEach((item) => item.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vector.x - dragged.x,
        y: vector.y - dragged.y,
        z: vector.z - dragged.z,
      });
    }

    if (!fixed.current || !line.current) return;
    [joint1, joint2].forEach((item) => {
      if (!item.current.lerped) item.current.lerped = new THREE.Vector3().copy(item.current.translation());
      item.current.lerped.lerp(item.current.translation(), 0.18);
    });
    curve.points[0].copy(joint3.current.translation());
    curve.points[1].copy(joint2.current.lerped);
    curve.points[2].copy(joint1.current.lerped);
    curve.points[3].copy(fixed.current.translation());
    line.current.setPoints(curve.getPoints(mobile ? 18 : 32) as any);
    angular.copy(card.current.angvel());
    rotation.copy(card.current.rotation());
    card.current.setAngvel({ x: angular.x, y: angular.y - rotation.y * 0.25, z: angular.z });
  });

  curve.curveType = "chordal";
  front.colorSpace = back.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      <group position={[0, mobile ? 9 : 4.8, 0]}>
        <RigidBody ref={fixed} {...bodyProps} type="fixed" />
        <RigidBody ref={joint1} {...bodyProps} position={[0.5, 0, 0]}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody ref={joint2} {...bodyProps} position={[1, 0, 0]}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody ref={joint3} {...bodyProps} position={[1.5, 0, 0]}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody ref={card} {...bodyProps} position={[2.25, -0.2, 0]} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[1.22, 1.7, 0.055]} />
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={(event) => {
              (event.target as any)?.releasePointerCapture(event.pointerId);
              setDragged(false);
            }}
            onPointerDown={(event) => {
              if (mobile) return;
              (event.target as any)?.setPointerCapture(event.pointerId);
              setDragged(new THREE.Vector3().copy(event.point).sub(vector.copy(card.current.translation())));
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[2.44, 3.4, 0.11, 8, 8, 2]} />
              <meshPhysicalMaterial color="#dfece7" roughness={0.42} metalness={0.08} clearcoat={0.7} clearcoatRoughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.058]}>
              <planeGeometry args={[2.38, 3.34]} />
              <meshBasicMaterial map={front} />
            </mesh>
            <mesh position={[0, 0, -0.058]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[2.38, 3.34]} />
              <meshBasicMaterial map={back} />
            </mesh>
            <mesh position={[0, 1.78, 0]}>
              <boxGeometry args={[0.72, 0.22, 0.16]} />
              <meshStandardMaterial color="#a7b7b0" metalness={0.85} roughness={0.24} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh>
        <primitive ref={line} object={new MeshLineGeometry()} attach="geometry" />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
    </>
  );
}

export default function Lanyard() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const update = () => setMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className={styles.wrapper} aria-label="可拖动的 Jay Chiu 数字工牌">
      <Canvas camera={{ position: [0, 0, mobile ? 36 : 30], fov: mobile ? 24 : 20 }} dpr={[1, mobile ? 1 : 1.5]} gl={{ alpha: true, antialias: !mobile }}>
        <ambientLight intensity={Math.PI * 0.8} />
        <Physics gravity={[0, -38, 0]} timeStep={mobile ? 1 / 30 : 1 / 60}>
          <Band mobile={mobile} />
        </Physics>
        <Environment blur={0.8}>
          <Lightformer intensity={5} color="#39ff88" position={[-4, 2, 5]} scale={[8, 8, 1]} />
          <Lightformer intensity={4} color="#22d3ee" position={[5, -2, 4]} scale={[6, 6, 1]} />
          <Lightformer intensity={6} color="white" position={[0, 4, 8]} scale={[10, 2, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
