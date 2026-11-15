// 패널 배경 장식: 스피커 그릴 점 무늬 + 무대 조명 같은 분홍·파랑 빛
// 부모 요소에 `relative overflow-hidden`이 있어야 한다
export default function StageBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* 그릴: 위쪽에서 진하고 아래로 갈수록 사라짐 */}
      <div className="bg-grille absolute inset-0 mask-b-from-0% mask-b-to-70%" />
      {/* 조명 */}
      <div className="absolute -top-40 -left-40 size-[36rem] rounded-full bg-radial from-neon-pink/35 to-transparent to-70%" />
      <div className="absolute -top-20 -right-48 size-[30rem] rounded-full bg-radial from-neon-blue/25 to-transparent to-70%" />
    </div>
  )
}
