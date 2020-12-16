import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { CarListComponent } from "./components/car-list/car-list.component";
import { StoreService } from "./store.service";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [BrowserModule, FormsModule, CommonModule],
  declarations: [AppComponent, CarListComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
