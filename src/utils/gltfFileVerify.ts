
export const gltfFileVerify = (gltf:ArrayBuffer):boolean => {
  const dv = new DataView(gltf);
  const magic = dv.getUint32(0, true);
  if (magic !== 0x46546C67) {
    return false;
  }
  return true;
}