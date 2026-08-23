import { MDXProvider as Provider } from '@mdx-js/react';
import type { ComponentType, PropsWithChildren, ReactNode } from 'react';
import { CodeBlock } from '../CodeBlock';
import { Challenge, Concept, MasteryCheck, MentalModel, Predict, Reveal, Simulation, UnderTheHood } from './EducationalComponents';

export function LessonMDXProvider({ children, lessonId }: PropsWithChildren<{ lessonId: string }>) {
  const components = {
    Concept, MentalModel, Simulation, Predict, Reveal, UnderTheHood,
    Challenge, MasteryCheck: (props: Record<string, unknown>) => <MasteryCheck lessonId={lessonId} {...props} />,
    pre: (props: Record<string, unknown>) => <CodeBlock language="rust">{props.children as ReactNode}</CodeBlock>,
  } as unknown as Record<string, ComponentType<any>>;
  return <Provider components={components}>{children}</Provider>;
}
