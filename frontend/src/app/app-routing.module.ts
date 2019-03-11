import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { StoryComponent } from './story/story.component';
import { VisualizeComponent } from './visualize/visualize.component';

const routes: Routes = [
  {path: ':project_id/editor', component: EditorComponent},
  { path: ':project_id/story', component: StoryComponent},
  { path: ':project_id/visualize', component: VisualizeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
