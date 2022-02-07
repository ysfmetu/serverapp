import { FormControl, FormGroup, Validators } from '@angular/forms';

export class BaseFormControl extends FormControl {
  label: string;
  constructor(label: string, value: any, validator?: any) {
    super(value, validator);
    this.label = label;
  }
}

export class LoginFormModel extends FormGroup {
  constructor(def?) {
    super({
      userName: new FormControl('yusuf.ulku', Validators.required),
      password: new FormControl('Ysf_123_14', Validators.required),
    });
  }
}
export class IPFormModel extends FormGroup{
  constructor(){
    super({
      id:new FormControl(''),
      ipAddress:new FormControl('',Validators.compose([Validators.required,Validators.minLength(10)])),
      serverName:new FormControl('',Validators.required),
      detail:new FormControl('',Validators.required),
      kullanici_adi:new FormControl(''),
      password:new FormControl(''),
      status:new FormControl(''),
      categoryName:new FormControl(''),
      categoryId:new FormControl(''),
    });
   
  }
}
