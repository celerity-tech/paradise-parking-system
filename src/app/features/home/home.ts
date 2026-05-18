import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly version = 'v1.0';

  readonly v1Features = [
    {
      title: 'Plate-based session tracking',
      description: 'Log every vehicle by plate number, type, and rate. Active and exited sessions stay separate and searchable.'
    },
    {
      title: 'Hourly, overnight & monthly rates',
      description: 'Three rate types out of the box. Fees compute on exit from entry timestamp and rate selection.'
    },
    {
      title: 'Daily revenue snapshot',
      description: 'Currently parked, total entries today, revenue today &mdash; surfaced the moment an attendant opens parking.'
    },
    {
      title: 'Reports that finance can use',
      description: 'Daily breakdowns, monthly summaries, annual reports, and violations &mdash; all exportable.'
    },
    {
      title: 'BIR-ready tax reports',
      description: 'A dedicated tax role and report set built to match Bureau of Internal Revenue filing needs.'
    },
    {
      title: 'Role-based access',
      description: 'Admin, attendant, and tax officer each see only the screens they need. Routes are guarded.'
    },
    {
      title: 'Entry & exit ticket printing',
      description: 'Print on session start and on exit, with retry if the printer service is offline.'
    },
    {
      title: 'Peso-first pricing',
      description: 'Currency, date formats, and reports built for Philippine operations from day one.'
    }
  ];

  readonly nextMilestone = 'v2.0';

  readonly roadmap = [
    {
      title: 'Live floor map & zones',
      description: 'Replace the session list with a visual lot map. Define zones, slot counts, and per-zone rates.'
    },
    {
      title: 'AI plate recognition',
      description: 'Gate-camera integration that reads plates automatically &mdash; no more manual entry at the booth.'
    },
    {
      title: 'Driver reservations',
      description: 'A public-facing app so drivers can reserve a slot before they arrive.'
    },
    {
      title: 'Multi-lot operator console',
      description: 'Manage several parking sites from one dashboard with consolidated revenue and staffing views.'
    }
  ];
}
