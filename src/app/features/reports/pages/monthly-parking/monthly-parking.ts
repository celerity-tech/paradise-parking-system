import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkTableModule } from '@angular/cdk/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DateTime } from 'luxon';
import { Banknote, Car, Clock, LucideAngularModule, Motorbike } from 'lucide-angular';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { ECharts } from 'echarts/core';

import { StatCard } from "../../../../shared/components/stat-card/stat-card";
import { Button } from "../../../../shared/ui/button/button";
import { PesoPipe } from '../../../../shared/pipes/peso-pipe';
import { AddMonthlyDialog } from '../../components/add-monthly-dialog/add-monthly-dialog';
import { ParkingService } from '../../../parking/services/parking.service';
import { ParkingSession } from '../../../../../graphql/generated/graphql';

@Component({
  selector: 'app-monthly-parking',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    StatCard,
    LucideAngularModule,
    CdkTableModule,
    NgClass,
    NgxEchartsDirective,
    Button,
    MatCheckboxModule,
    DatePipe,
    PesoPipe
  ],
  templateUrl: './monthly-parking.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MonthlyParking implements OnInit {
  readonly BanknoteIcon = Banknote;
  readonly CarIcon = Car;
  readonly ClockIcon = Clock;
  readonly MotorbikeIcon = Motorbike;

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly parkingService = inject(ParkingService);

  readonly DISPLAYED_COLUMNS = ['vehicleType', 'plateNumber', 'availedAt', 'expiresAt', 'parkingFee', 'status'] as const;

  readonly dateControl = new FormControl(DateTime.now());
  readonly dataSource = new MatTableDataSource<ParkingSession>([]);
  readonly totalEntries = signal<number>(0);
  
  chartInstance?: ECharts;

  chartOptions = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      left: 'left'
    },
    series: [
      {
        name: 'Vehicle Type',
        type: 'pie',
        radius: '70%',
        center: ['50%', '60%'],
        data: [
          { value: 0, name: 'CAR' },
          { value: 0, name: 'MOTORCYCLE' },
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

  ngOnInit(): void {
    this.loadMonthlyRecords();
  }

  onAddVehicle(): void {
    const dialogRef = this.dialog.open(AddMonthlyDialog);
    
    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.loadMonthlyRecords();
        }
      });
  }

  loadMonthlyRecords(): void {
    this.parkingService.getMonthlySessions({
      page: 1,
      limit: 100, // Fetch more for reporting
      rateType: "MONTHLY"
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        const data = response.data as ParkingSession[];
        this.dataSource.data = data;
        this.totalEntries.set(data.length);
        this.updateChartData(data);
      },
      error: (err) => {
        console.error('Error loading monthly records:', err);
      }
    });
  }

  private updateChartData(sessions: ParkingSession[]): void {
    const carCount = sessions.filter(s => s.vehicleType === 'CAR').length;
    const motorCount = sessions.filter(s => s.vehicleType === 'MOTORCYCLE').length;

    this.chartOptions = {
      ...this.chartOptions,
      series: [(this.chartOptions.series as any)[0]]
    };

    (this.chartOptions.series as any)[0].data = [
      { value: carCount, name: 'CAR' },
      { value: motorCount, name: 'MOTORCYCLE' }
    ];

    if (this.chartInstance) {
      this.chartInstance.setOption(this.chartOptions);
    }
  }

  onChartInit(instance: ECharts): void {
    this.chartInstance = instance;
  }
}