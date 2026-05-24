export default function InvestmentPage() {
  return (
    <div className="flex-1 flex flex-col relative bg-surface-bright min-h-screen overflow-y-auto">
      {/* TopAppBar */}
      <header className="flex justify-between items-center w-full px-md py-sm max-w-container-max mx-auto z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm sticky top-0">
        {/* Mobile Brand & Menu Toggle */}
        <div className="flex items-center gap-sm md:hidden">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="font-headline-md text-headline-md font-bold text-primary">Finova AI</div>
        </div>
        
        {/* Left/Center: Search */}
        <div className="hidden md:flex items-center w-96 relative">
          <span className="material-symbols-outlined absolute left-3 text-outline">search</span>
          <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full py-1.5 pl-10 pr-4 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline/70" placeholder="Search investments, symbols..." type="text"/>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-sm">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">contact_support</span>
          </button>
          
          <div className="w-px h-6 bg-outline-variant/40 mx-2 hidden sm:block"></div>
          
          {/* Primary Action */}
          <button className="hidden sm:flex items-center gap-1 bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md px-4 py-2 rounded-full transition-all duration-200 border border-outline-variant/30 hover:border-primary shadow-sm">
            <span className="material-symbols-outlined text-sm">smart_toy</span> Ask AI
          </button>
          
          {/* Profile */}
          <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-surface-container-high hover:border-primary transition-colors ml-2">
            <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx7d-8kGHAMHeuX5Nj6SESCRrNFqJaHAgFnt4wIF4edyfJRzaeylFGQ8pWmZ5og0Zgw7ZS3BBD2do1K2E71l5m2WTZktMSGTBbJxy-JCztaRk4jwqaT0FJ1NwBNiHuFqBZnRARUJ54lPS9WDw4eZhfrrNOhevXQ4wLQLLJ3CtQ8q5Q-Z308C3iDBbYdLVJlcgb7lXab0FoW2B_nEAm5jl-k9kWffOWJXBkwR3PfH_ZHQb_a1ZlRmgcbB9IWUeVqaoruliqI8DIxODw"/>
          </button>
        </div>
      </header>
      
      {/* Dashboard Content Canvas */}
      <div className="p-4 md:p-md lg:p-lg max-w-container-max mx-auto w-full space-y-md">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background">AI Investment Hub</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Your portfolio is performing <strong className="text-secondary font-medium">+14.2%</strong> above market average this quarter.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-3 py-1.5 rounded-md hover:bg-outline-variant/30 transition-colors flex items-center gap-1 border border-outline-variant/50">
              <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
            </button>
            <button className="bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-3 py-1.5 rounded-md hover:bg-outline-variant/30 transition-colors flex items-center gap-1 border border-outline-variant/50">
              <span className="material-symbols-outlined text-[16px]">download</span> Report
            </button>
          </div>
        </div>
        
        {/* Market Trend Tickers */}
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 gap-sm no-scrollbar">
          {/* Ticker 1 */}
          <div className="min-w-[180px] bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 shadow-[0_2px_10px_rgba(0,186,255,0.05)] flex flex-col gap-1">
            <div className="flex justify-between items-center w-full">
              <span className="font-label-md text-label-md text-on-surface">S&amp;P 500</span>
              <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-body-lg text-body-lg text-on-background font-medium">5,142.30</span>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/30 px-1.5 py-0.5 rounded">+1.2%</span>
            </div>
          </div>
          
          {/* Ticker 2 */}
          <div className="min-w-[180px] bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 shadow-[0_2px_10px_rgba(0,186,255,0.05)] flex flex-col gap-1">
            <div className="flex justify-between items-center w-full">
              <span className="font-label-md text-label-md text-on-surface">NASDAQ</span>
              <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-body-lg text-body-lg text-on-background font-medium">16,211.84</span>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/30 px-1.5 py-0.5 rounded">+1.8%</span>
            </div>
          </div>
          
          {/* Ticker 3 */}
          <div className="min-w-[180px] bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 shadow-[0_2px_10px_rgba(0,186,255,0.05)] flex flex-col gap-1">
            <div className="flex justify-between items-center w-full">
              <span className="font-label-md text-label-md text-on-surface">Finova Tech Idx</span>
              <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-body-lg text-body-lg text-primary font-medium">4,890.10</span>
              <span className="font-label-sm text-label-sm text-primary bg-primary-fixed/50 px-1.5 py-0.5 rounded">+3.4%</span>
            </div>
          </div>
          
          {/* Ticker 4 */}
          <div className="min-w-[180px] bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 shadow-[0_2px_10px_rgba(0,186,255,0.05)] flex flex-col gap-1 opacity-80">
            <div className="flex justify-between items-center w-full">
              <span className="font-label-md text-label-md text-on-surface">DOW JONES</span>
              <span className="material-symbols-outlined text-error text-[18px]">trending_down</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-body-lg text-body-lg text-on-background font-medium">38,714.77</span>
              <span className="font-label-sm text-label-sm text-error bg-error-container/50 px-1.5 py-0.5 rounded">-0.4%</span>
            </div>
          </div>
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          {/* Growth Chart */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden flex flex-col relative h-[420px]">
            <div className="p-md flex justify-between items-center border-b border-outline-variant/10 relative z-10 glass-panel">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-background">Portfolio Projection</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">AI-optimized growth vs Standard Index</p>
              </div>
              <div className="flex bg-surface-container-high rounded-lg p-1">
                <button className="px-3 py-1 text-label-sm font-label-sm rounded-md text-on-surface-variant hover:text-on-surface transition-colors">1M</button>
                <button className="px-3 py-1 text-label-sm font-label-sm rounded-md text-on-surface-variant hover:text-on-surface transition-colors">6M</button>
                <button className="px-3 py-1 text-label-sm font-label-sm rounded-md bg-surface-container-lowest text-primary shadow-sm transition-colors">1Y</button>
                <button className="px-3 py-1 text-label-sm font-label-sm rounded-md text-on-surface-variant hover:text-on-surface transition-colors">5Y</button>
              </div>
            </div>
            