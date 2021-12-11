import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../all-booking/booking.service';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.sass']
})
export class AddBookingComponent {
  bookingForm: FormGroup;
  selectedFile: File = null
  constructor(
    private fb: FormBuilder,
    private hotel: BookingService
  ) {
    this.bookingForm = this.fb.group({
      first: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      last: [''],
      email: [
        '',[Validators.required, Validators.email]
      ],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      city: [''],
      arriveDate: ['', [Validators.required]],
      departDate: ['', [Validators.required]],
      totalPerson: ['', [Validators.required]],
      roomType: ['', [Validators.required]],
      address: [''],
      uploadImg: [''],
      note: [''],
      companyName:[''],designation:[],
      nationality:[''],
      purposeOfVisit:[],
      ArrivedBy:[],
      proceedingTo:[],
    });
  }
  onSubmit() {
    console.log('Form Value', this.bookingForm.value);
    // console.log((this.bookingForm.value.uploadImg._files[0]));
    // const fd = new FormData();
    // console.log("selected file",this.selectedFile)
    // fd.append('file', this.selectedFile, this.selectedFile.name);
    // console.log(fd)
    // this.bookingForm['value']['file'] = this.bookingForm.value.uploadImg._files[0];
    console.log(typeof this.bookingForm.value)
    this.hotel.createBooking(this.bookingForm.value).subscribe((data) => {
      console.log(data);
      
    })
  };
  onFileSelected(event) {
    this.selectedFile = event.target.files[0]
  }
}
