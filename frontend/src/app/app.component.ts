import { Component } from '@angular/core';
import { ProjectService } from './data/project.service';
import { Project } from './models/project.interface';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  projects: Array<Project>;

  constructor(private projectService: ProjectService) {
    this.projectService.getAll()
      .subscribe(
        data => {
          this.projects = data;
        },
        error => {
          console.log(error);
        }
      );
  }
}
