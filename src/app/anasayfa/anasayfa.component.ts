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
  deleteServer(serverId:number){
    this.yeniForm.reset();
    this.yeniForm.patchValue({id:serverId})
  }
  pasifYap(){
    alert(this.yeniForm.get('id').value)
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
  }
  formSubmit(){
    this.serverService.update$(this.yeniForm.value).subscribe(x=>{
   
    })    
    this.serverService.filter$   
    
  }
  formDelete(){
    console.log(this.yeniForm.value);
    
    this.serverService.delete$(this.yeniForm.value).subscribe(x=>{

    })
    this.serverService.filter$  
    
  }

}
