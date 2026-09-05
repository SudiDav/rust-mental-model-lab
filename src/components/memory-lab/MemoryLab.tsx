import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLearning } from '../../learning/LearningProvider';
import { getMemorySnapshot, MEMORY_CHECKPOINTS, MEMORY_PROGRAM, MEMORY_STEPS, MEMORY_TOUR_EXERCISE, memoryStepLimit, type MemoryEntityId, type MemorySnapshot } from '../../simulations/memory-lab';
import { Celebration } from '../Celebration';
import { useLessonExercise } from '../mdx/LessonExerciseContext';
import type { MemorySceneController } from './memory-scene';
import './memory-lab.css';

function initialView(): '2d' | '3d' {
  return window.matchMedia?.('(max-width: 640px), (prefers-reduced-motion: reduce)').matches ? '2d' : '3d';
}

function SceneViewport({ snapshot, selectedId, onSelect, onUnavailable }: {
  snapshot: MemorySnapshot; selectedId: MemoryEntityId | null;
  onSelect: (id: MemoryEntityId) => void; onUnavailable: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const controller = useRef<MemorySceneController | null>(null);
  const latest = useRef({ snapshot, selectedId });
  latest.current = { snapshot, selectedId };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void import('./memory-scene').then(({ createMemoryScene }) => {
      if (cancelled || !container.current) return;
      controller.current = createMemoryScene(container.current, onSelect, onUnavailable);
      controller.current.update(latest.current.snapshot, latest.current.selectedId);
      setLoading(false);
    }).catch(() => { if (!cancelled) onUnavailable(); });
    return () => { cancelled = true; controller.current?.dispose(); controller.current = null; };
  }, [onSelect, onUnavailable]);

  useEffect(() => { controller.current?.update(snapshot, selectedId); }, [snapshot, selectedId]);

  return <div className="memory-lab__viewport">
    <div ref={container} className="memory-lab__canvas" />
    {loading && <p className="memory-lab__loading" role="status">Preparing your memory scene…</p>}
    <button className="memory-lab__reset-view" onClick={() => controller.current?.resetCamera()}>Reset view</button>
    <p className="memory-lab__orbit-hint">Drag to rotate · scroll to zoom · click a box to inspect</p>
  </div>;
}

function FlatMemory({ snapshot, selectedId, onSelect }: {
  snapshot: MemorySnapshot; selectedId: MemoryEntityId | null; onSelect: (id: MemoryEntityId) => void;
}) {
  return <div className="memory-lab__flat" aria-label="2D memory diagram">
    <div className="memory-lab__flat-region">
      <h3>Stack <span>Function frames</span></h3>
      {[...snapshot.entities].filter((entity) => entity.kind === 'frame').reverse().map((frame) => <div key={frame.id} className="memory-lab__flat-frame">
        <button aria-pressed={selectedId === frame.id} onClick={() => onSelect(frame.id)}>{frame.label}</button>
        <div className="memory-lab__flat-values">{snapshot.entities.filter((entity) => entity.region === 'stack' && entity.kind !== 'frame' && (frame.id === 'show' ? entity.position[1] > 2 : entity.position[1] < 2)).map((entity) => <button key={entity.id} className={`memory-lab__block memory-lab__block--${entity.kind}`} aria-pressed={selectedId === entity.id} onClick={() => onSelect(entity.id)}><strong>{entity.label}</strong><span>{entity.value}</span>{entity.id === 'string' && <small>pointer → 0xA120</small>}</button>)}</div>
      </div>)}
      {snapshot.step === 0 && <p>The main frame is ready for local values.</p>}
      {snapshot.step === 7 && <p>No active frames.</p>}
    </div>
    <div className="memory-lab__flat-region memory-lab__flat-region--heap">
      <h3>Heap <span>Dynamic allocations</span></h3>
      {snapshot.owner ? <>
        <p className="memory-lab__flat-pointer">{snapshot.owner} points here ↓</p>
        <button className="memory-lab__allocation" aria-label="Inspect String bytes" aria-pressed={selectedId === 'heap'} onClick={() => onSelect('heap')}>
          <span className="memory-lab__bytes">{['S', 'u', 'd', 'i'].map((byte) => <span key={byte}>{byte}</span>)}</span>
          <span>0xA120 · 4 bytes</span>
        </button>
      </> : <p>{snapshot.step >= 5 ? 'Allocation released. No live String bytes.' : 'No allocation yet. Create a String to put its bytes here.'}</p>}
    </div>
  </div>;
}

export function MemoryLab({ lessonId }: { lessonId: string }) {
  const { completeExercise } = useLearning();
  const movePassed = useLessonExercise(MEMORY_CHECKPOINTS[0].id);
  const dropPassed = useLessonExercise(MEMORY_CHECKPOINTS[1].id);
  const tourPassed = useLessonExercise(MEMORY_TOUR_EXERCISE);
  const completedIds = [movePassed ? MEMORY_CHECKPOINTS[0].id : '', dropPassed ? MEMORY_CHECKPOINTS[1].id : '', tourPassed ? MEMORY_TOUR_EXERCISE : ''];
  const onPass = useCallback((id: string) => completeExercise(lessonId, id), [completeExercise, lessonId]);
  return <MemoryLabExperience completedIds={completedIds} onPass={onPass} completionMessage="Both predictions passed. Your progress is saved; add your reflection below to finish the lesson." />;
}

/** The preview uses the real lab with in-memory results, never course progress. */
export function MemoryLabPreview() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const onPass = useCallback((id: string) => setCompletedIds((previous) => previous.includes(id) ? previous : [...previous, id]), []);
  return <MemoryLabExperience completedIds={completedIds} onPass={onPass} completionMessage="Both predictions passed. This preview does not change your course progress. Rewind to explore again." />;
}

function MemoryLabExperience({ completedIds, onPass, completionMessage }: { completedIds: string[]; onPass: (id: string) => void; completionMessage: string }) {
  const movePassed = completedIds.includes(MEMORY_CHECKPOINTS[0].id);
  const dropPassed = completedIds.includes(MEMORY_CHECKPOINTS[1].id);
  const tourPassed = completedIds.includes(MEMORY_TOUR_EXERCISE);
  const stepLimit = memoryStepLimit(completedIds);
  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState<MemoryEntityId | null>(null);
  const [view, setView] = useState(initialView);
  const [unavailable, setUnavailable] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, string>>({});
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const sliderId = useId();
  const titleId = useId();
  const snapshot = useMemo(() => getMemorySnapshot(step), [step]);
  const current = MEMORY_STEPS[step];
  const selected = snapshot.entities.find((entity) => entity.id === selectedId);
  const checkpoint = MEMORY_CHECKPOINTS.find((item) => item.beforeStep === step);
  const checkpointPassed = checkpoint ? completedIds.includes(checkpoint.id) : false;
  const answer = checkpoint?.options.find((option) => option.id === attempts[checkpoint.id]);
  const onUnavailable = useCallback(() => { setUnavailable(true); setView('2d'); }, []);

  useEffect(() => {
    if (step === MEMORY_STEPS.length - 1 && !tourPassed) onPass(MEMORY_TOUR_EXERCISE);
  }, [step, tourPassed, onPass]);

  const navigate = (next: number) => {
    setStep(Math.max(0, Math.min(next, stepLimit)));
    setSelectedId(null);
    setCelebrating(null);
  };

  return <section className="memory-lab" aria-labelledby={titleId}>
    <header className="memory-lab__header">
      <div><h2 id={titleId}>A String’s journey</h2><p>One program. Two memory regions. You control what happens next.</p></div>
      <div role="group" aria-label="Memory view" className="memory-lab__view-switch">
        <button aria-pressed={view === '3d'} disabled={unavailable} onClick={() => setView('3d')}>3D view</button>
        <button aria-pressed={view === '2d'} onClick={() => setView('2d')}>2D view</button>
      </div>
    </header>

    <div className="memory-lab__body">
      <div className="memory-lab__scene-column">
        <div className="memory-lab__legend"><span><i className="memory-lab__dot--stack" />Stack frames & values</span><span><i className="memory-lab__dot--heap" />Heap bytes</span><span><i className="memory-lab__dot--pointer" />Owning pointer</span></div>
        {unavailable && <p className="memory-lab__fallback" role="status">3D is unavailable in this browser. The 2D view has the same steps and challenges.</p>}
        {view === '3d' ? <SceneViewport snapshot={snapshot} selectedId={selectedId} onSelect={setSelectedId} onUnavailable={onUnavailable} /> : <FlatMemory snapshot={snapshot} selectedId={selectedId} onSelect={setSelectedId} />}
        <div className="memory-lab__inspector">
          <div className="memory-lab__inspect-buttons" role="group" aria-label="Inspect memory objects">
            <span>Inspect</span>{snapshot.entities.map((entity) => <button key={entity.id} aria-pressed={selectedId === entity.id} onClick={() => setSelectedId(entity.id)}>{entity.label}</button>)}
          </div>
          <p aria-live="polite">{selected ? <><strong>{selected.label}: </strong>{selected.explanation}</> : snapshot.step === 7 ? 'The frames and the allocation have been released. Rewind to inspect an earlier state.' : 'Choose a box in the scene or a label above. Follow the pointer to connect an owner to its bytes.'}</p>
        </div>
      </div>
      <div className="memory-lab__code-column">
        <div className="memory-lab__code-heading"><span>Rust</span><span>Highlighted line has just run</span></div>
        <pre className="memory-lab__code" aria-label="Rust program"><code>{MEMORY_PROGRAM.map((line, index) => <span key={index} className={current.line === index + 1 ? 'memory-lab__code-line is-current' : 'memory-lab__code-line'} aria-current={current.line === index + 1 ? 'step' : undefined}><span aria-hidden="true" className="memory-lab__line-number">{index + 1}</span>{line || ' '}</span>)}</code></pre>
        <div className="memory-lab__output"><h3>Program output</h3><pre aria-live="polite">{snapshot.output.length ? snapshot.output.join('\n') : 'Nothing printed yet.'}</pre></div>
        <div className="memory-lab__owner"><span>Current String owner</span><strong>{snapshot.owner ?? (step >= 5 ? 'None — dropped' : 'None yet')}</strong><span>{snapshot.allocationAddress ? `One allocation at ${snapshot.allocationAddress}` : 'No live String allocation'}</span></div>
      </div>
    </div>

    <div className="memory-lab__timeline">
      <div className="memory-lab__step-heading"><label htmlFor={sliderId}>Step {step + 1} of {MEMORY_STEPS.length} · {current.title}</label><span>{Number(movePassed) + Number(dropPassed)} / 2 predictions passed</span></div>
      <input id={sliderId} aria-label="Execution timeline" type="range" min={0} max={MEMORY_STEPS.length - 1} value={step} aria-valuetext={`Step ${step + 1}: ${current.title}`} onChange={(event) => navigate(Number(event.target.value))} />
      <div className="memory-lab__milestones" aria-hidden="true"><span>Enter</span><span>Allocate</span><span>Move & read</span><span>Drop</span><span>Finish</span></div>
      <p className="memory-lab__explanation" aria-live="polite">{current.explanation}</p>
      <div className="memory-lab__controls"><button onClick={() => navigate(step - 1)} disabled={step === 0}>← Back</button><button onClick={() => navigate(0)} disabled={step === 0}>Restart</button><button className="memory-lab__next" onClick={() => navigate(step + 1)} disabled={step >= stepLimit || step === MEMORY_STEPS.length - 1}>{step === MEMORY_STEPS.length - 1 ? 'Journey complete ✓' : `${current.action} →`}</button></div>
      {stepLimit < MEMORY_STEPS.length - 1 && <p className="memory-lab__checkpoint-hint">The timeline pauses at each prediction. Pass it to reveal what happens next.</p>}
    </div>

    {checkpoint && <section className={`memory-lab__prediction ${checkpointPassed ? 'is-passed' : ''}`} aria-label={checkpoint.title}>
      <div><h3>{checkpointPassed ? 'Prediction passed ✓' : checkpoint.title}</h3><p>{checkpoint.question}</p></div>
      <div className="memory-lab__answers">{checkpoint.options.map((option) => <button key={option.id} disabled={checkpointPassed} aria-pressed={checkpointPassed ? option.id === checkpoint.answer : attempts[checkpoint.id] === option.id} onClick={() => {
        setAttempts((previous) => ({ ...previous, [checkpoint.id]: option.id }));
        if (option.id === checkpoint.answer) { onPass(checkpoint.id); setCelebrating(checkpoint.id); }
      }}>{option.text}</button>)}</div>
      <p className="memory-lab__feedback" role="status">{answer?.feedback ?? (checkpointPassed ? 'You already passed this prediction. Step forward to replay the result.' : 'Make a prediction. You can try again if you need to.')}</p>
      {celebrating === checkpoint.id && <Celebration key={checkpoint.id} onFinished={() => setCelebrating(null)} />}
    </section>}

    {step === MEMORY_STEPS.length - 1 && <div className="memory-lab__finished" role="status"><span aria-hidden="true">🎉</span><div><strong>You followed the whole journey.</strong><p>{completionMessage}</p></div></div>}
    <p className="memory-lab__model-note">A conceptual view of this Rust program. Addresses and box sizes are illustrative; compilers may keep values in registers or optimize them away. Released memory is not necessarily erased.</p>
  </section>;
}
