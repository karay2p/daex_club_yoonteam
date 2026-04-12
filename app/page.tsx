export default function DAEXClubTeamPage() {
  const members = [
    { name: "박윤영", desc: "D.A.E.X. Club 박윤영팀의 팀원" },
    { name: "김아람", desc: "D.A.E.X. Club 박윤영팀의 팀원" },
    { name: "김문희", desc: "D.A.E.X. Club 박윤영팀의 팀원" },
    { name: "손다빈", desc: "D.A.E.X. Club 박윤영팀의 팀원" },
    { name: "양진아", desc: "D.A.E.X. Club 박윤영팀의 팀원" },
    { name: "이혜진", desc: "D.A.E.X. Club 박윤영팀의 팀원" },
    { name: "장주희", desc: "D.A.E.X. Club 박윤영팀의 팀원" },
    { name: "정승안", desc: "D.A.E.X. Club 박윤영팀의 팀원" },
    { name: "조혜령", desc: "D.A.E.X. Club 박윤영팀의 팀원" },
    { name: "황민희", desc: "D.A.E.X. Club 박윤영팀의 팀원" },
  ]

  const observer = { name: "김은진 디렉터", desc: "Observer" }

  const highlights = [
    "브랜드 중심 팀 운영",
    "교육 + 콘텐츠 + 전략 결합",
    "실행 가능한 시스템 구축",
    "지속 성장 구조 설계",
  ]

  const projects = [
    {
      title: "Brand System",
      desc: "D.A.E.X. Club만의 브랜드 아이덴티티와 메시지를 구축합니다.",
    },
    {
      title: "Education Content",
      desc: "실제 학원에 바로 적용 가능한 교육 콘텐츠를 제작합니다.",
    },
    {
      title: "Growth Strategy",
      desc: "지속 가능한 성장 구조와 수익화 전략을 설계합니다.",
    },
  ]

  const gradients = [
    "from-violet-500 to-fuchsia-500",
    "from-fuchsia-500 to-pink-500",
    "from-indigo-500 to-violet-500",
    "from-violet-400 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-blue-500 to-violet-500",
    "from-fuchsia-400 to-violet-600",
    "from-violet-600 to-indigo-600",
    "from-indigo-400 to-fuchsia-500",
    "from-rose-400 to-fuchsia-500",
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a1333] via-[#2a1f4d] to-[#120d26] text-white">

      {/* ── Hero ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-4 inline-block rounded-full border border-white/20 px-4 py-1 text-sm text-white/80">
              D.A.E.X. CLUB · PARK YOONYOUNG TEAM
            </p>
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              Build.
              <span className="block bg-gradient-to-r from-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
                Lead.
              </span>
              Grow.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              연결되고 실행되는 D.A.E.X. Club 박윤영팀.
              우리는 함께 배우고, 함께 만들며,
              아이디어를 실제 결과로 연결합니다.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/80"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-violet-200/80">Core Identity</p>
              <p className="mt-3 text-lg font-semibold leading-8">
                생각하는 팀이 아니라, 결과를 만드는 팀.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Members ──────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-violet-200/70">Team</p>
          <h2 className="mt-2 text-4xl font-bold">Our Team</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {members.map((member, idx) => (
            <div
              key={member.name}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur transition hover:-translate-y-2 hover:bg-white/10"
            >
              <div
                className={"mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br " + gradients[idx % gradients.length]}
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="mt-1 text-sm text-violet-200">Team Member</p>
              <p className="mt-4 text-sm leading-6 text-white/70">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Observer ─────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur max-w-md">
          <p className="text-sm uppercase tracking-[0.2em] text-violet-200/70">Observer</p>
          <h3 className="mt-3 text-2xl font-semibold">{observer.name}</h3>
          <p className="mt-3 text-sm leading-6 text-white/70">{observer.desc}</p>
        </div>
      </section>

      {/* ── Projects ─────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-violet-200/70">Projects</p>
          <h2 className="mt-2 text-4xl font-bold">What We Build</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.title}
              className="rounded-[26px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-xl"
            >
              <h3 className="text-2xl font-semibold">{project.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">{project.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/15 to-transparent p-10">
          <h2 className="text-3xl font-bold md:text-4xl">
            D.A.E.X. Club은 실행으로 증명합니다.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
            아이디어에서 끝나지 않습니다.
            실제 적용, 실제 변화, 실제 결과로 이어집니다.
          </p>
        </div>
      </section>
    </main>
  )
}
