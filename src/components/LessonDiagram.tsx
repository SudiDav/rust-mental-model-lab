import { useId, useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { MEMORY_STEPS } from '../simulations/memory-lab';
import './lesson-diagram.css';

const DIAGRAMS = {
  'life-of-a-string': {
    title: 'The life of a String',
    introduction: 'Step back from the memory boxes and follow the whole story: create a String, move its ownership, read its bytes, then clean up.',
    chapters: [
      { id: 'whole-story', label: 'Follow the String' },
      { id: 'ownership-handoff', label: 'Understand the move' },
      { id: 'scope-cleanup', label: 'Watch the cleanup' },
    ],
    steps: [2, 3, 4, 5],
  },
} as const;

export function LessonDiagram({ diagram }: { diagram: keyof typeof DIAGRAMS }) {
  const content = DIAGRAMS[diagram];
  const { resolvedTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [chapter, setChapter] = useState('whole-story');
  const [chapterVisit, setChapterVisit] = useState(0);
  const headingId = useId();
  if (!content) return null;
  const baseUrl = `${import.meta.env.BASE_URL}diagrams/${diagram}.html`;
  const url = `${baseUrl}?theme=${resolvedTheme}#view=${chapter}`;
  return <section className="lesson-diagram" id={diagram} aria-labelledby={headingId}>
    <header className="lesson-diagram__header"><div><p>See the whole story</p><h2 id={headingId}>{content.title}</h2></div><a href={url} target="_blank" rel="noopener noreferrer">Open full diagram ↗</a></header>
    <p className="lesson-diagram__introduction">{content.introduction}</p>
    <ol className="lesson-diagram__summary" aria-label="String lifecycle summary">{content.steps.map((step, index) => <li key={step}><span aria-hidden="true">{index + 1}</span><div><h3>{MEMORY_STEPS[step].title}</h3><p>{MEMORY_STEPS[step].explanation}</p></div></li>)}</ol>
    <details className="lesson-diagram__explorer" onToggle={(event) => setExpanded(event.currentTarget.open)}>
      <summary>Explore the interactive diagram</summary>
      {expanded && <>
        <p className="lesson-diagram__instructions">Choose a chapter, then use “Play story” inside the diagram. Click a node to inspect its connections, or use Export in the full diagram to save a copy.</p>
        <div className="lesson-diagram__chapters" role="group" aria-label="Diagram chapters">{content.chapters.map((item) => <button key={item.id} onClick={() => { setChapter(item.id); setChapterVisit((visit) => visit + 1); }}>{item.label}</button>)}</div>
        <iframe key={`${diagram}-${resolvedTheme}-${chapterVisit}`} title={`${content.title} interactive lifecycle diagram`} src={url} sandbox="allow-scripts allow-downloads" loading="lazy" referrerPolicy="no-referrer" />
      </>}
    </details>
    <footer className="lesson-diagram__footer"><span>The diagram explains the lab’s example. Your prediction challenges and progress stay in the lesson.</span><span>Diagram made with <a href="https://github.com/tt-a1i/archify" target="_blank" rel="noopener noreferrer">Archify</a> · <a href={`${import.meta.env.BASE_URL}diagrams/ARCHIFY-LICENSE.txt`} target="_blank" rel="noopener noreferrer">MIT license</a></span></footer>
  </section>;
}
