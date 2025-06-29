import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function allowedEmailDomainsValidator(allowedDomains: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (!email) return null;

    const atIndex = email.lastIndexOf('@');
    if (atIndex === -1) return { domainInvalid: true };

    const domain = email.substring(atIndex + 1).toLowerCase();
    const isValid = allowedDomains.some(allowed => domain === allowed.toLowerCase());

    return isValid ? null : { domainInvalid: { allowed: allowedDomains } };
  };
}
