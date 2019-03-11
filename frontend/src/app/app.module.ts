import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MenuComponent } from './components/menu/menu.component';
import { EditorComponent } from './editor/editor.component';
import { StoryComponent } from './story/story.component';
import { VisualizeComponent } from './visualize/visualize.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    EditorComponent,
    StoryComponent,
    VisualizeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
