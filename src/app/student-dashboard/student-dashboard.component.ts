import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { StudentModel } from './student.model';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  formValue!: FormGroup;
  studentobj: StudentModel = new StudentModel();
  studentList: StudentModel | any = [];

  btnSaveShow: boolean = true;

  btnUpdateShow: boolean = false;

  constructor(private formBuilder: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.GetAllStudent();
    this.formValue = this.formBuilder.group({
      name: [''],
      class: [''],
      email: [''],
      mobile: [' '],
    });
  }
  AddStudent() {
    debugger;
    this.studentobj.name = this.formValue.value.name;
    this.studentobj.class = this.formValue.value.class;
    this.studentobj.email = this.formValue.value.email;
    this.studentobj.mobile = this.formValue.value.mobile;

    this.api.postStudent(this.studentobj).subscribe({
      next: (v) => {
        console.log('next->', v);
      },
      error: (e) => {
        alert('Error');
        console.log(e);
      },
      complete: () => {
        console.log('complete');
        alert('Data Saved');
        this.GetAllStudent();
        this.formValue.reset();
      },
    });
  }
  showSave() {
    this.btnSaveShow = true;
    this.btnUpdateShow = false;
  }

  showUpdate() {
    this.btnSaveShow = false;
    this.btnUpdateShow = true;
  }
  // fetch data in form
  EditStudent(data: any) {
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['class'].setValue(data.class);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.studentobj.id = data.id;
    this.showUpdate();
  }

  UpdateStudent() {
    this.studentobj.name = this.formValue.value.name;
    this.studentobj.class = this.formValue.value.class;
    this.studentobj.email = this.formValue.value.email;
    this.studentobj.mobile = this.formValue.value.mobile;

    this.api.putStudent(this.studentobj, this.studentobj.id).subscribe({
      next: (v) => {
        console.log('next->', v);
      },
      error: (e) => {
        alert('Error');
        console.log(e);
      },
      complete: () => {
        console.log('complete update');
        alert('Data Updated');
        this.GetAllStudent();
        this.showSave();
        this.studentobj.id = 0;
      },
    });
  }

  GetAllStudent() {
    this.api.getStudent().subscribe((res) => {
      console.log('GetAllStudent->', res);

      this.studentList = res;
    });
  }
  DeleteStudent(data: any) {
    console.log('delData->', data.id);
    if (window.confirm('Do you want to delete?')) {
      this.api.deleteStudent(data.id).subscribe({
        next: (v) => {
          console.log('next->', v);
        },
        error: (e) => {
          alert('Error');
          console.log(e);
        },
        complete: () => {
          // alert('Student record deleted!');
          this.GetAllStudent();
        },
      });
    }
  }
}
