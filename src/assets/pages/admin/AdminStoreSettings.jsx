export const AdminStoreSettings = () => (
  <div className="p-4 sm:p-6 space-y-6">
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Store information</h1>
      <p className="text-xs text-zinc-500 mt-1">
        Wearthly storefront details and direct-order operations.
      </p>
    </div>

    <section className="max-w-2xl bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <img src="/logowearthly.png" alt="Wearthly" className="h-10 w-auto object-contain" />
        <div>
          <h2 className="font-semibold text-zinc-900">WEARTHLY.</h2>
          <p className="text-xs text-zinc-500">Comfort, Reimagined.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 text-sm">
        <div className="rounded-lg bg-zinc-50 border border-zinc-100 p-4">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">Order model</p>
          <p className="font-medium text-zinc-900 mt-1">One-time direct transaction</p>
        </div>
        <div className="rounded-lg bg-zinc-50 border border-zinc-100 p-4">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">Payment handling</p>
          <p className="font-medium text-zinc-900 mt-1">Cash on delivery or pickup</p>
        </div>
      </div>

      <p className="text-xs leading-5 text-zinc-600">
        Manage products, stock, customers, and order fulfillment from the admin
        navigation. Financing and payment-ledger modules are not part of the
        Wearthly storefront.
      </p>
    </section>
  </div>
);
