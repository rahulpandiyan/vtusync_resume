export function Background() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-white dark:bg-[#07090e]">
      {/* Subtle modern ambient light orbs */}
      <div 
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] opacity-40 dark:opacity-20 blur-[130px] rounded-full bg-gradient-to-tr from-indigo-500/20 via-blue-400/15 to-sky-400/15 pointer-events-none" 
      />
      <div 
        className="absolute top-[800px] -right-40 w-[600px] h-[600px] opacity-25 dark:opacity-15 blur-[140px] rounded-full bg-gradient-to-br from-blue-500/15 to-sky-400/10 pointer-events-none" 
      />
    </div>
  );
}
