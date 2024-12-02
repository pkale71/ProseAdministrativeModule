import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convert12HrsTimeFormat',
  standalone : true
})
export class Convert12HrsTimeFormatPipe implements PipeTransform {
  transform(time: any): any {
    if (!time) { 
      return '';  // Return an empty string or handle this case as needed
    }

    // Ensure that time is a string or can be treated as a string
    const timeString = time.toString();
    const [hour, min] = timeString.split(':');  // Destructure hours and minutes from the string

    let part = parseInt(hour) >= 12 ? 'PM' : 'AM';
    let formattedHour = parseInt(hour) === 0 ? 12 : parseInt(hour);
    
    // If hour is greater than 12, convert it to 12-hour format
    formattedHour = formattedHour > 12 ? formattedHour - 12 : formattedHour;

    // Format minute to ensure it’s always 2 digits
    const formattedMin = min.padStart(2, '0');
    let formattedHour1 = formattedHour.toString().padStart(2, '0');

    return `${formattedHour1}:${formattedMin} ${part}`;
  }
}