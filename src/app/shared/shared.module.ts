import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { LoadingComponent } from "./loading/loading.component";
import { DropdownDirective } from "./dropdown.directive";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        AlertComponent,
        LoadingComponent,
        DropdownDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        LoadingComponent,
        DropdownDirective,
        CommonModule
    ]
})
export class SharedModule{}