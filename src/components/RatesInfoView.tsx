import React from 'react';
import {
  Info,
  DollarSign,
  Clock,
  ShieldAlert,
  HelpCircle,
  Code2,
  ExternalLink,
  CheckCircle2,
  Car,
} from 'lucide-react';

export const RatesInfoView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-5">
      {/* Title */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Singapore Parking Guide & API Specs
        </h2>
        <p className="text-xs text-slate-500">
          Official parking regulations, standard rates matrix, and API integration specifications.
        </p>
      </div>

      {/* SG Standard Parking Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Card 1: Standard HDB Visitor Parking */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Standard HDB Visitor Rates</h3>
              <p className="text-[11px] text-slate-500">Regulated by Housing & Development Board</p>
            </div>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Outside Central Area:</strong> $0.60 per 30 minutes (7:00 AM – 10:30 PM).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Within Central Area:</strong> $1.20 per 30 minutes (7:00 AM – 5:00 PM),
                $0.60 per 30 minutes (5:00 PM – 10:30 PM).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Night Parking:</strong> $0.60 per 30 minutes, capped at maximum{' '}
                <strong>$5.00 per night</strong> (10:30 PM – 7:00 AM next day).
              </span>
            </li>
          </ul>
        </div>

        {/* Card 2: 15-Minute Grace Period */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">15-Min Free Grace Period</h3>
              <p className="text-[11px] text-slate-500">Pick-up and drop-off policy</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All HDB and URA carparks equipped with Electronic Parking System (EPS) provide a{' '}
            <strong>15-minute grace period</strong> for motorists. If you exit within 15 minutes of
            entry, no parking charges will be deducted from your CEPAS CashCard or Motoring Card.
          </p>
          <div className="text-[11px] bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-200/80">
            Note: Commercial malls may have varying grace periods (usually 10 to 15 minutes).
          </div>
        </div>

        {/* Card 3: Free Sunday & Public Holiday Parking */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sunday Free Parking Scheme (FPS)</h3>
              <p className="text-[11px] text-slate-500">HDB community initiative</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Select HDB carparks outside the Central Area offer <strong>Free Parking</strong> on
            Sundays and Public Holidays between <strong>7:30 AM and 10:30 PM</strong>. Look for
            the orange FPS emblem at carpark entry gantries.
          </p>
        </div>

        {/* Card 4: Payment Methods & ERP 2.0 (OBU) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Electronic Parking & Payments</h3>
              <p className="text-[11px] text-slate-500">EPS, OBU, and Parking.sg</p>
            </div>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5">
            <li>
              • <strong>EPS Barrier Gantries:</strong> Automatically scans In-Vehicle Unit (IU) or
              new ERP 2.0 On-Board Unit (OBU).
            </li>
            <li>
              • <strong>Payment:</strong> NETS Motoring Card, FlashPay, EZ-Link CEPAS, or backend
              auto-deduction.
            </li>
            <li>
              • <strong>Coupon / Open lots:</strong> Use the government <code>Parking.sg</code> app
              for per-minute digital coupon activation.
            </li>
          </ul>
        </div>
      </div>

      {/* Developer API Integration Section */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              Serverless API Endpoints (/api)
            </h3>
          </div>
          <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-sm border border-emerald-500/40">
            Connected
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The serverless API is configured under the root <code>/api</code> directory and forwards requests securely to LTA DataMall with your <code>AccountKey</code> header without exposing keys to the browser:
        </p>

        {/* Endpoints Table */}
        <div className="space-y-2 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="font-semibold text-white mb-1 flex items-center justify-between">
              <span>1. LTA Carpark Availability Proxy</span>
              <span className="text-[10px] text-emerald-400 font-mono">Live Endpoint</span>
            </div>
            <code className="text-emerald-300 block font-mono text-[11px] break-all">
              GET /api/carparkavailability
            </code>
            <p className="text-slate-400 text-[11px] mt-1">
              Proxies upstream to: <code>https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2</code> using <code>AccountKey</code> from <code>process.env.LTA_ACCOUNT_KEY</code>. Supports pagination via <code>?$skip=500</code>.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="font-semibold text-white mb-1 flex items-center justify-between">
              <span>2. API Health Check</span>
              <span className="text-[10px] text-emerald-400 font-mono">Live Endpoint</span>
            </div>
            <code className="text-emerald-300 block font-mono text-[11px] break-all">
              GET /api/health
            </code>
            <p className="text-slate-400 text-[11px] mt-1">
              Returns server status, timestamp, and service identity.
            </p>
          </div>
        </div>

        {/* Sample Payload */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
          <div className="text-slate-500 mb-1">// Response structure from GET /api/carparkavailability:</div>
          <pre>{`{
  "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/$metadata#CarParkAvailabilityv2",
  "value": [
    {
      "CarParkID": "1",
      "Area": "Marina",
      "Development": "Suntec City",
      "Location": "1.29375 103.85718",
      "AvailableLots": 372,
      "LotType": "C",
      "Agency": "LTA"
    }
  ]
}`}</pre>
        </div>
      </div>
    </div>
  );
};
