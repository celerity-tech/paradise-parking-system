import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { Banknote, Car, Clock, Eye, LucideAngularModule, Motorbike, Download, TrendingUp } from 'lucide-angular';
import { DatePipe, NgClass, CurrencyPipe } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { CdkTableModule } from '@angular/cdk/table';
import type { ECharts } from 'echarts/core';
import { MatTableDataSource } from '@angular/material/table';
import { DateTime } from 'luxon';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { LuxonDateAdapter, MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { Button } from "../../../../shared/ui/button/button";
import { PesoPipe } from '../../../../shared/pipes/peso-pipe';

export const MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: 'MMMM yyyy',
  },
  display: {
    dateInput: 'MMMM yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'MMMM yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-monthly-summary',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    StatCard,
    LucideAngularModule,
    CdkTableModule,
    NgxEchartsDirective,
    MatLuxonDateModule,
    Button,
    DatePipe,
    PesoPipe
  ],
  templateUrl: './monthly-summary.html',
  styleUrl: './monthly-summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: LuxonDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS },
  ],
})
export class MonthlySummary {
  readonly BanknoteIcon = Banknote;
  readonly CarIcon = Car;
  readonly ClockIcon = Clock;
  readonly MotorbikeIcon = Motorbike;
  readonly TruckIcon = Clock; // Placeholder, or use Lucide Truck if available
  readonly EyeIcon = Eye;
  readonly DownloadIcon = Download;
  readonly TrendingUpIcon = TrendingUp;

  readonly dateControl = new FormControl(DateTime.now());

  readonly totalRevenue = signal<number>(0);
  readonly averageDailyRevenue = signal<number>(0);
  readonly totalEntries = signal<number>(0);
  readonly hourlyRevenue = signal<number>(0);
  readonly overnightRevenue = signal<number>(0);
  readonly monthlyAvailersRevenue = signal<number>(0);

  openReport() {
    console.log('open monthly report details');
  }

  exportToCSV() {
    console.log('Exporting Monthly Summary to CSV...');
  }

  exportToPDF() {
    console.log('Exporting Monthly Summary to PDF...');
  }

  setMonthAndYear(selected: DateTime, datepicker: any) {
    const current = this.dateControl.value ?? DateTime.now();

    this.dateControl.setValue(
      current.set({
        year: selected.year,
        month: selected.month,
        day: 1,
      })
    );

    datepicker.close();
    this.loadMockData(); // reload on change
  }

  vehicleChartInstance?: ECharts;
  monthlyTrendChartInstance?: ECharts;

  vehicleChartOptions = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ₱{c} ({d}%)' // Show revenue and percentage
    },
    legend: {
      orient: 'horizontal',
      left: 'left'
    },
    color: ['#10b981', '#0ea5e9', '#f59e0b'], // Emerald, Sky, Amber
    series: [
      {
        name: 'Revenue by Vehicle Type',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '55%'],
        data: [
          { value: 0, name: 'CAR' },
          { value: 0, name: 'MOTORCYCLE' },
          { value: 0, name: 'TRUCK' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  monthlyTrendChartOptions = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['Hourly', 'Overnight', 'Monthly'],
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [] as string[] // 1 to 30/31 days
    },
    yAxis: {
      type: 'value',
      name: 'Revenue (₱)',
      axisLabel: {
        formatter: '₱{value}'
      }
    },
    color: ['#10b981', '#f59e0b', '#8b5cf6'], // Emerald (Hourly), Amber (Overnight), Purple (Monthly)
    series: [
      {
        name: 'Hourly',
        type: 'bar',
        stack: 'total',
        data: [] as number[]
      },
      {
        name: 'Overnight',
        type: 'bar',
        stack: 'total',
        data: [] as number[]
      },
      {
        name: 'Monthly',
        type: 'bar',
        stack: 'total',
        data: [] as number[]
      }
    ]
  };

  onVehicleChartInit(e: ECharts) {
    this.vehicleChartInstance = e;
  }
  
  onMonthlyTrendChartInit(e: ECharts) {
    this.monthlyTrendChartInstance = e;
  }
  readonly DISPLAYED_COLUMNS: string[] = ['loggedDate', 'totalEntries', 'totalRevenue', 'view'] as const;
  dataSource = new MatTableDataSource<any>([]);

  ngOnInit(): void {
    this.loadMockData();
  }

  private loadMockData(): void {
    const daysInMonth = this.dateControl.value?.daysInMonth ?? 30;
    const mockData = [];
    let cumulativeRevenue = 0;
    let totalCarRev = 0;
    let totalMotorRev = 0;
    let totalTruckRev = 0;
    let entries = 0;
    let totalHourlyRev = 0;
    let totalOvernightRev = 0;
    let totalMonthlyStreamRev = 0;
    
    const hourlyDailyRev: number[] = [];
    const overnightDailyRev: number[] = [];
    const monthlyDailyRev: number[] = [];
    const days: string[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = this.dateControl.value?.set({ day }) ?? DateTime.now().set({ day });
      
      const carCount = Math.floor(Math.random() * 50) + 10;
      const motorCount = Math.floor(Math.random() * 30) + 5;
      const truckCount = Math.floor(Math.random() * 10) + 2;
      
      const carRev = carCount * 50; 
      const motorRev = motorCount * 20;
      const truckRev = truckCount * 150;

      // Streams
      const hourlyRev = (carRev + motorRev + truckRev) * 0.7;
      const overnightRev = (carRev + motorRev + truckRev) * 0.2;
      const monthlyStreamRev = (carRev + motorRev + truckRev) * 0.1;

      totalCarRev += carRev;
      totalMotorRev += motorRev;
      totalTruckRev += truckRev;
      totalHourlyRev += hourlyRev;
      totalOvernightRev += overnightRev;
      totalMonthlyStreamRev += monthlyStreamRev;
      
      cumulativeRevenue += (carRev + motorRev + truckRev);
      entries += (carCount + motorCount + truckCount);

      hourlyDailyRev.push(Math.round(hourlyRev));
      overnightDailyRev.push(Math.round(overnightRev));
      monthlyDailyRev.push(Math.round(monthlyStreamRev));
      
      days.push(`Day ${day}`);

      mockData.push({
        loggedDate: date.toISODate(),
        carAmount: carCount,
        motorAmount: motorCount,
        truckAmount: truckCount,
        carRevenue: carRev,
        motorRevenue: motorRev,
        truckRevenue: truckRev,
        hourlyRevenue: hourlyRev,
        overnightRevenue: overnightRev,
        monthlyStreamRevenue: monthlyStreamRev,
        totalEntries: carCount + motorCount + truckCount,
        totalRevenue: carRev + motorRev + truckRev
      });
    }

    this.dataSource.data = mockData.reverse();
    
    this.totalRevenue.set(cumulativeRevenue);
    this.averageDailyRevenue.set(Math.round(cumulativeRevenue / daysInMonth));
    this.totalEntries.set(entries);
    this.hourlyRevenue.set(Math.round(totalHourlyRev));
    this.overnightRevenue.set(Math.round(totalOvernightRev));
    this.monthlyAvailersRevenue.set(Math.round(totalMonthlyStreamRev));

    this.vehicleChartOptions = {
      ...this.vehicleChartOptions,
      series: [(this.vehicleChartOptions.series as any)[0]]
    };
    (this.vehicleChartOptions.series as any)[0].data = [
      { value: totalCarRev, name: 'CAR' },
      { value: totalMotorRev, name: 'MOTORCYCLE' },
      { value: totalTruckRev, name: 'TRUCK' }
    ];
    if (this.vehicleChartInstance) {
      this.vehicleChartInstance.setOption(this.vehicleChartOptions);
    }

    // Update Monthly Trend Chart
    this.monthlyTrendChartOptions = {
      ...this.monthlyTrendChartOptions,
      xAxis: { type: 'category', data: days.reverse() },
      series: [
        { name: 'Hourly', type: 'bar', stack: 'total', data: hourlyDailyRev.reverse() },
        { name: 'Overnight', type: 'bar', stack: 'total', data: overnightDailyRev.reverse() },
        { name: 'Monthly', type: 'bar', stack: 'total', data: monthlyDailyRev.reverse() }
      ]
    };
    if (this.monthlyTrendChartInstance) {
      this.monthlyTrendChartInstance.setOption(this.monthlyTrendChartOptions);
    }
  }
}
