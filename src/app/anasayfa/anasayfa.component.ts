import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { DataState } from 'src/enum/data-state.enum';
import { Status } from 'src/enum/status.enum';
import { AppState } from 'src/interface/app-state';
import { Category } from 'src/interface/category';
import { CustomResponse } from 'src/interface/custom-response';
import { Server } from 'src/interface/server';
import { IPFormModel } from '../models/form.models';
import { NotificationService } from '../service/notification.service';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-anasayfa',
  templateUrl: './anasayfa.component.html',
  styleUrls: ['./anasayfa.component.scss'],
})
export class AnasayfaComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  yeniForm=new IPFormModel();

  constructor(
    private serverService: ServerService,
    private notifier: NotificationService,
    private route: ActivatedRoute,
    private router:Router
  ) {
    this.isLoading$.subscribe(x=>{
      if (x){
          
      }else{

      }
    })
  }

  ngOnInit(): void {

    let id = this.route.snapshot.params.id;
    this.appState$ = this.serverService.serversbycategory$(id).pipe(
      map((response) => {
        this.notifier.onDefault(response.message);
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED_STATE,
          appData: {
            ...response,
            data: { servers: response.data.servers.reverse() },
          },
        };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }
  categoryName: number;
    kategoriler =
     [
      { value: 3, text: 'Taşra' },
      { value: 2, text: 'Merkez' },
    ];

 
  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress).pipe(
      map((response) => {
        const index = this.dataSubject.value.data.servers.findIndex(
          (server) => server.id === response.data.server.id
        );
        this.dataSubject.value.data.servers[index] = response.data.server;
        this.notifier.onDefault(response.message);
        this.filterSubject.next('');
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
        this.filterSubject.next('');
        this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    console.log(serverForm.value)
    this.appState$ = this.serverService.save$(serverForm.value as Server).pipe(
      map((response) => {
        console.log(serverForm.value)
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
        serverForm.resetForm({ status: this.Status.SERVER_DOWN });
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

  filterServers(status: Status): void {
    this.appState$ = this.serverService
      .filter$(status, this.dataSubject.value)
      .pipe(
        map((response) => {
          this.notifier.onDefault(response.message);
          return { dataState: DataState.LOADED_STATE, appData: response };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id).pipe(
      map((response) => {
        this.dataSubject.next({
          ...response,
          data: {
            servers: this.dataSubject.value.data.servers.filter(
              (s) => s.id !== server.id
            ),
          },
        });
        this.notifier.onDefault(response.message);
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
        this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  printReport(): void {
    this.notifier.onDefault('Report downloaded');
    // window.print();
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'server-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }


  updateServer(server?): void {
    console.log(server);
    this.yeniForm.reset ();
    
    this.yeniForm.patchValue({categoryId:server.category?.id,...server});
  
    // console.log(updateForm.value)
    // this.appState$ = this.serverService.update$(updateForm.value as Server).pipe(
    //   map((response) => {
    //     console.log(updateForm.value)
    //     this.dataSubject.next({
    //       ...response,
    //       data: {
    //         servers: [
    //           response.data.server,
    //           ...this.dataSubject.value.data.servers,
    //         ],
    //       },
    //     });
    //     this.notifier.onDefault(response.message);
    //     document.getElementById('closeModal').click();
    //     this.isLoading.next(false);
    //     updateForm.resetForm({ status: this.Status.SERVER_DOWN });
    //     return {
    //       dataState: DataState.LOADED_STATE,
    //       appData: this.dataSubject.value,
    //     };
    //   }),
    //   startWith({
    //     dataState: DataState.LOADED_STATE,
    //     appData: this.dataSubject.value,
    //   }),
    //   catchError((error: string) => {
    //     this.isLoading.next(false);
    //     this.notifier.onError(error);
    //     return of({ dataState: DataState.ERROR_STATE, error });
    //   })
    // );
  }
  formSubmit(){
    this.serverService.update$(this.yeniForm.value).subscribe(x=>{
   
    })

    this.serverService.filter$
    
    
  }
}
