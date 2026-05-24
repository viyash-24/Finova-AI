export default function BillsPage() {
  return (
    <div className="max-w-container-max mx-auto px-sm py-lg md:px-lg md:py-xl flex flex-col gap-lg h-full overflow-y-auto">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Bills &amp; Subscriptions</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Track upcoming payments and identify anomalies.</p>
        </div>
        <button className="bg-primary-container text-on-primary-container hover:bg-primary-container/90 px-md py-xs rounded-lg font-label-md text-label-md transition-all flex items-center gap-xs shadow-lg shadow-primary-container/30">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Bill
        </button>
      </header>
