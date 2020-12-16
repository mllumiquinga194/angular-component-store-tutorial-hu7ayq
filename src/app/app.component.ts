import { Component } from "@angular/core";
import { StoreService } from "./store.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [StoreService]
})
export class AppComponent {
  plate = "";
  vm$ = this.store.vm$;

  constructor(private store: StoreService) {}

  onSubmit($event: Event) {
    $event.preventDefault();
    this.store.addCarToParkingLot(this.plate);
    this.plate = "";
  }

  addPlate($event: Event) {
    const target = $event.target as HTMLButtonElement;

    if (target.nodeName === "BUTTON") {
      this.plate = target.innerHTML;
    }
  }
}
