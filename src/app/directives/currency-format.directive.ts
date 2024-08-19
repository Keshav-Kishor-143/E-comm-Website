// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[appCurrencyFormat]',
// })
// export class CurrencyFormatDirective {
//   constructor(private el: ElementRef) {}

//   @HostListener('blur', ['$event.target.value'])
//   onBlur(value: string) {
//     this.el.nativeElement.value = this.formatCurrency(value);
//   }

//   private formatCurrency(value: string): string {
//     if (!value) return '';

//     // Removing any previous formatting
//     value = value.replace(/,/g, '');

//     // Convert to number and format as per Indian currency
//     const formattedValue = Number(value).toLocaleString('en-IN');

//     return formattedValue;
//   }
// }


import { Directive, ElementRef , HostListener} from '@angular/core';
import { eventListeners } from '@popperjs/core';

@Directive({
  selector: '[appCurrencyFormat]',
  standalone: true
})
export class CurrencyFormatDirective {

  ngOnInit(){
    console.log('in the directive`');
  }
  constructor(private el:ElementRef) { }

  @HostListener('input',['$event']) onInputChange(event:Event){

    const input = this.el.nativeElement as HTMLInputElement
    let value = input.value.replace(/,/g, '');
    if (!value) {
      return;
    }

    const formattedValue = this.formatToIndianCurrency(value);
    input.value = formattedValue;
  }

  private formatToIndianCurrency(value: string): string {
    let x = value.split('.');
    let lastThree = x[0].substring(x[0].length - 3);
    const otherNumbers = x[0].substring(0, x[0].length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const result =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return x.length > 1 ? result + '.' + x[1] : result;
  }
}
