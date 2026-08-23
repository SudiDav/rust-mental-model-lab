import { useEffect, useMemo, useState } from 'react';
import { getRoute, routeTo } from './app/routes';
import { getLessons, getWorlds } from './content/loader';
import { LearningProvider, useLearning } from './learning/LearningProvider';
import { AppShell } from './components/AppShell';
import { ThemeProvider } from './theme/ThemeProvider';

function LabApp() {
  const [route, setRoute] = useState(() => getRoute());
  const worlds = useMemo(getWorlds, []);
  const lessons = useMemo(getLessons, []);
  const { progress } = useLearning();
  useEffect(() => { const onHashChange = () => setRoute(getRoute()); window.addEventListener('hashchange', onHashChange); return () => window.removeEventListener('hashchange', onHashChange); }, []);
  const openLesson = (id: string) => { window.location.hash = routeTo('lesson', id); };
  const goHome = () => { window.location.hash = routeTo('home'); };
  return <AppShell route={route} worlds={worlds} lessons={lessons} progress={progress} onOpenLesson={openLesson} onBack={goHome} />;
}

export default function App() { return <ThemeProvider><LearningProvider><LabApp /></LearningProvider></ThemeProvider>; }
