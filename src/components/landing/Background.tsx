export function Background() {
  return (
    <div className="fixed inset-0 z-0 bg-white dark:bg-zinc-950">
      <div 
        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" 
      />
      <div 
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d4d4d8,transparent)] dark:bg-[radial-gradient(circle_800px_at_100%_200px,#27272a,transparent)] opacity-20" 
      />
    </div>
  );
} 