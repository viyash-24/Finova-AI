'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatPage() {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      if (inputText === '') {
        textareaRef.current.style.height = '44px';
      }
    }
  }, [inputText]);

  return (
    <main className="flex h-screen bg-surface w-full overflow-hidden">
      {/* Center Chat Area */}
      <section className="flex-1 flex flex-col h-full relative border-r border-outline-variant/30">
        {/* Chat Header */}
        <header className="h-16 flex items-center justify-between px-lg border-b border-outline-variant/20 bg-surface/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary">psychology</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Finova Assistant</h2>
          </div>
          <div className="flex items-center gap-sm">
            <button className="p-xs rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">history</span>
            </button>
            <button className="p-xs rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </header>

        {/* Chat Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto chat-scroll p-lg flex flex-col gap-md pb-32">
          {/* Date Divider */}
          <div className="flex justify-center my-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-sm py-1 rounded-full">Today</span>
          </div>

          {/* AI Message */}
          <div className="flex gap-sm max-w-[85%] self-start group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 flex-shrink-0 mt-1">
              <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
            </div>
            <div className="bg-primary/5 backdrop-blur-[12px] border border-primary/20 shadow-sm rounded-2xl rounded-tl-sm p-md text-on-surface relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none"></div>
              <p className="font-body-md text-body-md relative z-10">
                Hello! I've analyzed your recent transactions. I noticed a <strong>15% increase</strong> in your dining expenses this month compared to your usual average.
              </p>
              <p className="font-body-md text-body-md relative z-10 mt-xs">
                Would you like me to break down these expenses or help adjust your budget?
              </p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex gap-sm max-w-[85%] self-end flex-row-reverse group">
            <img 
              alt="User profile" 
              className="w-8 h-8 rounded-full border border-outline-variant/30 flex-shrink-0 mt-1" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4d2lfeBRPPvof1viVst4Zm-QbeX9gk36rbjq8t_BpjQhvqM7236pVCa0ddhRrNGEs1ZdxuGjJlWouBjsTxOFJb-wPPTm90jzN_uWjyKtkj2gOANYp3T7ahD-mPy6tR_p2d9S8F2uy_Wl6STnNGxxUcTaSQ_t5Pbolkus4EOK69YNyhQjYoJpVFZqNpsFELfZqU10Y2Djph_UQGYZBrCDxKBeEjTdJtVM7Daks70-5T2ZGgpXjMdfBdowYL_cjEtIRCKU3mPLhxDrC" 
            />
            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl rounded-tr-sm p-md text-on-surface shadow-sm">
              <p className="font-body-md text-body-md">
                Analyze my spending for the last two weeks, please. Focus on the 'Food &amp; Drink' category.
              </p>
            </div>
          </div>

          {/* AI Message with Data Viz */}
          <div className="flex gap-sm max-w-[90%] self-start group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 flex-shrink-0 mt-1">
              <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
            </div>
            <div className="bg-primary/5 backdrop-blur-[12px] border border-primary/20 shadow-sm rounded-2xl rounded-tl-sm p-md text-on-surface relative overflow-hidden w-full">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none"></div>
              <div className="relative z-10 space-y-sm">
                <p className="font-body-md text-body-md">
                  Here is the breakdown of your <strong>Food &amp; Drink</strong> spending over the last 14 days. Total spent: <strong>$432.50</strong>.
                </p>
                {/* Embedded Mini-Card */}
                <div className="bg-surface/90 rounded-xl border border-outline-variant/40 p-sm flex flex-col gap-xs">
                  <div className="flex justify-between items-center pb-xs border-b border-outline-variant/30">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Top Merchants</span>
                    <span className="material-symbols-outlined text-[16px] text-primary">restaurant</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-body-sm text-body-sm">Whole Foods Market</span>
                    <span className="font-label-md text-label-md">$184.20</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-body-sm text-body-sm">Sweetgreen</span>
                    <span className="font-label-md text-label-md">$68.50</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-body-sm text-body-sm">Local Coffee Co.</span>
                    <span className="font-label-md text-label-md">$45.00</span>
                  </div>
                </div>
                <p className="font-body-md text-body-md mt-xs">
                  It looks like grocery shopping accounts for the majority, but frequent smaller cafe purchases are adding up quickly.
                </p>
              </div>
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="flex gap-sm self-start items-center mt-sm opacity-60">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary text-[14px]">smart_toy</span>
            </div>
            <div className="flex gap-1 bg-surface-container-low px-3 py-2 rounded-2xl rounded-tl-sm border border-outline-variant/30">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-surface via-surface to-transparent pt-xl pb-lg px-lg">
          {/* Suggestion Chips */}
          <div className="flex gap-sm overflow-x-auto pb-sm no-scrollbar whitespace-nowrap mb-xs">
            <button className="bg-surface border border-outline-variant hover:border-primary hover:bg-primary-fixed/30 transition-colors rounded-full px-md py-xs font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">monitoring</span> Analyze my spending
            </button>
            <button className="bg-surface border border-outline-variant hover:border-primary hover:bg-primary-fixed/30 transition-colors rounded-full px-md py-xs font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">savings</span> How can I save more?
            </button>
            <button className="bg-surface border border-outline-variant hover:border-primary hover:bg-primary-fixed/30 transition-colors rounded-full px-md py-xs font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">trending_up</span> Give investment advice
            </button>
          </div>
          
          {/* Input Box Container */}
          <div className="bg-surface-container-lowest border border-outline-variant shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all rounded-2xl p-xs flex items-end gap-sm relative z-20">
            <button className="p-sm text-on-surface-variant hover:text-primary transition-colors rounded-xl hover:bg-surface-container-low flex-shrink-0">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <textarea 
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 resize-none py-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 max-h-32 focus:outline-none" 
              placeholder="Ask Finova anything about your finances..." 
              rows={1} 
              style={{ minHeight: '44px' }}
            />
            {/* Voice / Send Actions */}
            <div className="flex items-center gap-xs flex-shrink-0 mb-1 mr-1">
              <button className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors group">
                <span className="material-symbols-outlined group-hover:text-primary">mic</span>
              </button>
              <button className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:bg-surface-tint transition-all shadow-sm hover:shadow-md hover:-translate-y-[1px]">
                <span className="material-symbols-outlined filled text-[20px]">send</span>
              </button>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant/60">Finova AI can make mistakes. Consider verifying important financial info.</span>
          </div>
        </div>
      </section>

      {/* Right Context Sidebar */}
      <aside className="w-[320px] hidden lg:flex flex-col h-full bg-surface-container-low overflow-y-auto">
        <div className="p-lg border-b border-outline-variant/20">
          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary">space_dashboard</span> Context
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Real-time financial overview</p>
        </div>
        
        <div className="p-md space-y-md">
          {/* Bento Card 1: Balance */}
          <div className="bg-surface rounded-xl p-md border border-outline-variant/30 shadow-sm relative overflow-hidden group hover:border-primary transition-colors cursor-pointer">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors"></div>
            <div className="flex items-center gap-sm mb-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">account_balance_wallet</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Available Balance</span>
            </div>
            <div className="font-headline-xl text-headline-xl text-on-surface font-bold">
              $12,450<span className="text-headline-md text-on-surface-variant">.00</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-tertiary">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span className="font-label-sm text-label-sm">+2.4% from last month</span>
            </div>
          </div>

          {/* Bento Card 2: Upcoming Bill */}
          <div className="bg-surface rounded-xl p-md border border-outline-variant/30 shadow-sm">
            <div className="flex items-center justify-between mb-sm">
              <div className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-primary">event</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider">Next Bill</span>
              </div>
              <span className="bg-error/10 text-error px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">IN 3 DAYS</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="font-label-md text-label-md text-on-surface">Chase Sapphire</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Credit Card</div>
              </div>
              <div className="font-headline-md text-headline-md text-on-surface font-bold">$450.00</div>
            </div>
          </div>

          {/* Linked Accounts Section */}
          <div className="pt-sm">
            <div className="flex items-center justify-between mb-sm px-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Linked Accounts</span>
              <button className="text-primary hover:text-surface-tint font-label-sm text-label-sm transition-colors">Manage</button>
            </div>
            <div className="space-y-xs">
              {/* Account Item */}
              <div className="flex items-center justify-between p-sm rounded-lg hover:bg-surface transition-colors cursor-pointer border border-transparent hover:border-outline-variant/30">
                <div className="flex items-center gap-sm">
                  <div className="w-8 h-8 rounded bg-secondary-fixed flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[16px]">account_balance</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface">Chase Checking</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">...4920</div>
                  </div>
                </div>
                <div className="font-label-md text-label-md text-on-surface">$8,200.00</div>
              </div>
              
              {/* Account Item */}
              <div className="flex items-center justify-between p-sm rounded-lg hover:bg-surface transition-colors cursor-pointer border border-transparent hover:border-outline-variant/30">
                <div className="flex items-center gap-sm">
                  <div className="w-8 h-8 rounded bg-tertiary-fixed flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[16px]">savings</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface">Ally Savings</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">...1198</div>
                  </div>
                </div>
                <div className="font-label-md text-label-md text-on-surface">$4,250.00</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
