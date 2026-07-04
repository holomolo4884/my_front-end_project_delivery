import { Component, signal } from '@angular/core';
import { Header } from '../../header/header';
import { FormsModule } from '@angular/forms';
import { DeliveryApi } from '../../services/delivery-api';

interface TrackStatus {
  type: string;
  label: string;
  date: string;
}

interface TrackResult {
  id: number;
  route: {
    from: string;
    to: string;
  };
  statuses: TrackStatus[];
}

@Component({
  selector: 'app-track',
  imports: [Header, FormsModule],
  templateUrl: './track.html',
  styleUrl: './track.css',
})
export class Track {
  trackNumber = '';
  readonly trackResult = signal<TrackResult | null>(null);

  constructor (private deliveryApi: DeliveryApi) {}

  trackShipment(): void {
    const rawValue = this.trackNumber.trim();

    if (!rawValue) {
      alert('Заполните номер отправления');
      return;
    }

    this.trackResult.set(null);
    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue) || numericValue <= 0) {
      alert('Введите корректный номер отправления');
      return;
    }

    this.deliveryApi.getDeliveryInfo(numericValue).subscribe((response) => {
      if ('error' in response) {
        alert(response.error);
        return;
      }

      this.trackResult.set(response);
    });
  }
}
