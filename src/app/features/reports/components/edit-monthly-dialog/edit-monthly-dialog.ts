import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint, MatInput, MatError } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { finalize } from 'rxjs';

import { Button } from '../../../../shared/ui/button/button';
import { DASHBOARD_DATE_FORMAT } from '../../../../shared/utils/date-format';
import { ParkingService } from '../../../parking/services/parking.service';
import { ParkingSession } from '../../../../../graphql/generated/graphql';

export interface EditMonthlyDialogData {
  session: Pick<ParkingSession, 'id' | 'plateNumber' | 'monthlyStart' | 'monthlyEnd' | 'parkingFee'>;
}

@Component({
  selector: 'app-edit-monthly-dialog',
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    Button,
    MatFormField,
    MatLabel,
    MatHint,
    MatDatepickerModule,
    MatInput,
    MatError,
  ],
  templateUrl: './edit-monthly-dialog.html',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: DASHBOARD_DATE_FORMAT },
  ],
})
export class EditMonthlyDialog {
  private readonly dialogRef = inject(MatDialogRef<EditMonthlyDialog>);
  private readonly fb = inject(FormBuilder);
  private readonly parkingService = inject(ParkingService);
  readonly data = inject<EditMonthlyDialogData>(MAT_DIALOG_DATA);

  isSubmitting = false;
  errorMessage: string | null = null;

  readonly form: FormGroup = this.fb.group({
    plateNumber: [this.data.session.plateNumber, Validators.required],
    parkingFee: [this.data.session.parkingFee ?? 0, [Validators.required, Validators.min(0)]],
  });

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(
      this.data.session.monthlyStart ? new Date(this.data.session.monthlyStart) : null,
      Validators.required,
    ),
    end: new FormControl<Date | null>(
      this.data.session.monthlyEnd ? new Date(this.data.session.monthlyEnd) : null,
      Validators.required,
    ),
  });

  onSubmit(): void {
    if (this.form.invalid || this.range.invalid) {
      this.form.markAllAsTouched();
      this.range.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const payload = {
      id: this.data.session.id,
      plateNumber: this.form.value.plateNumber,
      parkingFee: Number(this.form.value.parkingFee),
      monthlyStart: this.range.value.start,
      monthlyEnd: this.range.value.end,
    };

    this.parkingService
      .updateMonthlySession(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: err => {
          console.error('Failed to update monthly session', err);
          this.errorMessage = 'Failed to save changes. Please try again.';
        },
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
