import * as THREE from "three";
import {
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  LineBasicMaterial,
  LineDashedMaterial,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3DEventMap,
  PointsMaterial,
  RawShaderMaterial,
  ShaderMaterial,
  ShadowMaterial,
  SpriteMaterial
} from "three";

export class BaseEntity {
   geometry: THREE.BoxGeometry | THREE.BufferGeometry | THREE.ConeGeometry | THREE.CircleGeometry | THREE.CapsuleGeometry | THREE.CylinderGeometry | THREE.DodecahedronGeometry;
   material: THREE.LineBasicMaterial | THREE.LineDashedMaterial | THREE.Material | THREE.PointsMaterial | THREE.RawShaderMaterial | THREE.ShaderMaterial | THREE.ShadowMaterial | THREE.SpriteMaterial;
   mesh: Mesh<BoxGeometry | BufferGeometry<NormalBufferAttributes> | ConeGeometry | CircleGeometry | CapsuleGeometry | CylinderGeometry | DodecahedronGeometry, LineBasicMaterial | LineDashedMaterial | Material | PointsMaterial | RawShaderMaterial | ShaderMaterial | ShadowMaterial | SpriteMaterial, Object3DEventMap>

   setGeometry(geometry: THREE.BoxGeometry | THREE.BufferGeometry | THREE.ConeGeometry | THREE.CircleGeometry | THREE.CapsuleGeometry | THREE.CylinderGeometry | THREE.DodecahedronGeometry) {
      this.geometry = geometry;
   }

    setMaterial(material: THREE.LineBasicMaterial | THREE.LineDashedMaterial | THREE.Material | THREE.PointsMaterial | THREE.RawShaderMaterial | THREE.ShaderMaterial | THREE.ShadowMaterial | THREE.SpriteMaterial) {
        this.material = material;
    }

  setMesh(mesh: Mesh<BoxGeometry | BufferGeometry<NormalBufferAttributes> | ConeGeometry | CircleGeometry | CapsuleGeometry | CylinderGeometry | DodecahedronGeometry, LineBasicMaterial | LineDashedMaterial | Material | PointsMaterial | RawShaderMaterial | ShaderMaterial | ShadowMaterial | SpriteMaterial, Object3DEventMap>) {
        this.mesh = mesh;
    }
}
