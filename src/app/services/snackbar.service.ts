import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarConfig } from '@angular/material/snack-bar';

interface Snackbar {
  message: string;
  action: string;
  options: MatSnackBarConfig;
}

export interface SnackbarOption {
  action?: string,
  duration?: number,
  horizontalPosition?: MatSnackBarHorizontalPosition,
  verticalPosition?: MatSnackBarVerticalPosition,
  panelClass?: string | string[]
}


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly durationInSeconds: number = 3;
  private readonly horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private readonly verticalPosition: MatSnackBarVerticalPosition = 'top';

  private isShowingToast: boolean = false;
  private snackBarQueue: Snackbar[] = [];

  constructor(private matSnackBar: MatSnackBar) { }

  showSnackBar(message: string, options?: SnackbarOption): void {
    const snackBar: Snackbar = {
      message,
      action: options && options.action ? options.action : null,
      options: this.createOption(options)
    }
    this.snackBarQueue.push(snackBar)
    if (!this.isShowingToast) {
      this.show();
    }
  }

  private show(): void {
    const toast = this.snackBarQueue.shift() || null;
    if (!toast) {
      this.isShowingToast = false;
      return;
    }
    const { message, action, options } = toast;
    this.isShowingToast = true;
    this.matSnackBar.open(message, action, options)
      .afterDismissed()
      .subscribe(() => { this.show() })
  }

  private createOption(options?: SnackbarOption): MatSnackBarConfig {
    return {
      duration: options && options.duration ? options.duration : this.durationInSeconds * 1000,
      horizontalPosition: options && options.horizontalPosition ? options.horizontalPosition : this.horizontalPosition,
      verticalPosition: options && options.verticalPosition ? options.verticalPosition : this.verticalPosition,
      panelClass: options && options.panelClass ? options.panelClass : null,
    }
  }
}
