import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  uploadForm;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.uploadForm = this.fb.group({
      csv: [null, Validators.required]
    });
  }

  ngOnInit() {
  }

  onUpload() {
    console.log(this.uploadForm.value);
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.uploadForm.patchValue({
          csv: reader.result
        });

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

}
