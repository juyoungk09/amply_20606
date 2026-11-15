import { formatTime } from '../../lib/audio'
import type { Take } from './types'

type TakeListProps = {
  takes: Take[]
  selectedId: string | null
  compareIds: string[]
  onSelect: (id: string) => void
  onToggleCompare: (id: string) => void
}

export default function TakeList({ takes, selectedId, compareIds, onSelect, onToggleCompare }: TakeListProps) {
  return (
    <section className="panel flex flex-col lg:self-start">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="font-bold">테이크</h2>
        <span className="font-dot text-sm font-black text-dim">{String(takes.length).padStart(2, '0')}</span>
      </div>

      <ul className="flex flex-col gap-1 p-2">
        {takes.map((take) => {
          const selected = take.id === selectedId
          const compareIndex = compareIds.indexOf(take.id)
          return (
            <li key={take.id} className={`flex items-center rounded-2xl ${selected ? 'bg-stage' : ''}`}>
              <button
                type="button"
                onClick={() => onSelect(take.id)}
                aria-current={selected}
                className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3 text-left"
              >
                <span className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${selected ? 'bg-neon-pink' : 'bg-line'}`} />
                  <span className={`font-bold ${selected ? 'text-ink' : 'text-dim'}`}>{take.name}</span>
                </span>
                <span className="flex gap-3 pl-4 font-dot text-xs font-black text-dim">
                  <span>{take.analysis ? formatTime(take.analysis.duration, false) : '--:--'}</span>
                  <span>{take.analysis?.bpm ? `${take.analysis.bpm} BPM` : ''}</span>
                  <span>{take.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </button>

              {/* 비교 대상 선택 (최대 2개, A/B) */}
              <button
                type="button"
                onClick={() => onToggleCompare(take.id)}
                aria-pressed={compareIndex >= 0}
                aria-label={`${take.name} 비교에 ${compareIndex >= 0 ? '빼기' : '넣기'}`}
                className={`mr-3 flex size-9 shrink-0 items-center justify-center rounded-full border font-dot text-sm font-black ${
                  compareIndex === 0
                    ? 'border-neon-pink bg-neon-pink text-stage'
                    : compareIndex === 1
                      ? 'border-neon-blue bg-neon-blue text-stage'
                      : 'border-line text-dim hover:text-ink'
                }`}
              >
                {compareIndex === 0 ? 'A' : compareIndex === 1 ? 'B' : '+'}
              </button>
            </li>
          )
        })}
      </ul>

      <p className="mt-auto border-t border-line px-5 py-3 text-xs text-dim">
        오른쪽 <span className="font-bold text-ink">+</span> 버튼으로 두 테이크를 골라 비교할 수 있어요.
      </p>
    </section>
  )
}
