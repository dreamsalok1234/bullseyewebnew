import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-prodialog',
  templateUrl: './prodialog.component.html',
  styleUrls: ['./prodialog.component.scss']
})
export class ProdialogComponent {

  totalSubsPlanDays = 0;
  totalRemainingDays = 0;
  totalDisplayPer = 0;
  DAYLEFT = 'DAY LEFT';
  DAYSLEFT = 'DAYS LEFT';
  activePro = 1;
  isAddPro = 1;
  isProRemainDays = 1;
  subCancelBtn = 1;
  isSubsChecked = 1;
  subscriptionUrl = 'DAYS LEFT';
  confirmicontent = 'DAYS LEFT';
  confirmisubupgrade = 'DAYS LEFT';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ProdialogComponent>) {
    this.totalRemainingDays = data.totalRemainingDays;
    this.totalDisplayPer = data.totalDisplayPer;
    this.DAYSLEFT = data.DAYSLEFT;

	}
	close() {
		this.dialogRef.close('Thanks for using me!');
    }
    proClose() {

    }
    checkAutoRenewal() {

    }
    openSubUpgrade() {

    }
    showPopupForCancel() {

    }

}
