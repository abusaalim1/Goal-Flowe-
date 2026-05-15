import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Feather, Sparkles, Target, Trophy } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { downloadEbook } from '../../services/exportService';

const formatDate = (timestamp?: number) => {
  if (!timestamp) return 'No date set';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
};

export const EbookPage: React.FC = () => {
  const { goals, settings } = useStore();

  const ebookStats = useMemo(() => {
    const completedGoals = goals.filter((goal) => goal.status === 'completed').length;
    const activeGoals = goals.filter((goal) => goal.status === 'active').length;
    const averageProgress = goals.length
      ? Math.round(goals.reduce((total, goal) => total + goal.progress, 0) / goals.length)
      : 0;
    const completedTasks = goals.reduce(
      (total, goal) => total + goal.subTasks.filter((task) => task.completed).length,
      0
    );

    return { activeGoals, completedGoals, averageProgress, completedTasks };
  }, [goals]);

  const featuredGoals = useMemo(
    () => [...goals].sort((a, b) => b.createdDate - a.createdDate).slice(0, 3),
    [goals]
  );

  const profileName = settings.profile?.name || 'Achiever';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 pb-20"
    >
      <section className="relative overflow-hidden rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-8 shadow-[0_24px_80px_rgba(120,83,18,0.14)] lg:p-12 dark:from-amber-950/40 dark:via-[var(--color-bg-pure)] dark:to-rose-950/30">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-200/70 to-rose-200/70 blur-3xl" />
        <div className="absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-yellow-100/80 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-amber-700 shadow-sm">
              <Sparkles className="h-4 w-4" /> Keepsake edition
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-[var(--color-text-dark)] md:text-7xl">
                Turn your goals into a beautiful e-book.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--color-text-light)]">
                Export a polished HTML e-book with a premium cover, goal chapters, milestones, notes, and printable pages you can save as PDF.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => downloadEbook(goals, settings)} className="gap-2" size="lg">
                <Download className="h-5 w-5" /> Download e-book
              </Button>
              <Button variant="secondary" size="lg" onClick={() => window.print()} className="gap-2 bg-white/60">
                <BookOpen className="h-5 w-5" /> Print preview
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-0 rotate-6 rounded-[2rem] bg-gradient-to-br from-amber-200 to-rose-200 shadow-2xl" />
            <div className="relative min-h-[520px] rounded-[2rem] border border-amber-200 bg-[var(--color-bg-pure)] p-8 shadow-2xl">
              <div className="mb-16 flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                <span>GoalFlow AI</span>
                <Feather className="h-5 w-5" />
              </div>
              <div className="space-y-5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-text-light)]">Prepared for</p>
                <h2 className="font-display text-5xl font-bold leading-none text-[var(--color-text-dark)]">{profileName}'s Goal Story</h2>
                <p className="text-[var(--color-text-light)]">A curated record of ambition, momentum, and meaningful next steps.</p>
              </div>
              <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-amber-50 p-4">
                  <strong className="block text-2xl text-[var(--color-text-dark)]">{goals.length}</strong>
                  <span className="text-xs font-semibold uppercase text-amber-700">Goals</span>
                </div>
                <div className="rounded-2xl bg-rose-50 p-4">
                  <strong className="block text-2xl text-[var(--color-text-dark)]">{ebookStats.averageProgress}%</strong>
                  <span className="text-xs font-semibold uppercase text-rose-700">Progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Active goals', value: ebookStats.activeGoals, icon: Target },
          { label: 'Completed goals', value: ebookStats.completedGoals, icon: Trophy },
          { label: 'Milestones done', value: ebookStats.completedTasks, icon: Sparkles },
          { label: 'Average progress', value: `${ebookStats.averageProgress}%`, icon: BookOpen },
        ].map((item) => (
          <Card key={item.label} className="flex items-center gap-4">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <strong className="block text-2xl text-[var(--color-text-dark)]">{item.value}</strong>
              <span className="text-sm text-[var(--color-text-light)]">{item.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-[var(--color-border-soft)] bg-gradient-to-r from-amber-50 to-rose-50 p-6">
            <h3 className="font-display text-2xl font-bold text-[var(--color-text-dark)]">E-book chapter preview</h3>
            <p className="mt-2 text-[var(--color-text-light)]">Your newest goals become elegant chapters with context, progress, milestones, and notes.</p>
          </div>
          <div className="divide-y divide-[var(--color-border-soft)]">
            {featuredGoals.length ? (
              featuredGoals.map((goal, index) => (
                <div key={goal.id} className="grid gap-5 p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)] font-display text-xl font-bold text-[var(--color-text-dark)]">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">{goal.category}</span>
                      <span className="text-sm text-[var(--color-text-light)]">Due {formatDate(goal.dueDate)}</span>
                    </div>
                    <h4 className="font-display text-xl font-bold text-[var(--color-text-dark)]">{goal.title}</h4>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-light)]">{goal.description || 'No description yet.'}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <strong className="block text-2xl text-[var(--color-text-dark)]">{goal.progress}%</strong>
                    <span className="text-sm text-[var(--color-text-light)]">complete</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 rounded-full bg-amber-100 p-5 text-amber-700">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h4 className="font-display text-xl font-bold text-[var(--color-text-dark)]">Your e-book is ready for goals</h4>
                <p className="mt-2 max-w-md text-[var(--color-text-light)]">Create a few goals, add milestones and notes, then come back to export a richer keepsake.</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col gap-5 bg-gradient-to-b from-[var(--color-bg-pure)] to-amber-50/80">
          <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 p-4 text-amber-800">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-[var(--color-text-dark)]">What's included?</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-light)]">The download is a standalone HTML e-book that opens in any browser and can be printed or saved as a PDF.</p>
          </div>
          <ul className="space-y-3 text-sm text-[var(--color-text-light)]">
            <li className="flex gap-3"><span className="text-amber-600">✦</span> Editorial cover page with your profile name</li>
            <li className="flex gap-3"><span className="text-amber-600">✦</span> Summary dashboard and table of contents</li>
            <li className="flex gap-3"><span className="text-amber-600">✦</span> One printable chapter for every goal</li>
            <li className="flex gap-3"><span className="text-amber-600">✦</span> Milestone checklist, progress rings, tags, and notes</li>
          </ul>
          <Button onClick={() => downloadEbook(goals, settings)} className="mt-auto gap-2">
            <Download className="h-4 w-4" /> Export beautiful e-book
          </Button>
        </Card>
      </div>
    </motion.div>
  );
};
