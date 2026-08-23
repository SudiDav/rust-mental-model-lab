import { useCallback } from 'react';
import type { AppRoute } from '../app/routes';
import type { LessonRecord, WorldRecord } from '../content/types';
import type { ProgressState } from '../learning/progress';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { WorldMap } from './WorldMap';
import { LessonWorkspace } from './LessonWorkspace';
import { SkipLink } from './SkipLink';

interface Props { route: AppRoute; worlds: WorldRecord[]; lessons: LessonRecord[]; progress: ProgressState; onOpenLesson: (id: string) => void; onBack: () => void; }

export function AppShell({ route, worlds, lessons, progress, onOpenLesson, onBack }: Props) {
  const lesson = route.kind === 'lesson' ? lessons.find((candidate) => candidate.id === route.lessonId) : undefined;
  const publishedLessons = lessons.filter((candidate) => candidate.status === 'published');
  const lessonIndex = lesson ? publishedLessons.findIndex((candidate) => candidate.id === lesson.id) : -1;
  const nextLesson = lessonIndex >= 0 ? publishedLessons[lessonIndex + 1] : undefined;
  const previousLesson = lessonIndex > 0 ? publishedLessons[lessonIndex - 1] : undefined;
  const handleLessonComplete = useCallback(() => { if (nextLesson) onOpenLesson(nextLesson.id); }, [nextLesson, onOpenLesson]);
  return <div className="min-h-screen bg-ink text-slate-100"><SkipLink /><TopBar /><main id="main-content">{route.kind === 'lesson' && lesson ? <LessonWorkspace lesson={lesson} nextLesson={nextLesson} previousLesson={previousLesson} lessonIndex={lessonIndex} totalLessons={publishedLessons.length} onOpenLesson={onOpenLesson} onBack={onBack} onLessonComplete={handleLessonComplete} /> : <WorldMap worlds={worlds} lessons={lessons} progress={progress} onOpenLesson={onOpenLesson} focusWorldId={route.kind === 'world' ? route.worldId : undefined} />}</main><Footer /></div>;
}
