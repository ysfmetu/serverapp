import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { DataState } from 'src/enum/data-state.enum';
import { AppState } from 'src/interface/app-state';
import { CustomResponse } from 'src/interface/custom-response';
import { NotificationService } from '../service/notification.service';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>; 
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null);

  constructor(
    private serverService: ServerService,
    private notifier: NotificationService,
    private router : Router
  ) {}

  ngOnInit(): void {
      this.getCategories();
  }
  getCategories(){
    this.appState$ = this.serverService.categories$.pipe(
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
    ) 
  }
  goServers(id:number){
    this.router.navigate(['/anasayfa/',id]);
  }

}