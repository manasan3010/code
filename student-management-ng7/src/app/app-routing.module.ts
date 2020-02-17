import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddStudentComponent } from './add-student/add-student.component';
import { AddCourseComponent } from './add-course/add-course.component';


const routes: Routes = [  
  { path: '', component: AddStudentComponent },
  { path: 'student/add', component: AddStudentComponent },
  { path: 'student/edit', component: AddCourseComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
