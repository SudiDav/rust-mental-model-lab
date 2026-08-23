import type { AppRoute } from '../app/routes';
import type { LessonRecord, WorldRecord } from '../content/types';
import type { ProgressState } from '../learning/progress';
import { TopBar } from './TopBar';
import { WorldMap } from './WorldMap';
import { LessonWorkspace } from './LessonWorkspace';
import { SkipLink } from './SkipLink';

interface Props { route: AppRoute; worlds: WorldRecord[]; lessons: LessonRecord[]; progress: ProgressState; onOpenLesson: (id: string) => void; onBack: () => void; }

export function AppShell({ route, worlds, lessons, progress, onOpenLesson, onBack }: Props) {
  const lesson = route.kind === 'lesson' ? lessons.find((candidate) => candidate.id === route.lessonId) : undefined;
  const nextLesson = lesson ? lessons.slice(lessons.indexOf(lesson) + 1).find((candidate) => candidate.status === 'published') : undefined;
  return <div className="min-h-screen bg-ink text-slate-100"><SkipLink /><TopBar /><main id="main-content">{route.kind === 'lesson' && lesson ? <LessonWorkspace lesson={lesson} nextLesson={nextLesson} onBack={onBack} onLessonComplete={() => { if (nextLesson) onOpenLesson(nextLesson.id); }} /> : <WorldMap worlds={worlds} lessons={lessons} progress={progress} onOpenLesson={onOpenLesson} focusWorldId={route.kind === 'world' ? route.worldId : undefined} />}</main></div>;
}
