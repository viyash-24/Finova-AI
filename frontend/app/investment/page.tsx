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
            <div 
              className="flex-1 relative chart-grid w-full bg-surface-bright" 
              style={{
                backgroundImage: `linear-gradient(to right, rgba(192, 200, 204, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(192, 200, 204, 0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            >
              <div className="absolute left-4 top-4 bottom-8 flex flex-col justify-between text-label-sm font-label-sm text-outline z-10">
                <span>$150k</span><span>$100k</span><span>$50k</span><span>$0</span>
              </div>
              <div className="absolute inset-0 pl-16 pt-8 pr-4 pb-8 w-full h-full">
                <div 
                  className="absolute bottom-8 left-16 right-4 h-[60%] bg-gradient-to-t from-primary/20 to-transparent rounded-bl-lg" 
                  style={{clipPath: 'polygon(0 100%, 0 60%, 20% 50%, 40% 55%, 60% 30%, 80% 20%, 100% 10%, 100% 100%)'}}
                ></div>
                <svg className="absolute inset-0 w-full h-full pl-16 pt-8 pr-4 pb-8 overflow-visible" preserveAspectRatio="none">
                  <path className="drop-shadow-[0_4px_6px_rgba(0,186,255,0.4)]" d="M 0,180 C 100,160 200,170 300,120 C 400,70 500,90 600,40" fill="none" stroke="#00baff" strokeLinecap="round" strokeWidth="4" vectorEffect="non-scaling-stroke"></path>
                  <circle className="animate-pulse" cx="600" cy="40" fill="#ffffff" r="6" stroke="#00baff" strokeWidth="3" vectorEffect="non-scaling-stroke"></circle>
                </svg>
                <svg className="absolute inset-0 w-full h-full pl-16 pt-8 pr-4 pb-8 overflow-visible" preserveAspectRatio="none">
                  <path d="M 0,180 C 150,175 300,150 450,130 C 550,120 600,110 600,110" fill="none" stroke="#c0c8cc" strokeDasharray="6 6" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                </svg>
              </div>
              <div className="absolute bottom-2 left-16 right-4 flex justify-between text-label-sm font-label-sm text-outline z-10">
                <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
              </div>
            </div>
          </div>

          {/* AI Suggestion Agent */}
          <div className="lg:col-span-1 bg-surface-container rounded-2xl border border-primary-fixed/40 ai-glow overflow-hidden flex flex-col relative h-[420px]">
            <div className="p-md bg-surface-container/60 backdrop-blur-xl border-b border-primary-fixed/20 flex justify-between items-start z-10 relative">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
                  <h3 className="font-label-md text-label-md text-primary tracking-wide uppercase">AI Strategist</h3>
                </div>
                <p className="font-headline-md text-headline-md text-on-background leading-tight">Actionable Insights</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-outline hover:text-primary transition-colors border border-outline-variant/30">
                <span className="material-symbols-outlined text-sm">more_vert</span>
              </button>
            </div>
            
            <div className="p-md flex-1 flex flex-col gap-md overflow-y-auto relative z-10">
              {/* Risk Meter */}
              <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Current Risk Posture</span>
                  <span className="font-label-sm text-label-sm text-primary font-bold">Moderate Growth</span>
                </div>
                <div className="h-2 w-full bg-surface-variant rounded-full flex overflow-hidden">
                  <div className="h-full bg-outline-variant w-1/4"></div>
                  <div className="h-full bg-outline-variant w-1/4 border-l border-surface-container-lowest"></div>
                  <div className="h-full bg-primary w-1/4 border-l border-surface-container-lowest relative">
                    <div className="absolute -top-1 -bottom-1 right-0 w-1 bg-primary-fixed shadow-[0_0_8px_#00baff] rounded-full"></div>
                  </div>
                  <div className="h-full bg-surface-container-high w-1/4 border-l border-surface-container-lowest"></div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-outline uppercase font-semibold">
                  <span>Safe</span><span>Aggr</span>
                </div>
              </div>
              
              {/* Growth Opportunities */}
              <div className="space-y-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Top Recommendations</p>
                <div className="flex gap-3 items-start group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-fixed/40 flex items-center justify-center text-tertiary group-hover:bg-tertiary-fixed transition-colors shrink-0">
                    <span className="material-symbols-outlined text-sm">eco</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Increase Green Energy ETFs</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">Market models suggest a 12% upside in renewable sectors over the next 6 months.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary group-hover:bg-secondary-fixed transition-colors shrink-0">
                    <span className="material-symbols-outlined text-sm">memory</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Hold Semi-conductors</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">Volatility expected. Maintain current position weight (15%) until Q3 reports.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary-fixed-dim/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>
          
          {/* Portfolio Ideas & Learning */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="md:col-span-3 flex justify-between items-end mb-xs">
              <h3 className="font-headline-md text-headline-md text-on-background">Curated For You</h3>
              <a className="text-primary font-label-sm text-label-sm hover:underline" href="#">View All Strategies</a>
            </div>
            
            {/* Portfolio Card 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,186,255,0.04)] hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">rocket_launch</span>
                </div>
                <span className="bg-primary-fixed/50 text-on-primary-fixed-variant text-[11px] font-bold px-2 py-1 rounded uppercase tracking-wide">Aggressive</span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface text-lg mb-1">Emerging Tech Mix</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">High-growth potential focusing on AI, cloud computing, and biotech innovations.</p>
              <div className="mt-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-outline">Est. Yield (1Y)</span>
                  <span className="text-secondary font-semibold">+18.5%</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden flex">
                  <div className="bg-primary w-[40%]" title="AI Sector 40%"></div>
                  <div className="bg-secondary-container w-[35%]" title="Cloud 35%"></div>
                  <div className="bg-tertiary w-[25%]" title="Biotech 25%"></div>
                </div>
              </div>
            </div>
            
            {/* Portfolio Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,186,255,0.04)] hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">shield</span>
                </div>
                <span className="bg-surface-variant text-on-surface-variant text-[11px] font-bold px-2 py-1 rounded uppercase tracking-wide">Conservative</span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface text-lg mb-1">Dividend Aristocrats</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Stable income generation from blue-chip companies with decades of dividend growth.</p>
              <div className="mt-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-outline">Est. Yield (1Y)</span>
                  <span className="text-secondary font-semibold">+5.2%</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden flex">
                  <div className="bg-outline w-[70%]" title="Blue Chips 70%"></div>
                  <div className="bg-outline-variant w-[30%]" title="Bonds 30%"></div>
                </div>
              </div>
            </div>
            
            {/* Learning Card */}
            <div className="bg-primary rounded-xl p-4 shadow-md flex flex-col h-full relative overflow-hidden text-on-primary">
              <div className="absolute -right-4 -top-4 text-white/10 rotate-12 pointer-events-none">
                <span className="material-symbols-outlined text-[120px]">school</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-sm">lightbulb</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-primary/80">Finova Academy</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-lg mb-2">Understanding Yield Curves</h4>
                <p className="font-body-sm text-body-sm text-on-primary/90 line-clamp-3">A yield curve plots interest rates of bonds having equal credit quality but differing maturity dates. It's a key indicator of sentiment.</p>
              </div>
              <button className="mt-auto relative z-10 flex items-center gap-1 w-max bg-white text-primary font-label-md text-label-md px-3 py-1.5 rounded-lg hover:bg-primary-fixed transition-colors">
                Read 2 min summary <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
