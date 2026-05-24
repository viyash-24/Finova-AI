export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden w-full">
      {/* TopAppBar */}
      <header className="bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/30 flex justify-between items-center w-full px-md py-sm max-w-container-max mx-auto z-40 sticky top-0">
        {/* Mobile Menu Button & Brand */}
        <div className="flex items-center gap-sm md:hidden">
          <button className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline-md-mobile text-headline-md-mobile font-bold text-primary">Finova AI</h1>
        </div>
        
        {/* Search (Left aligned on Desktop) */}
        <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 w-96 border border-outline-variant/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <span className="material-symbols-outlined text-outline mr-2">search</span>
          <input className="bg-transparent border-none focus:ring-0 w-full text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none" placeholder="Search transactions, ask AI..." type="text" />
        </div>
        
        {/* Trailing Actions */}
        <div className="flex items-center gap-sm">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container hidden md:block">
            <span className="material-symbols-outlined">contact_support</span>
          </button>
          <button className="hidden md:flex items-center gap-2 bg-primary text-on-primary hover:bg-secondary transition-all px-4 py-2 rounded-full font-label-md text-label-md ai-glow">
            <span className="material-symbols-outlined filled">robot_2</span>
            Ask AI
          </button>
          <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden border border-outline-variant/50 ml-2">
            <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLo8ESy7BaPQf7h4jP5hZZm40_8OTcOijMEMHNLt3KAyMs_0_ZczpOOiYsUDA0RHm8_roG6PI8cv0Z37itESJLTvRxbyx48LiruDPmjgwmy-eMPq_fCOKAAjB_yZXF4NunPX2vr8juhW6amW6w_rEb5MfoVYw5oQwVmduyszJkm4iQ57vTEb_9tR-bM9VbxVKQOd9Bcmv7G1_unPwQSCzSnVi2d2S3iEOi-i65E6UDhkJfVamTZ4wlph7FWDNgmh0HOt355UUllCLE" />
          </div>
        </div>
      </header>

      {/* Scrollable Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-margin-mobile md:p-lg space-y-lg pb-xl">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {/* Metric 1: Total Income */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex justify-between items-start mb-2">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Total Income</p>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">$12,450.00</h2>
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="font-label-sm text-label-sm">+12% from last month</span>
            </div>
          </div>
          
          {/* Metric 2: Total Expenses */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex justify-between items-start mb-2">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Total Expenses</p>
              <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[18px]">credit_card</span>
              </div>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">$4,230.00</h2>
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              <span className="font-label-sm text-label-sm">-5% from last month</span>
            </div>
          </div>
          
          {/* Metric 3: Total Savings */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex justify-between items-start mb-2">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Total Savings</p>
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">savings</span>
              </div>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">$8,220.00</h2>
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="font-label-sm text-label-sm">+20% from last month</span>
            </div>
          </div>
          
          {/* Metric 4: Health Score */}
          <div className="ai-glass rounded-xl p-md relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[16px]">magic_button</span>
                <p className="font-label-sm text-label-sm text-primary">Financial Health</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
              </div>
            </div>
            <div className="flex items-end gap-2 mb-1 relative z-10">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">84</h2>
              <span className="text-on-surface-variant font-body-md text-body-md mb-2">/100</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full mt-2 overflow-hidden relative z-10">
              <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full w-[84%]"></div>
            </div>
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          {/* Left Column (Wide) */}
          <div className="lg:col-span-2 space-y-md">
            {/* Chart Placeholder */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-md flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-md">
                <h3 className="font-headline-md text-headline-md text-on-surface">Cash Flow Overview</h3>
                <select className="bg-surface-container border-none text-body-sm font-body-sm rounded-md text-on-surface focus:ring-1 focus:ring-primary py-1 px-3 focus:outline-none">
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="flex-1 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#cfd8dc_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                <div className="text-center z-10">
                  <span className="material-symbols-outlined text-outline-variant text-[36px] mb-2">show_chart</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Interactive Chart Canvas</p>
                </div>
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
              <div className="p-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
                <h3 className="font-headline-md text-headline-md text-on-surface">Recent Transactions</h3>
                <button className="text-primary font-label-md text-label-md hover:underline">View All</button>
              </div>
              <div className="divide-y divide-outline-variant/20">
                <div className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">shopping_cart</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">Whole Foods Market</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Groceries • Today, 2:45 PM</p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface">-$142.50</span>
                </div>
                
                <div className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">work</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">Acme Corp Salary</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Income • Yesterday, 9:00 AM</p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-primary">+$4,150.00</span>
                </div>
                
                <div className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">subscriptions</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">Netflix Subscription</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Entertainment • Oct 12</p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface">-$15.99</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Narrow) */}
          <div className="space-y-md">
            {/* AI Insight Panel */}
            <div className="ai-glass rounded-xl p-md relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-2 mb-sm relative z-10">
                <span className="material-symbols-outlined text-primary ai-glow rounded-full">smart_toy</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Finova Insight</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant relative z-10 mb-md leading-relaxed">
                Based on your spending patterns, you are on track to save an extra <strong className="text-primary font-bold">$350</strong> this month. Consider moving this to your High-Yield Investment Goal.
              </p>
              <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-2 rounded-lg hover:bg-secondary transition-colors shadow-md">
                Review Suggestion
              </button>
            </div>
            
            {/* Expense Categories */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-md">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Top Expenses</h3>
              <div className="flex justify-center mb-md">
                <div className="w-32 h-32 rounded-full border-[16px] border-surface-container relative">
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-primary" style={{clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)', transform: 'rotate(45deg)'}}></div>
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-secondary" style={{clipPath: 'polygon(50% 50%, 0 50%, 0 0, 50% 0)', transform: 'rotate(45deg)'}}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Housing</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Food &amp; Dining</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Other</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface">30%</span>
                </div>
              </div>
            </div>
            
            {/* Budget Progress */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-md">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Monthly Budget</h3>
              <div className="mb-4">
                <div className="flex justify-between font-body-sm text-body-sm mb-1">
                  <span className="text-on-surface-variant">Groceries</span>
                  <span className="text-on-surface">$400 / $500</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-[80%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-body-sm text-body-sm mb-1">
                  <span className="text-on-surface-variant">Entertainment</span>
                  <span className="text-on-surface">$120 / $150</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full w-[80%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agents Overview Section */}
        <section className="mt-xl">
          <div className="flex items-center gap-2 mb-md">
            <span className="material-symbols-outlined text-primary text-[24px]">group_work</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">AI Agents Overview</h2>
          </div>
          
          <div className="flex overflow-x-auto gap-md pb-sm snap-x snap-mandatory no-scrollbar">
            {/* Agent 1 */}
            <div className="min-w-[280px] bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-md flex flex-col snap-start shrink-0 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary group-hover:w-2 transition-all"></div>
              <div className="flex justify-between items-start mb-sm pl-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <span className="bg-tertiary-fixed/40 text-tertiary font-label-sm text-label-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span> Active
                </span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-1 pl-2">Expense Analysis</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md flex-1 pl-2">Continuously categorizes and flags unusual spending patterns.</p>
              <button className="mt-auto ml-2 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-4 rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant/20 self-start">
                Manage
              </button>
            </div>
            
            {/* Agent 2 */}
            <div className="min-w-[280px] bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-md flex flex-col snap-start shrink-0 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary group-hover:w-2 transition-all"></div>
              <div className="flex justify-between items-start mb-sm pl-2">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">savings</span>
                </div>
                <span className="bg-tertiary-fixed/40 text-tertiary font-label-sm text-label-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span> Active
                </span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-1 pl-2">Savings Planner</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md flex-1 pl-2">Optimizes automated transfers to meet your vacation goal.</p>
              <button className="mt-auto ml-2 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-4 rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant/20 self-start">
                Manage
              </button>
            </div>
            
            {/* Agent 3 */}
            <div className="min-w-[280px] bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-md flex flex-col snap-start shrink-0 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-tertiary group-hover:w-2 transition-all"></div>
              <div className="flex justify-between items-start mb-sm pl-2">
                <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <span className="bg-tertiary-fixed/40 text-tertiary font-label-sm text-label-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span> Active
                </span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-1 pl-2">Investment Suggester</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md flex-1 pl-2">Monitors market trends against your risk profile.</p>
              <button className="mt-auto ml-2 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-4 rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant/20 self-start">
                Manage
              </button>
            </div>
            
            {/* Agent 4 */}
            <div className="min-w-[280px] bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-md flex flex-col snap-start shrink-0 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-error group-hover:w-2 transition-all"></div>
              <div className="flex justify-between items-start mb-sm pl-2">
                <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <span className="bg-outline-variant/40 text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-outline"></span> Paused
                </span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-1 pl-2">Bill Reminder</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md flex-1 pl-2">Predicts upcoming utility costs and schedules alerts.</p>
              <button className="mt-auto ml-2 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-4 rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant/20 self-start">
                Manage
              </button>
            </div>
            
            {/* Agent 5 */}
            <div className="min-w-[280px] bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-md flex flex-col snap-start shrink-0 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-container group-hover:w-2 transition-all"></div>
              <div className="flex justify-between items-start mb-sm pl-2">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">auto_graph</span>
                </div>
                <span className="bg-tertiary-fixed/40 text-tertiary font-label-sm text-label-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span> Active
                </span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-1 pl-2">Income Growth</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md flex-1 pl-2">Analyzes gig-economy trends for secondary income opportunities.</p>
              <button className="mt-auto ml-2 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-4 rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant/20 self-start">
                Manage
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}