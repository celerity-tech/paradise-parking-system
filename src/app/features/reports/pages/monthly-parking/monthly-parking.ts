import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { DatePipe, DecimalPipe, NgClass, TitleCasePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DateTime } from 'luxon';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Calendar,
  Car,
  Clock,
  Download,
  Filter,
  LucideAngularModule,
  Motorbike,
  Pencil,
  RefreshCw,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  Crown,
  Wallet,
  Activity,
} from 'lucide-angular';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { ECharts } from 'echarts/core';

import { Button } from '../../../../shared/ui/button/button';
import { PesoPipe } from '../../../../shared/pipes/peso-pipe';
import { AddMonthlyDialog } from '../../components/add-monthly-dialog/add-monthly-dialog';
import { EditMonthlyDialog } from '../../components/edit-monthly-dialog/edit-monthly-dialog';
import { AuthService } from '../../../auth/services/auth';
import { ParkingService } from '../../../parking/services/parking.service';
import {
  MonthlySubscriptionAnalyticsQuery,
  ParkingSession,
  VehicleType,
} from '../../../../../graphql/generated/graphql';

type SubscriptionStatus = 'ALL' | 'ACTIVE' | 'EXPIRING' | 'NEW' | 'EXPIRED';

interface SubscriberRow extends ParkingSession {
  daysRemaining: number | null;
  derivedStatus: Exclude<SubscriptionStatus, 'ALL'>;
}

@Component({
  selector: 'app-monthly-parking',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTooltipModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    CdkTableModule,
    NgClass,
    NgxEchartsDirective,
    Button,
    DatePipe,
    DecimalPipe,
    TitleCasePipe,
    PesoPipe,
  ],
  templateUrl: './monthly-parking.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyParking implements OnInit {
  readonly BanknoteIcon = Banknote;
  readonly CarIcon = Car;
  readonly ClockIcon = Clock;
  readonly MotorbikeIcon = Motorbike;
  readonly UsersIcon = Users;
  readonly UserCheckIcon = UserCheck;
  readonly UserPlusIcon = UserPlus;
  readonly UserXIcon = UserX;
  readonly AlertIcon = AlertTriangle;
  readonly TrendUpIcon = TrendingUp;
  readonly TrendDownIcon = TrendingDown;
  readonly ArrowUpIcon = ArrowUpRight;
  readonly ArrowDownIcon = ArrowDownRight;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly DownloadIcon = Download;
  readonly RefreshIcon = RefreshCw;
  readonly CalendarIcon = Calendar;
  readonly SparklesIcon = Sparkles;
  readonly CrownIcon = Crown;
  readonly WalletIcon = Wallet;
  readonly ActivityIcon = Activity;
  readonly PencilIcon = Pencil;

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly parkingService = inject(ParkingService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly authService = inject(AuthService);

  readonly canEdit = ['admin', 'superadmin'].includes(this.authService.getRole() ?? '');

  readonly DISPLAYED_COLUMNS = [
    'vehicleType',
    'plateNumber',
    'availedAt',
    'expiresAt',
    'daysRemaining',
    'parkingFee',
    'status',
    'actions',
  ] as const;

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly vehicleControl = new FormControl<'' | VehicleType>('', { nonNullable: true });

  readonly statusFilter = signal<SubscriptionStatus>('ALL');
  readonly dataSource = new MatTableDataSource<SubscriberRow>([]);
  readonly totalEntries = signal<number>(0);
  readonly loadingList = signal<boolean>(false);
  readonly loadingAnalytics = signal<boolean>(false);
  readonly capacity = signal<number>(20);

  readonly analytics = signal<
    MonthlySubscriptionAnalyticsQuery['monthlySubscriptionAnalytics'] | null
  >(null);

  readonly statusFilters: ReadonlyArray<{
    key: SubscriptionStatus;
    label: string;
    badge: string;
  }> = [
    { key: 'ALL', label: 'All', badge: 'bg-slate-100 text-slate-700 border-slate-300' },
    { key: 'ACTIVE', label: 'Active', badge: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
    { key: 'EXPIRING', label: 'Expiring soon', badge: 'bg-amber-50 text-amber-700 border-amber-300' },
    { key: 'NEW', label: 'New', badge: 'bg-sky-50 text-sky-700 border-sky-300' },
    { key: 'EXPIRED', label: 'Expired', badge: 'bg-rose-50 text-rose-700 border-rose-300' },
  ];

  readonly insights = computed(() => {
    const a = this.analytics();
    if (!a) return [] as Array<{ tone: string; title: string; body: string }>;

    const out: Array<{ tone: string; title: string; body: string }> = [];

    if (a.expiringSoon > 0) {
      out.push({
        tone: 'amber',
        title: `${a.expiringSoon} subscription${a.expiringSoon === 1 ? '' : 's'} expiring soon`,
        body: 'Reach out within the next 7 days to secure renewals and preserve recurring revenue.',
      });
    }

    if (a.growthRate > 0) {
      out.push({
        tone: 'emerald',
        title: `Active subscribers up ${(a.growthRate * 100).toFixed(1)}% vs last month`,
        body: `MRR is currently tracking at ${this.formatPeso(a.monthlyRecurringRevenue)} from ${a.activeSubscribers} active subscribers.`,
      });
    } else if (a.growthRate < 0) {
      out.push({
        tone: 'rose',
        title: `Active subscribers down ${Math.abs(a.growthRate * 100).toFixed(1)}% vs last month`,
        body: 'Consider win-back campaigns for recently expired subscribers.',
      });
    }

    if (a.utilizationRate >= 0.85) {
      out.push({
        tone: 'sky',
        title: `Capacity at ${(a.utilizationRate * 100).toFixed(0)}%`,
        body: 'You are nearing capacity — a great signal to revisit pricing or open a waitlist.',
      });
    } else if (a.utilizationRate > 0 && a.utilizationRate < 0.5) {
      out.push({
        tone: 'sky',
        title: `Capacity utilization at ${(a.utilizationRate * 100).toFixed(0)}%`,
        body: 'Plenty of room to grow — consider promotions for monthly plans.',
      });
    }

    if (out.length === 0) {
      out.push({
        tone: 'slate',
        title: 'Everything looks steady',
        body: 'No urgent actions detected. Keep monitoring renewals and capacity.',
      });
    }

    return out;
  });

  trendChart?: ECharts;
  vehicleChart?: ECharts;

  trendChartOptions: any = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { data: ['New', 'Expired', 'Active'], top: 0, right: 0 },
    grid: { left: 40, right: 24, top: 36, bottom: 32, containLabel: true },
    xAxis: { type: 'category', data: [] as string[], axisLine: { lineStyle: { color: '#cbd5e1' } } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#e2e8f0' } } },
    color: ['#10b981', '#f43f5e', '#0ea5e9'],
    series: [
      { name: 'New', type: 'bar', data: [] as number[], barWidth: 14, itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: 'Expired', type: 'bar', data: [] as number[], barWidth: 14, itemStyle: { borderRadius: [4, 4, 0, 0] } },
      {
        name: 'Active',
        type: 'line',
        data: [] as number[],
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.08 },
      },
    ],
  };

  vehicleChartOptions: any = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'horizontal', bottom: 0 },
    color: ['#10b981', '#0ea5e9', '#f59e0b'],
    series: [
      {
        name: 'Active subscriptions',
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['50%', '46%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 0, name: 'Car' },
          { value: 0, name: 'Motorcycle' },
          { value: 0, name: 'Truck' },
        ],
      },
    ],
  };

  ngOnInit(): void {
    this.loadAll();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadList());

    this.vehicleControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadList());
  }

  setStatusFilter(status: SubscriptionStatus): void {
    if (this.statusFilter() === status) return;
    this.statusFilter.set(status);
    this.loadList();
  }

  onAddVehicle(): void {
    const dialogRef = this.dialog.open(AddMonthlyDialog);

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.loadAll();
        }
      });
  }

  onEditSubscriber(row: SubscriberRow): void {
    const dialogRef = this.dialog.open(EditMonthlyDialog, {
      data: {
        session: {
          id: row.id,
          plateNumber: row.plateNumber,
          monthlyStart: row.monthlyStart,
          monthlyEnd: row.monthlyEnd,
          parkingFee: row.parkingFee,
        },
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.loadAll();
        }
      });
  }

  refresh(): void {
    this.loadAll();
  }

  exportCsv(): void {
    const rows = this.dataSource.data;
    if (!rows.length) return;
    const header = ['Plate', 'Vehicle', 'Start', 'End', 'Days Remaining', 'Fee', 'Status'];
    const body = rows.map(r => [
      r.plateNumber,
      r.vehicleType,
      r.monthlyStart ? DateTime.fromISO(String(r.monthlyStart)).toISODate() : '',
      r.monthlyEnd ? DateTime.fromISO(String(r.monthlyEnd)).toISODate() : '',
      r.daysRemaining ?? '',
      r.parkingFee ?? 0,
      r.derivedStatus,
    ]);
    const csv = [header, ...body]
      .map(line => line.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-subscribers-${DateTime.now().toFormat('yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  formatPeso(value: number | null | undefined): string {
    if (!value) return '₱0.00';
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
  }

  formatPercent(value: number | null | undefined, fractionDigits = 1): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '0%';
    return `${(value * 100).toFixed(fractionDigits)}%`;
  }

  onTrendChartInit(chart: ECharts): void {
    this.trendChart = chart;
  }

  onVehicleChartInit(chart: ECharts): void {
    this.vehicleChart = chart;
  }

  trackByMonth(_: number, point: { monthKey: string }): string {
    return point.monthKey;
  }

  private loadAll(): void {
    this.loadAnalytics();
    this.loadList();
  }

  private loadAnalytics(): void {
    this.loadingAnalytics.set(true);
    this.parkingService
      .getMonthlySubscriptionAnalytics({
        referenceDate: DateTime.now().toISODate(),
        trendMonths: 6,
        expiringWindowDays: 7,
        capacity: this.capacity(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          if (!data) {
            this.loadingAnalytics.set(false);
            return;
          }
          this.analytics.set(data);
          this.updateCharts(data);
          this.loadingAnalytics.set(false);
          this.cdr.markForCheck();
        },
        error: err => {
          console.error('Error loading subscription analytics:', err);
          this.loadingAnalytics.set(false);
        },
      });
  }

  private loadList(): void {
    this.loadingList.set(true);
    const status = this.statusFilter();
    this.parkingService
      .getMonthlySessions({
        page: 1,
        limit: 200,
        rateType: 'MONTHLY',
        search: this.searchControl.value?.trim() || null,
        vehicleType: (this.vehicleControl.value || null) as VehicleType | null,
        subscriptionStatus: status === 'ALL' ? null : status,
        referenceDate: DateTime.now().toISODate(),
        expiringWindowDays: 7,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          const today = DateTime.now().startOf('day');
          const monthStart = today.startOf('month');
          const rows: SubscriberRow[] = (response.data as ParkingSession[]).map(s => {
            const end = s.monthlyEnd ? DateTime.fromISO(String(s.monthlyEnd)) : null;
            const start = s.monthlyStart ? DateTime.fromISO(String(s.monthlyStart)) : null;
            const daysRemaining = end ? Math.ceil(end.diff(today, 'days').days) : null;

            let derived: SubscriberRow['derivedStatus'] = 'ACTIVE';
            if (end && end < today) {
              derived = 'EXPIRED';
            } else if (end && daysRemaining !== null && daysRemaining <= 7) {
              derived = 'EXPIRING';
            } else if (start && start >= monthStart) {
              derived = 'NEW';
            }

            return { ...s, daysRemaining, derivedStatus: derived };
          });

          this.dataSource.data = rows;
          this.totalEntries.set(response.meta?.total ?? rows.length);
          this.loadingList.set(false);
          this.cdr.markForCheck();
        },
        error: err => {
          console.error('Error loading monthly records:', err);
          this.loadingList.set(false);
        },
      });
  }

  private updateCharts(
    data: MonthlySubscriptionAnalyticsQuery['monthlySubscriptionAnalytics'],
  ): void {
    const labels = data.trend.map(p => p.label);
    const news = data.trend.map(p => p.newSubscribers);
    const expired = data.trend.map(p => p.expired);
    const active = data.trend.map(p => p.activeAtEnd);

    this.trendChartOptions = {
      ...this.trendChartOptions,
      xAxis: { ...this.trendChartOptions.xAxis, data: labels },
      series: [
        { ...this.trendChartOptions.series[0], data: news },
        { ...this.trendChartOptions.series[1], data: expired },
        { ...this.trendChartOptions.series[2], data: active },
      ],
    };
    if (this.trendChart) {
      this.trendChart.setOption(this.trendChartOptions, true);
    }

    this.vehicleChartOptions = {
      ...this.vehicleChartOptions,
      series: [
        {
          ...this.vehicleChartOptions.series[0],
          data: [
            { value: data.vehicleBreakdown.cars, name: 'Car' },
            { value: data.vehicleBreakdown.motorcycles, name: 'Motorcycle' },
            { value: data.vehicleBreakdown.trucks, name: 'Truck' },
          ],
        },
      ],
    };
    if (this.vehicleChart) {
      this.vehicleChart.setOption(this.vehicleChartOptions, true);
    }
  }
}
