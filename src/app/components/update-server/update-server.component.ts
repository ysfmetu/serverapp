import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { ServerService } from 'src/app/service/server.service';
import { DataState } from 'src/enum/data-state.enum';
import { Status } from 'src/enum/status.enum';
import { AppState } from 'src/interface/app-state';
import { CustomResponse } from 'src/interface/custom-response';
import { Server } from 'src/interface/server';

@Component({
  selector: 'app-update-server',
  templateUrl: './update-server.component.html',
  styleUrls: ['./update-server.component.scss']
})
export class UpdateServerComponent implements OnInit {

  server :Server;
  id:number;
  appState$: Observable<AppState<CustomResponse>>;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  readonly Status = Status;
  private dataSubject = new BehaviorSubject<CustomResponse>(null);

  constructor(private serverService:ServerService, private route: ActivatedRoute,private notifier: NotificationService,) { }

  ngOnInit(): void {

    this.id=this.route.snapshot.params['id'];
    this.serverService.getServerById$(this.id).subscribe(data=>{
      console.log(data)
      
    })
  }

  categoryName: number;
    kategoriler =
     [
      { value: 3, text: 'Taşra' },
      { value: 2, text: 'Merkez' },
    ];

  updateServer(updateForm: NgForm): void {
    this.isLoading.next(true);
    console.log(updateForm.value)
    this.appState$ = this.serverService.update$(updateForm.value as Server).pipe(
      map((response) => {
        console.log(updateForm.value)
        this.dataSubject.next({
          ...response,
          data: {
            servers: [
              response.data.server,
              ...this.dataSubject.value.data.servers,
            ],
          },
        });
        this.notifier.onDefault(response.message);
        document.getElementById('closeModal').click();
        this.isLoading.next(false);
        updateForm.resetForm({ status: this.Status.SERVER_DOWN });
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.isLoading.next(false);
        this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

}
