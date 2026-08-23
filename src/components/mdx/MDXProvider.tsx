import { MDXProvider as Provider } from '@mdx-js/react';
import { isValidElement, type ComponentType, type PropsWithChildren, type ReactNode } from 'react';
import { CodeBlock } from '../CodeBlock';
import { Challenge, Concept, MasteryCheck, MentalModel, Predict, Reveal, Simulation, UnderTheHood } from './EducationalComponents';
import { LearningLoop } from './LearningLoop';

function getCodeLanguage(children: ReactNode): string {
  if (!isValidElement<{ className?: string }>(children)) return 'rust';
  const match = children.props.className?.match(/(?:^|\s)language-([\w-]+)/);
  return match?.[1] ?? 'rust';
}

export function LessonMDXProvider({ children, lessonId }: PropsWithChildren<{ lessonId: string }>) {
  const components = {
    Concept, MentalModel, Simulation, Predict, Reveal, UnderTheHood,
    Challenge, LearningLoop, MasteryCheck: (props: Record<string, unknown>) => <MasteryCheck lessonId={lessonId} {...props} />,
    pre: (props: Record<string, unknown>) => <CodeBlock language={getCodeLanguage(props.children as ReactNode)}>{props.children as ReactNode}</CodeBlock>,
  } as unknown as Record<string, ComponentType<any>>;
  return <Provider components={components}>{children}</Provider>;
}
