import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatInput, MatError, MatHint } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { finalize } from 'rxjs';
import { DateTime } from 'luxon';

import { Button } from '../../../../shared/ui/button/button';
import { DASHBOARD_DATE_FORMAT } from '../../../../shared/utils/date-format';
import { ParkingService } from '../../../parking/services/parking.service';
import { ParkingSession } from '../../../../../graphql/generated/graphql';

export interface EditDailyDialogData {
  session: Pick<ParkingSession, 'id' | 'plateNumber' | 'enteredAt' | 'exitedAt' | 'parkingFee'>;
}

function toDatetimeLocal(value: unknown): string {
  if (!value) return '';
  const dt = DateTime.fromISO(String(value));
  if (!dt.isValid) return '';
  return dt.toFormat("yyyy-LL-dd'T'HH:mm");
}

@Component({
  selector: 'app-edit-daily-dialog',
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
  templateUrl: './edit-daily-dialog.html',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: DASHBOARD_DATE_FORMAT },
  ],
})
export class EditDailyDialog {
  private readonly dialogRef = inject(MatDialogRef<EditDailyDialog>);
  private readonly fb = inject(FormBuilder);
  private readonly parkingService = inject(ParkingService);
  readonly data = inject<EditDailyDialogData>(MAT_DIALOG_DATA);

  isSubmitting = false;
  errorMessage: string | null = null;

  readonly form: FormGroup = this.fb.group({
    plateNumber: [this.data.session.plateNumber, Validators.required],
    enteredAt: [toDatetimeLocal(this.data.session.enteredAt), Validators.required],
    exitedAt: [toDatetimeLocal(this.data.session.exitedAt)],
    parkingFee: [this.data.session.parkingFee ?? 0, [Validators.required, Validators.min(0)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const enteredAt = value.enteredAt ? new Date(value.enteredAt) : null;
    const exitedAt = value.exitedAt ? new Date(value.exitedAt) : null;

    if (enteredAt && exitedAt && exitedAt < enteredAt) {
      this.errorMessage = 'Exit time must be after entry time.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.parkingService
      .updateParkingSession({
        id: this.data.session.id,
        plateNumber: value.plateNumber,
        enteredAt,
        exitedAt,
        parkingFee: Number(value.parkingFee),
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: err => {
          console.error('Failed to update parking session', err);
          this.errorMessage = 'Failed to save changes. Please try again.';
        },
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
