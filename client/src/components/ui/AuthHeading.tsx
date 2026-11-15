type AuthHeadingProps = {
  title: string
  description: string
}

// 로그인·회원가입 폼 상단 제목
export default function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      <h2 className="text-3xl font-black md:text-5xl tracking-tight">{title}</h2>
      <p className="text-dim md:text-lg">{description}</p>
    </div>
  )
}
