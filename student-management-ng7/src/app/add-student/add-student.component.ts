import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService } from '../student.service';

declare var $: any;
// import * as $ from "jquery";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private data: StudentService) {
    this.addStudentForm = this.formBuilder.group({
      name: [''],
      description: [''],
      date: [''],
      courses: ['']
    })
  }

  addStudentForm: FormGroup;
  submitted = false;
  success: Boolean = false;
  a = [1, 2, 3]

  onSubmit() {
    this.submitted = true;
    // console.log(this.addStudentForm.value)

    // if (this.addStudentForm.invalid) {
    //   return;
    // }


    this.addStudentForm.value.date = $('#date').val();

    this.data.addStudents(this.addStudentForm.value).subscribe(data => {
      console.log(data)
    })
    this.success = true;
  }

  ngOnInit() {

    $('#date').datetimepicker({
      inline: true
    });

    console.log($('#multiple-select').html())
  }

}
