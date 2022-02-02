import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const ImportAndExports = [
  ReactiveFormsModule,
  FormsModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [],
  imports: [ImportAndExports],
  exports: [ImportAndExports],
})
export class SharedModule {}
