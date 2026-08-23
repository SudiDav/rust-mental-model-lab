import { MDXProvider as Provider } from '@mdx-js/react';
import { isValidElement, type ComponentType, type PropsWithChildren, type ReactNode } from 'react';
import { CodeBlock } from '../CodeBlock';
import { Challenge, Concept, MasteryCheck, MentalModel, Predict, Reveal, Simulation, UnderTheHood } from './EducationalComponents';
import { LessonExerciseProvider } from './LessonExerciseContext';
import { LearningLoop } from './LearningLoop';

function getCodeLanguage(children: ReactNode): string {
  if (!isValidElement<{ className?: string }>(children)) return 'rust';
  const match = children.props.className?.match(/(?:^|\s)language-([\w-]+)/);
  return match?.[1] ?? 'rust';
}

interface LessonMDXProviderProps {
  lessonId: string;
  nextLessonTitle?: string;
  onComplete?: () => void;
}

export function LessonMDXProvider({ children, lessonId, nextLessonTitle, onComplete }: PropsWithChildren<LessonMDXProviderProps>) {
  const components = {
    Concept, MentalModel, Simulation, Reveal, UnderTheHood,
    Predict: (props: { question: string; options: string[]; answer: string }) => <Predict lessonId={lessonId} {...props} />,
    Challenge: (props: { id: string }) => <Challenge lessonId={lessonId} {...props} />,
    LearningLoop,
    MasteryCheck: (props: Record<string, unknown>) => <MasteryCheck lessonId={lessonId} nextLessonTitle={nextLessonTitle} onComplete={onComplete} {...props} />,
    pre: (props: Record<string, unknown>) => <CodeBlock language={getCodeLanguage(props.children as ReactNode)}>{props.children as ReactNode}</CodeBlock>,
  } as unknown as Record<string, ComponentType<any>>;
  return <LessonExerciseProvider lessonId={lessonId}><Provider components={components}>{children}</Provider></LessonExerciseProvider>;
}
