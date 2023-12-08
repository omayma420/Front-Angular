// todolist.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  taskArray: { id: number, nom: string; email: string; isCompleted: boolean }[] = [];
  updatedPatientForm: { id: number, nom: string, email: string } = { id: 0, nom: '', email: '' };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadTaskData();
  }

  loadTaskData() {
    this.dataService.getAllData().subscribe(
      (data: any[]) => {
        console.log('Server response:', data);

        if (Array.isArray(data) && data.length > 0) {
          this.taskArray = data.map((patient: { id: number; nom: string; email: string | null }) => ({
            id: patient.id,
            nom: patient.nom,
            email: patient.email || 'N/A',
            isCompleted: false
          }));
        } else {
          console.warn('Data is not an array or is empty:', data);
        }
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  onSubmit() {
    console.log('Form data:', this.updatedPatientForm);

    if (this.updatedPatientForm.id) {
      // If ID exists, perform an update
      this.dataService.updateData(this.updatedPatientForm.id, this.updatedPatientForm).subscribe(
        response => {
          console.log('Server response after update:', response);
          this.loadTaskData();
        },
        error => {
          console.error('Error updating data:', error);
        }
      );
    } else {
      // If ID is not present, perform an add
      this.dataService.postData(this.updatedPatientForm).subscribe(
        response => {
          console.log('Server response after save:', response);
          this.loadTaskData();
        },
        error => {
          console.error('Error saving data:', error);
        }
      );
    }

    // Reset the form
    this.updatedPatientForm = { id: 0, nom: '', email: '' };
  }

  onDelete(index: number) {
    console.log(index);

    const deletedTask = this.taskArray[index];

    if (deletedTask && deletedTask.id) {
      this.dataService.deleteData(deletedTask.id).subscribe(
        response => {
          console.log('Server response after delete:', response);
          this.taskArray.splice(index, 1);
        },
        error => {
          console.error('Error deleting data:', error);
        }
      );
    } else {
      console.error('Task or Task ID is missing.');
    }
  }

  onUpdate(index: number) {
    const updatedTask = this.taskArray[index];

    if (updatedTask && updatedTask.id) {
      console.log('Updating Patient ID:', updatedTask.id);
      console.log('Updating Patient Data:', updatedTask);

      // Assign the existing data to the updatedPatientForm property
      this.updatedPatientForm = { ...updatedTask };
    } else {
      console.error('Task or Task ID is missing.');
    }
  }
}
