import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Store settings</p>
        <h1 className="mt-2 text-3xl font-bold text-dark">Seller Settings</h1>
      </div>
      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>Account & Store Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-zinc-600">Use this space to keep track of store details, payout preferences, and contact information. This lightweight settings page keeps the seller navigation complete and ready for future enhancements.</p>
        </CardContent>
      </Card>
    </div>
  );
}
